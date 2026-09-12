package com.coldchain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "shipments")
public class Shipment {

    @Id
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

    // current live readings
    private double temperature;
    private double humidity;
    private double currentLatitude;
    private double currentLongitude;

    @Builder.Default
    private ShipmentStatus status = ShipmentStatus.CREATED;

    @Builder.Default
    private RiskLevel riskLevel = RiskLevel.LOW;

    private String createdBy;

    @Builder.Default
    private Instant createdAt = Instant.now();

    private Instant updatedAt;
}
