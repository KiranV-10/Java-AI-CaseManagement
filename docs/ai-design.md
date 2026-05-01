# AI Design

## Provider Architecture

The AI layer uses a pluggable provider interface:

```java
public interface AiProvider {
    AiClassificationResponse classifyRequest(AiClassificationRequest request);
    AiSummaryResponse generateCaseSummary(AiSummaryRequest request);
    String getProviderName();
    String getModelName();
}
```

## Default Provider: Google Gemini API

The MVP uses Google Gemini API via direct REST calls (no SDK dependency). This was chosen because:

- Simple API key setup (no cloud account needed for testing)
- Excellent classification and summarization capabilities
- Aligns with the job's mention of Google GCP AI technologies
- Low-friction demo experience

## How to Add AWS Bedrock

1. Implement `BedrockAiProvider` class
2. Add AWS SDK dependencies to pom.xml
3. Use `@ConditionalOnProperty(name = "ai.provider", havingValue = "bedrock")`
4. Set `AI_PROVIDER=bedrock` in environment

## Prompt Strategy

Two prompt templates are used:

1. **Classification Prompt**: Takes citizen request details and returns suggested category, priority, confidence score, reasoning, and citizen guidance
2. **Summary Prompt**: Takes full case details (including notes and status history) and returns summary, key facts, missing information, suggested next action, and citizen-friendly explanation

Both use the same system prompt that instructs the AI to:
- Not provide legal advice
- Not make official decisions
- Return valid JSON only
- Keep responses professional and concise

## JSON Parsing

`AiResponseParser` handles:
- Stripping markdown code fences if present
- Parsing JSON with Jackson
- Validating required fields and priority values
- Throwing `AiProviderException` on parse failure

## Error Handling

When AI fails (missing key, API error, parse failure):
- The user request is still saved successfully
- AI status is marked as FAILED in the database
- The error is audit-logged
- UI shows a clear "AI unavailable" message
- No fake/keyword-based fallback is used

## AI Safety

All AI responses include this disclaimer:

> AI-generated recommendations are for staff assistance only. They do not represent legal advice, official agency decisions, or final case outcomes.
