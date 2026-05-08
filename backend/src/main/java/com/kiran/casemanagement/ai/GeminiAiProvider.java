package com.kiran.casemanagement.ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kiran.casemanagement.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;
import java.time.Duration;
import java.util.*;

@Service
public class GeminiAiProvider implements AiProvider {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiProvider.class);
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent";
    private static final String API_KEY_HEADER = "x-goog-api-key";
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String model;

    public GeminiAiProvider(
            @Value("${ai.gemini.api-key:}") String apiKey,
            @Value("${ai.gemini.model:gemini-2.0-flash}") String model) {
        this.restTemplate = new RestTemplateBuilder()
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(30))
                .build();
        this.apiKey = apiKey;
        this.model = model;
    }

    @Override
    public String getProviderName() { return "gemini"; }

    @Override
    public String getModelName() { return model; }

    @Override
    public AiClassificationResponse classifyRequest(AiClassificationRequest request) {
        checkApiKey();
        String systemPrompt = AiPromptBuilder.systemPrompt();
        String userPrompt = AiPromptBuilder.buildClassificationPrompt(request);
        String raw = callGemini(systemPrompt, userPrompt);
        return AiResponseParser.parseClassification(raw);
    }

    @Override
    public AiSummaryResponse generateCaseSummary(AiSummaryRequest request) {
        checkApiKey();
        String systemPrompt = AiPromptBuilder.systemPrompt();
        String userPrompt = AiPromptBuilder.buildSummaryPrompt(request);
        String raw = callGemini(systemPrompt, userPrompt);
        return AiResponseParser.parseSummary(raw);
    }

    private void checkApiKey() {
        if (apiKey == null || apiKey.isBlank()) {
            throw new AiProviderException("Gemini API key is not configured. Set GEMINI_API_KEY environment variable.");
        }
    }

    private String callGemini(String systemPrompt, String userPrompt) {
        String url = String.format(GEMINI_URL, model);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("system_instruction", Map.of("parts", List.of(Map.of("text", systemPrompt))));
        body.put("contents", List.of(
                Map.of("role", "user", "parts", List.of(Map.of("text", userPrompt)))
        ));
        body.put("generationConfig", Map.of(
                "temperature", 0.2,
                "responseMimeType", "application/json"
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set(API_KEY_HEADER, apiKey);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.POST, new HttpEntity<>(body, headers), Map.class);

            Map<?, ?> responseBody = response.getBody();
            if (responseBody == null) throw new AiProviderException("Empty response from Gemini API");

            String text = extractResponseText(responseBody);
            log.info("Gemini API call successful, response length: {}", text.length());
            return text;
        } catch (AiProviderException e) {
            throw e;
        } catch (HttpClientErrorException.TooManyRequests e) {
            String message = buildQuotaErrorMessage(e.getResponseBodyAsString());
            log.error("Gemini API quota or billing error: {}", message);
            throw new AiProviderException(message, e);
        } catch (RestClientResponseException e) {
            String message = buildHttpErrorMessage(e);
            log.error("Gemini API call failed: {}", message);
            throw new AiProviderException(message, e);
        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            throw new AiProviderException("Gemini API call failed: " + e.getMessage(), e);
        }
    }

    private String extractResponseText(Map<?, ?> responseBody) {
        Object candidatesValue = responseBody.get("candidates");
        if (!(candidatesValue instanceof List<?> candidates) || candidates.isEmpty()) {
            throw new AiProviderException("Gemini response did not include candidates.");
        }

        Object candidateValue = candidates.get(0);
        if (!(candidateValue instanceof Map<?, ?> candidate)) {
            throw new AiProviderException("Gemini response candidate had an unexpected format.");
        }

        Object finishReason = candidate.get("finishReason");
        if (finishReason != null && !"STOP".equals(finishReason.toString())) {
            throw new AiProviderException("Gemini response finished with reason: " + finishReason);
        }

        Object contentValue = candidate.get("content");
        if (!(contentValue instanceof Map<?, ?> content)) {
            throw new AiProviderException("Gemini response did not include content.");
        }

        Object partsValue = content.get("parts");
        if (!(partsValue instanceof List<?> parts) || parts.isEmpty()) {
            throw new AiProviderException("Gemini response did not include content parts.");
        }

        for (Object partValue : parts) {
            if (partValue instanceof Map<?, ?> part) {
                Object text = part.get("text");
                if (text instanceof String textValue && !textValue.isBlank()) {
                    return textValue;
                }
            }
        }

        throw new AiProviderException("Gemini response did not include text content.");
    }

    private String buildQuotaErrorMessage(String responseBody) {
        String details = extractGeminiErrorMessage(responseBody);
        if (details.toLowerCase(Locale.ROOT).contains("prepayment credits are depleted")) {
            return "Gemini API quota or billing is exhausted. The API key is valid, but the Google AI Studio project has no available prepayment credits. Details: " + details;
        }
        return "Gemini API rate limit or quota was exceeded. Details: " + details;
    }

    private String buildHttpErrorMessage(RestClientResponseException e) {
        String details = extractGeminiErrorMessage(e.getResponseBodyAsString());
        return "Gemini API call failed (" + e.getStatusCode() + "): " + details;
    }

    private String extractGeminiErrorMessage(String responseBody) {
        if (responseBody == null || responseBody.isBlank()) {
            return "No error details returned.";
        }

        try {
            Map<String, Object> body = MAPPER.readValue(responseBody, new TypeReference<>() {});
            Object error = body.get("error");
            if (error instanceof Map<?, ?> errorMap) {
                Object message = errorMap.get("message");
                if (message != null) {
                    return message.toString();
                }
            }
        } catch (Exception ignored) {
            // Fall through to compact raw response for non-JSON errors.
        }

        return responseBody.replace('\n', ' ').replace('\r', ' ').trim();
    }
}
