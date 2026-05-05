package com.kiran.casemanagement.ai;

import com.kiran.casemanagement.dto.AiClassificationRequest;
import com.kiran.casemanagement.dto.AiSummaryRequest;

public final class AiPromptBuilder {

    private AiPromptBuilder() {}

    public static String systemPrompt() {
        return """
                You are an AI assistant inside a labor services case management system.

                Your job is to assist internal staff by classifying citizen requests, summarizing case information, identifying missing information, and suggesting administrative next steps.

                Rules:
                - Do not provide legal advice.
                - Do not make official agency decisions.
                - Do not determine eligibility for benefits.
                - Do not promise outcomes.
                - Keep responses concise and professional.
                - Return valid JSON only.
                - Do not include markdown.
                - If information is insufficient, list what is missing.""";
    }

    public static String buildClassificationPrompt(AiClassificationRequest req) {
        return """
                Classify the following citizen labor service request.

                Return valid JSON with exactly these fields:
                {
                  "suggestedCategory": string,
                  "suggestedPriority": "LOW" | "MEDIUM" | "HIGH" | "URGENT",
                  "confidenceScore": number,
                  "reasoning": string,
                  "citizenGuidance": string
                }

                Allowed categories:
                - Unemployment Benefits
                - Wage and Hour Concern
                - Workers' Compensation
                - Youth Employment
                - Labor Standards
                - General Inquiry

                Citizen selected category:
                %s

                Citizen selected urgency:
                %s

                Title:
                %s

                Description:
                %s

                Optional employer name:
                %s

                Optional incident date:
                %s""".formatted(
                nullSafe(req.getSelectedCategory()),
                nullSafe(req.getUrgency()),
                nullSafe(req.getTitle()),
                nullSafe(req.getDescription()),
                nullSafe(req.getEmployerName()),
                nullSafe(req.getIncidentDate()));
    }

    public static String buildSummaryPrompt(AiSummaryRequest req) {
        return """
                Generate a staff-facing case summary for the following labor service request.

                Return valid JSON with exactly these fields:
                {
                  "summary": string,
                  "keyFacts": string[],
                  "missingInformation": string[],
                  "suggestedNextAction": string,
                  "citizenFriendlyExplanation": string
                }

                Rules:
                - Do not give legal advice.
                - Do not determine eligibility.
                - Do not promise outcomes.
                - Focus on administrative next steps.
                - Use concise professional wording.

                Case details:
                %s

                Internal notes:
                %s

                Status history:
                %s""".formatted(
                nullSafe(req.getCaseDetails()),
                nullSafe(req.getInternalNotes()),
                nullSafe(req.getStatusHistory()));
    }

    private static String nullSafe(String value) {
        return value == null ? "N/A" : value;
    }
}
