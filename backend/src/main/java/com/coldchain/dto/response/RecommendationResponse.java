package com.coldchain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponse {
    private String facilityId;
    private String facilityName;
    private String facilityType;
    private double distanceKm;
    private double availableCapacity;
    private boolean categoryCompatible;
    private double score;
}
