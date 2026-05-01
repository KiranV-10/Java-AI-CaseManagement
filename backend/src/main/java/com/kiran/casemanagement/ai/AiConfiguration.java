package com.kiran.casemanagement.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class AiConfiguration {

    private static final Logger log = LoggerFactory.getLogger(AiConfiguration.class);

    @Bean
    @Primary
    public AiProvider aiProvider(
            @Value("${ai.provider:gemini}") String provider,
            @Value("${ai.gemini.api-key:}") String apiKey,
            @Value("${ai.gemini.model:gemini-2.0-flash}") String model) {

        if ("bedrock".equalsIgnoreCase(provider)) {
            log.info("AI provider configured: AWS Bedrock (stub)");
            return new BedrockAiProvider();
        }

        log.info("AI provider configured: Google Gemini (model: {})", model);
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("GEMINI_API_KEY is not set. AI features will return unavailable status.");
        }
        return new GeminiAiProvider(apiKey, model);
    }
}
