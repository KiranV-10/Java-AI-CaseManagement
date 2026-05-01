package com.kiran.casemanagement.ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kiran.casemanagement.dto.AiClassificationResponse;
import com.kiran.casemanagement.dto.AiSummaryResponse;
import java.util.List;
import java.util.Map;
import java.util.Set;

public final class AiResponseParser {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final Set<String> VALID_PRIORITIES = Set.of("LOW", "MEDIUM", "HIGH", "URGENT");

    private AiResponseParser() {}

    public static AiClassificationResponse parseClassification(String raw) {
        try {
            String json = stripMarkdownFences(raw);
            Map<String, Object> map = MAPPER.readValue(json, new TypeReference<>() {});

            String priority = getString(map, "suggestedPriority");
            if (!VALID_PRIORITIES.contains(priority)) {
                throw new AiProviderException("Invalid priority value: " + priority);
            }

            return AiClassificationResponse.builder()
                    .suggestedCategory(requireString(map, "suggestedCategory"))
                    .suggestedPriority(priority)
                    .confidenceScore(getDouble(map, "confidenceScore"))
                    .reasoning(requireString(map, "reasoning"))
                    .citizenGuidance(requireString(map, "citizenGuidance"))
                    .build();
        } catch (AiProviderException e) {
            throw e;
        } catch (Exception e) {
            throw new AiProviderException("Failed to parse AI classification response: " + e.getMessage(), e);
        }
    }

    public static AiSummaryResponse parseSummary(String raw) {
        try {
            String json = stripMarkdownFences(raw);
            Map<String, Object> map = MAPPER.readValue(json, new TypeReference<>() {});

            return AiSummaryResponse.builder()
                    .summary(requireString(map, "summary"))
                    .keyFacts(getStringList(map, "keyFacts"))
                    .missingInformation(getStringList(map, "missingInformation"))
                    .suggestedNextAction(requireString(map, "suggestedNextAction"))
                    .citizenFriendlyExplanation(requireString(map, "citizenFriendlyExplanation"))
                    .build();
        } catch (AiProviderException e) {
            throw e;
        } catch (Exception e) {
            throw new AiProviderException("Failed to parse AI summary response: " + e.getMessage(), e);
        }
    }

    static String stripMarkdownFences(String raw) {
        if (raw == null) throw new AiProviderException("AI response was null");
        String trimmed = raw.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        return trimmed.trim();
    }

    private static String requireString(Map<String, Object> map, String key) {
        Object val = map.get(key);
        if (val == null) throw new AiProviderException("Missing required field: " + key);
        return val.toString();
    }

    private static String getString(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val != null ? val.toString() : null;
    }

    private static double getDouble(Map<String, Object> map, String key) {
        Object val = map.get(key);
        if (val instanceof Number n) return n.doubleValue();
        if (val != null) {
            try { return Double.parseDouble(val.toString()); } catch (NumberFormatException ignored) {}
        }
        return 0.0;
    }

    @SuppressWarnings("unchecked")
    private static List<String> getStringList(Map<String, Object> map, String key) {
        Object val = map.get(key);
        if (val instanceof List<?> list) {
            return list.stream().map(Object::toString).toList();
        }
        return List.of();
    }
}
