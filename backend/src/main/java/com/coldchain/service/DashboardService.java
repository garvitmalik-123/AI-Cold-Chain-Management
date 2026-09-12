package com.coldchain.service;

import com.coldchain.dto.response.DashboardSummaryResponse;
import com.coldchain.model.RiskLevel;
import com.coldchain.model.ShipmentStatus;
import com.coldchain.repository.FacilityRepository;
import com.coldchain.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ShipmentRepository shipmentRepository;
    private final FacilityRepository facilityRepository;

    public DashboardSummaryResponse getSummary() {
        long total = shipmentRepository.count();
        long active = shipmentRepository.countByStatusIn(List.of(ShipmentStatus.CREATED, ShipmentStatus.IN_TRANSIT));
        long highRisk = shipmentRepository.countByRiskLevel(RiskLevel.HIGH);
        long criticalRisk = shipmentRepository.countByRiskLevel(RiskLevel.CRITICAL);
        long delayed = shipmentRepository.countByStatus(ShipmentStatus.DELAYED);
        long totalFacilities = facilityRepository.count();

        return DashboardSummaryResponse.builder()
                .totalShipments(total)
                .activeShipments(active)
                .highRiskShipments(highRisk)
                .criticalRiskShipments(criticalRisk)
                .delayedShipments(delayed)
                .totalFacilities(totalFacilities)
                .build();
    }
}
