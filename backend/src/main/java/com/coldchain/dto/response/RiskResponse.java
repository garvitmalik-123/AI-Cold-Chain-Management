package com.coldchain.dto.response;

import com.coldchain.model.RiskLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskResponse {
    private String shipmentId;
    private RiskLevel riskLevel;
    private String reason;
    private double temperature;
    private double humidity;
}
