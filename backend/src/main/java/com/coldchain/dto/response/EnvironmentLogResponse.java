package com.coldchain.dto.response;

import com.coldchain.model.RiskLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnvironmentLogResponse {
    private String id;
    private String shipmentId;
    private double temperature;
    private double humidity;
    private double latitude;
    private double longitude;
    private RiskLevel riskLevelAtCapture;
    private Instant recordedAt;
}
