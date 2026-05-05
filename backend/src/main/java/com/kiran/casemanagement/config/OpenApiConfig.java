package com.kiran.casemanagement.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Labor Services AI Case Management API")
                        .version("1.0.0")
                        .description("REST API for managing labor service requests with AI-assisted classification and summarization.")
                        .contact(new Contact().name("Kiran Velamati")));
    }
}
