package com.coldchain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "environment_logs")
public class EnvironmentLog {

    @Id
    private String id;

    @Indexed
    private String shipmentId;

    private double temperature;
    private double humidity;
    private double latitude;
    private double longitude;

    private RiskLevel riskLevelAtCapture;

    @Builder.Default
    private Instant recordedAt = Instant.now();
}
