package com.coldchain.service;

import com.coldchain.dto.request.EnvironmentUpdateRequest;
import com.coldchain.dto.response.EnvironmentLogResponse;
import com.coldchain.model.EnvironmentLog;
import com.coldchain.model.RiskLevel;
import com.coldchain.model.Shipment;
import com.coldchain.repository.EnvironmentLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnvironmentService {

    private final EnvironmentLogRepository environmentLogRepository;
    private final ShipmentService shipmentService;
    private final SpoilageRiskService spoilageRiskService;

    public EnvironmentLogResponse recordUpdate(String shipmentId, EnvironmentUpdateRequest request) {
        Shipment shipment = shipmentService.getShipmentOrThrow(shipmentId);

        // update live shipment readings
        shipment.setTemperature(request.getTemperature());
        shipment.setHumidity(request.getHumidity());
        shipment.setCurrentLatitude(request.getLatitude());
        shipment.setCurrentLongitude(request.getLongitude());
        shipment.setUpdatedAt(Instant.now());

        RiskLevel riskLevel = spoilageRiskService.calculateRisk(
                shipment.getCategory(), shipment.getTemperature(), shipment.getHumidity(), shipment.getStatus());
        shipment.setRiskLevel(riskLevel);

        shipmentService.saveShipment(shipment);

        EnvironmentLog log = EnvironmentLog.builder()
                .shipmentId(shipmentId)
                .temperature(request.getTemperature())
                .humidity(request.getHumidity())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .riskLevelAtCapture(riskLevel)
                .recordedAt(Instant.now())
                .build();

        return toResponse(environmentLogRepository.save(log));
    }

    public List<EnvironmentLogResponse> getHistory(String shipmentId) {
        shipmentService.getShipmentOrThrow(shipmentId); // ensures shipment exists
        return environmentLogRepository.findByShipmentIdOrderByRecordedAtDesc(shipmentId)
                .stream().map(this::toResponse).toList();
    }

    private EnvironmentLogResponse toResponse(EnvironmentLog log) {
        return EnvironmentLogResponse.builder()
                .id(log.getId())
                .shipmentId(log.getShipmentId())
                .temperature(log.getTemperature())
                .humidity(log.getHumidity())
                .latitude(log.getLatitude())
                .longitude(log.getLongitude())
                .riskLevelAtCapture(log.getRiskLevelAtCapture())
                .recordedAt(log.getRecordedAt())
                .build();
    }
}
