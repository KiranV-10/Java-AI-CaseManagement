package com.kiran.casemanagement.ai;

import com.kiran.casemanagement.dto.AiClassificationRequest;
import com.kiran.casemanagement.dto.AiSummaryRequest;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class GeminiAiProviderTest {

    @Test
    void classifyRequest_noApiKey_throwsException() {
        GeminiAiProvider provider = new GeminiAiProvider("", "gemini-2.0-flash");

        AiClassificationRequest request = AiClassificationRequest.builder()
                .title("Test").description("Test description")
                .selectedCategory("General Inquiry").urgency("LOW")
                .build();

        AiProviderException ex = assertThrows(AiProviderException.class,
                () -> provider.classifyRequest(request));
        assertTrue(ex.getMessage().contains("not configured"));
    }

    @Test
    void generateSummary_noApiKey_throwsException() {
        GeminiAiProvider provider = new GeminiAiProvider(null, "gemini-2.0-flash");

        AiSummaryRequest request = AiSummaryRequest.builder()
                .caseDetails("Test case").internalNotes("notes").statusHistory("history")
                .build();

        AiProviderException ex = assertThrows(AiProviderException.class,
                () -> provider.generateCaseSummary(request));
        assertTrue(ex.getMessage().contains("not configured"));
    }

    @Test
    void providerName() {
        GeminiAiProvider provider = new GeminiAiProvider("", "gemini-2.0-flash");
        assertEquals("gemini", provider.getProviderName());
        assertEquals("gemini-2.0-flash", provider.getModelName());
    }
}
