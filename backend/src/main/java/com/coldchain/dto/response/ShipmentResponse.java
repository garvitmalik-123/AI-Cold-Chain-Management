package com.coldchain.dto.response;

import com.coldchain.model.ProductCategory;
import com.coldchain.model.RiskLevel;
import com.coldchain.model.ShipmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentResponse {
    private String id;
    private String product;
    private ProductCategory category;
    private double quantity;
    private String source;
    private String destination;
    private double sourceLatitude;
    private double sourceLongitude;
    private double destinationLatitude;
    private double destinationLongitude;
    private double temperature;
    private double humidity;
    private double currentLatitude;
    private double currentLongitude;
    private ShipmentStatus status;
    private RiskLevel riskLevel;
    private String createdBy;
    private Instant createdAt;
    private Instant updatedAt;
}
