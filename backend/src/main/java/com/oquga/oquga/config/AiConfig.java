package com.oquga.oquga.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "ai")
@Getter
@Setter
public class AiConfig {

    private String provider = "openai";
    private String apiKey;
    private String model = "gpt-4o-mini";
    private String baseUrl = "https://api.openai.com/v1";
    private int maxTokens = 2000;
    private double temperature = 0.7;

    public boolean isAnthropic() {
        return "anthropic".equalsIgnoreCase(provider);
    }

    public boolean isOpenAiCompatible() {
        return "openai".equalsIgnoreCase(provider) || "xai".equalsIgnoreCase(provider);
    }
}
