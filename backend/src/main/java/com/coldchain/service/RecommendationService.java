package com.coldchain.service;

import com.coldchain.dto.response.RecommendationResponse;
import com.coldchain.model.Facility;
import com.coldchain.model.Shipment;
import com.coldchain.util.HaversineUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private static final double MAX_RADIUS_KM = 150.0;

    private final ShipmentService shipmentService;
    private final FacilityService facilityService;

    public List<RecommendationResponse> recommendFacilities(String shipmentId) {
        Shipment shipment = shipmentService.getShipmentOrThrow(shipmentId);
        List<Facility> facilities = facilityService.getAllActiveFacilities();

        double refLat = shipment.getCurrentLatitude() != 0 ? shipment.getCurrentLatitude() : shipment.getSourceLatitude();
        double refLon = shipment.getCurrentLongitude() != 0 ? shipment.getCurrentLongitude() : shipment.getSourceLongitude();

        return facilities.stream()
                .map(facility -> {
                    double distance = HaversineUtil.distanceKm(refLat, refLon, facility.getLatitude(), facility.getLongitude());
                    boolean compatible = facility.getSupportedCategories() == null
                            || facility.getSupportedCategories().isEmpty()
                            || facility.getSupportedCategories().contains(shipment.getCategory());
                    boolean hasCapacity = facility.getAvailableCapacity() >= shipment.getQuantity();

                    double score = score(distance, facility.getAvailableCapacity(), compatible, hasCapacity);

                    return RecommendationResponse.builder()
                            .facilityId(facility.getId())
                            .facilityName(facility.getName())
                            .facilityType(facility.getType().name())
                            .distanceKm(Math.round(distance * 100.0) / 100.0)
                            .availableCapacity(facility.getAvailableCapacity())
                            .categoryCompatible(compatible)
                            .score(Math.round(score * 100.0) / 100.0)
                            .build();
                })
                .filter(r -> r.getDistanceKm() <= MAX_RADIUS_KM)
                .sorted(Comparator.comparingDouble(RecommendationResponse::getScore).reversed())
                .toList();
    }

    private double score(double distanceKm, double availableCapacity, boolean compatible, boolean hasCapacity) {
        // Higher score = better recommendation.
        double distanceScore = Math.max(0, 100 - distanceKm); // closer is better
        double capacityScore = Math.min(50, availableCapacity / 10.0); // more capacity is better, capped
        double compatibilityBonus = compatible ? 30 : 0;
        double capacityAvailabilityBonus = hasCapacity ? 20 : 0;

        return distanceScore * 0.5 + capacityScore * 0.2 + compatibilityBonus + capacityAvailabilityBonus;
    }
}
