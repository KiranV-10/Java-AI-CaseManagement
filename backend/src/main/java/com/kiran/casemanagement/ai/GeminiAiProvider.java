package com.kiran.casemanagement.ai;

import com.kiran.casemanagement.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class GeminiAiProvider implements AiProvider {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiProvider.class);
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String model;

    public GeminiAiProvider(
            @Value("${ai.gemini.api-key:}") String apiKey,
            @Value("${ai.gemini.model:gemini-2.0-flash}") String model) {
        this.restTemplate = new RestTemplate();
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

    @SuppressWarnings("unchecked")
    private String callGemini(String systemPrompt, String userPrompt) {
        String url = String.format(GEMINI_URL, model, apiKey);

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

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.POST, new HttpEntity<>(body, headers), Map.class);

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null) throw new AiProviderException("Empty response from Gemini API");

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new AiProviderException("No candidates in Gemini response");
            }

            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String text = (String) parts.get(0).get("text");

            log.info("Gemini API call successful, response length: {}", text.length());
            return text;
        } catch (AiProviderException e) {
            throw e;
        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            throw new AiProviderException("Gemini API call failed: " + e.getMessage(), e);
        }
    }
}
