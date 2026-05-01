package com.kiran.casemanagement.ai;

import com.kiran.casemanagement.dto.AiClassificationResponse;
import com.kiran.casemanagement.dto.AiSummaryResponse;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AiResponseParserTest {

    @Test
    void parseClassification_validJson() {
        String json = """
                {
                  "suggestedCategory": "Wage and Hour Concern",
                  "suggestedPriority": "HIGH",
                  "confidenceScore": 0.91,
                  "reasoning": "The citizen mentions unpaid wages.",
                  "citizenGuidance": "Please provide pay stubs."
                }""";

        AiClassificationResponse result = AiResponseParser.parseClassification(json);
        assertEquals("Wage and Hour Concern", result.getSuggestedCategory());
        assertEquals("HIGH", result.getSuggestedPriority());
        assertEquals(0.91, result.getConfidenceScore(), 0.01);
        assertEquals("The citizen mentions unpaid wages.", result.getReasoning());
    }

    @Test
    void parseClassification_withMarkdownFences() {
        String json = """
                ```json
                {
                  "suggestedCategory": "General Inquiry",
                  "suggestedPriority": "LOW",
                  "confidenceScore": 0.5,
                  "reasoning": "Generic question.",
                  "citizenGuidance": "No additional info needed."
                }
                ```""";

        AiClassificationResponse result = AiResponseParser.parseClassification(json);
        assertEquals("General Inquiry", result.getSuggestedCategory());
        assertEquals("LOW", result.getSuggestedPriority());
    }

    @Test
    void parseClassification_invalidPriority() {
        String json = """
                {
                  "suggestedCategory": "Test",
                  "suggestedPriority": "SUPER_HIGH",
                  "confidenceScore": 0.5,
                  "reasoning": "test",
                  "citizenGuidance": "test"
                }""";

        assertThrows(AiProviderException.class, () -> AiResponseParser.parseClassification(json));
    }

    @Test
    void parseClassification_missingField() {
        String json = """
                {
                  "suggestedCategory": "Test",
                  "suggestedPriority": "HIGH"
                }""";

        assertThrows(AiProviderException.class, () -> AiResponseParser.parseClassification(json));
    }

    @Test
    void parseClassification_invalidJson() {
        assertThrows(AiProviderException.class, () -> AiResponseParser.parseClassification("not json"));
    }

    @Test
    void parseClassification_nullInput() {
        assertThrows(AiProviderException.class, () -> AiResponseParser.parseClassification(null));
    }

    @Test
    void parseSummary_validJson() {
        String json = """
                {
                  "summary": "Citizen reports unpaid wages.",
                  "keyFacts": ["Worked 45 hours", "No payment for two weeks"],
                  "missingInformation": ["Employer address", "Pay stubs"],
                  "suggestedNextAction": "Request documentation.",
                  "citizenFriendlyExplanation": "Your request is being reviewed."
                }""";

        AiSummaryResponse result = AiResponseParser.parseSummary(json);
        assertEquals("Citizen reports unpaid wages.", result.getSummary());
        assertEquals(2, result.getKeyFacts().size());
        assertEquals(2, result.getMissingInformation().size());
        assertEquals("Request documentation.", result.getSuggestedNextAction());
    }

    @Test
    void stripMarkdownFences_plainJson() {
        assertEquals("{}", AiResponseParser.stripMarkdownFences("{}"));
    }

    @Test
    void stripMarkdownFences_withFences() {
        assertEquals("{}", AiResponseParser.stripMarkdownFences("```json\n{}\n```"));
    }
}
