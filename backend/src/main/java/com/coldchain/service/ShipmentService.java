package com.coldchain.service;

import com.coldchain.dto.request.ShipmentRequest;
import com.coldchain.dto.response.RiskResponse;
import com.coldchain.dto.response.ShipmentResponse;
import com.coldchain.exception.ResourceNotFoundException;
import com.coldchain.model.Shipment;
import com.coldchain.model.ShipmentStatus;
import com.coldchain.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final SpoilageRiskService spoilageRiskService;

    public ShipmentResponse createShipment(ShipmentRequest request, String createdBy) {
        Shipment shipment = Shipment.builder()
                .product(request.getProduct())
                .category(request.getCategory())
                .quantity(request.getQuantity())
                .source(request.getSource())
                .destination(request.getDestination())
                .sourceLatitude(request.getSourceLatitude())
                .sourceLongitude(request.getSourceLongitude())
                .destinationLatitude(request.getDestinationLatitude())
                .destinationLongitude(request.getDestinationLongitude())
                .temperature(request.getTemperature())
                .humidity(request.getHumidity())
                .currentLatitude(request.getCurrentLatitude() != 0 ? request.getCurrentLatitude() : request.getSourceLatitude())
                .currentLongitude(request.getCurrentLongitude() != 0 ? request.getCurrentLongitude() : request.getSourceLongitude())
                .status(ShipmentStatus.CREATED)
                .createdBy(createdBy)
                .createdAt(Instant.now())
                .build();

        shipment.setRiskLevel(spoilageRiskService.calculateRisk(
                shipment.getCategory(), shipment.getTemperature(), shipment.getHumidity(), shipment.getStatus()));

        return toResponse(shipmentRepository.save(shipment));
    }

    public List<ShipmentResponse> getAllShipments() {
        return shipmentRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ShipmentResponse getShipmentById(String id) {
        return toResponse(getShipmentOrThrow(id));
    }

    public ShipmentResponse updateShipment(String id, ShipmentRequest request) {
        Shipment shipment = getShipmentOrThrow(id);

        shipment.setProduct(request.getProduct());
        shipment.setCategory(request.getCategory());
        shipment.setQuantity(request.getQuantity());
        shipment.setSource(request.getSource());
        shipment.setDestination(request.getDestination());
        shipment.setSourceLatitude(request.getSourceLatitude());
        shipment.setSourceLongitude(request.getSourceLongitude());
        shipment.setDestinationLatitude(request.getDestinationLatitude());
        shipment.setDestinationLongitude(request.getDestinationLongitude());
        shipment.setTemperature(request.getTemperature());
        shipment.setHumidity(request.getHumidity());
        shipment.setCurrentLatitude(request.getCurrentLatitude());
        shipment.setCurrentLongitude(request.getCurrentLongitude());
        shipment.setUpdatedAt(Instant.now());

        shipment.setRiskLevel(spoilageRiskService.calculateRisk(
                shipment.getCategory(), shipment.getTemperature(), shipment.getHumidity(), shipment.getStatus()));

        return toResponse(shipmentRepository.save(shipment));
    }

    public ShipmentResponse updateStatus(String id, ShipmentStatus status) {
        Shipment shipment = getShipmentOrThrow(id);
        shipment.setStatus(status);
        shipment.setUpdatedAt(Instant.now());
        shipment.setRiskLevel(spoilageRiskService.calculateRisk(
                shipment.getCategory(), shipment.getTemperature(), shipment.getHumidity(), shipment.getStatus()));
        return toResponse(shipmentRepository.save(shipment));
    }

    public RiskResponse getRisk(String id) {
        Shipment shipment = getShipmentOrThrow(id);
        String reason = spoilageRiskService.explainRisk(
                shipment.getCategory(), shipment.getTemperature(), shipment.getHumidity(), shipment.getStatus());
        return RiskResponse.builder()
                .shipmentId(shipment.getId())
                .riskLevel(shipment.getRiskLevel())
                .reason(reason)
                .temperature(shipment.getTemperature())
                .humidity(shipment.getHumidity())
                .build();
    }

    public void deleteShipment(String id) {
        Shipment shipment = getShipmentOrThrow(id);
        shipmentRepository.delete(shipment);
    }

    public Shipment getShipmentOrThrow(String id) {
        return shipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with id: " + id));
    }

    public Shipment saveShipment(Shipment shipment) {
        return shipmentRepository.save(shipment);
    }

    public ShipmentResponse toResponse(Shipment shipment) {
        return ShipmentResponse.builder()
                .id(shipment.getId())
                .product(shipment.getProduct())
                .category(shipment.getCategory())
                .quantity(shipment.getQuantity())
                .source(shipment.getSource())
                .destination(shipment.getDestination())
                .sourceLatitude(shipment.getSourceLatitude())
                .sourceLongitude(shipment.getSourceLongitude())
                .destinationLatitude(shipment.getDestinationLatitude())
                .destinationLongitude(shipment.getDestinationLongitude())
                .temperature(shipment.getTemperature())
                .humidity(shipment.getHumidity())
                .currentLatitude(shipment.getCurrentLatitude())
                .currentLongitude(shipment.getCurrentLongitude())
                .status(shipment.getStatus())
                .riskLevel(shipment.getRiskLevel())
                .createdBy(shipment.getCreatedBy())
                .createdAt(shipment.getCreatedAt())
                .updatedAt(shipment.getUpdatedAt())
                .build();
    }
}
