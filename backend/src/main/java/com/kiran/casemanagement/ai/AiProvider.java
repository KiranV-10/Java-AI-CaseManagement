package com.kiran.casemanagement.ai;

import com.kiran.casemanagement.dto.AiClassificationRequest;
import com.kiran.casemanagement.dto.AiClassificationResponse;
import com.kiran.casemanagement.dto.AiSummaryRequest;
import com.kiran.casemanagement.dto.AiSummaryResponse;

public interface AiProvider {
    AiClassificationResponse classifyRequest(AiClassificationRequest request);
    AiSummaryResponse generateCaseSummary(AiSummaryRequest request);
    String getProviderName();
    String getModelName();
}
