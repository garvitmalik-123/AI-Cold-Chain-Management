package com.coldchain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private long totalShipments;
    private long activeShipments;
    private long highRiskShipments;
    private long criticalRiskShipments;
    private long delayedShipments;
    private long totalFacilities;
}
