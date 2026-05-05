package com.kiran.casemanagement.ai;

import com.kiran.casemanagement.dto.*;

public class BedrockAiProvider implements AiProvider {

    @Override
    public AiClassificationResponse classifyRequest(AiClassificationRequest request) {
        throw new AiProviderException("AWS Bedrock provider is not yet implemented. Use Gemini provider.");
    }

    @Override
    public AiSummaryResponse generateCaseSummary(AiSummaryRequest request) {
        throw new AiProviderException("AWS Bedrock provider is not yet implemented. Use Gemini provider.");
    }

    @Override
    public String getProviderName() { return "bedrock"; }

    @Override
    public String getModelName() { return "not-configured"; }
}
