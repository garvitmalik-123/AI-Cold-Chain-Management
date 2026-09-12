package com.coldchain.controller;

import com.coldchain.dto.request.EnvironmentUpdateRequest;
import com.coldchain.dto.request.ShipmentRequest;
import com.coldchain.dto.response.EnvironmentLogResponse;
import com.coldchain.dto.response.RecommendationResponse;
import com.coldchain.dto.response.RiskResponse;
import com.coldchain.dto.response.ShipmentResponse;
import com.coldchain.model.ShipmentStatus;
import com.coldchain.security.UserPrincipal;
import com.coldchain.service.EnvironmentService;
import com.coldchain.service.RecommendationService;
import com.coldchain.service.ShipmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shipments")
@RequiredArgsConstructor
@Tag(name = "Shipments", description = "Shipment CRUD, environment tracking, risk and recommendations")
public class ShipmentController {

    private final ShipmentService shipmentService;
    private final EnvironmentService environmentService;
    private final RecommendationService recommendationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TRANSPORTER')")
    @Operation(summary = "Create a new shipment")
    public ResponseEntity<ShipmentResponse> createShipment(@Valid @RequestBody ShipmentRequest request,
                                                             @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(shipmentService.createShipment(request, principal.getUsername()));
    }

    @GetMapping
    @Operation(summary = "Get all shipments")
    public ResponseEntity<List<ShipmentResponse>> getAllShipments() {
        return ResponseEntity.ok(shipmentService.getAllShipments());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get shipment by id")
    public ResponseEntity<ShipmentResponse> getShipment(@PathVariable String id) {
        return ResponseEntity.ok(shipmentService.getShipmentById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRANSPORTER')")
    @Operation(summary = "Update a shipment")
    public ResponseEntity<ShipmentResponse> updateShipment(@PathVariable String id,
                                                             @Valid @RequestBody ShipmentRequest request) {
        return ResponseEntity.ok(shipmentService.updateShipment(id, request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRANSPORTER')")
    @Operation(summary = "Update shipment status (CREATED, IN_TRANSIT, DELAYED, DELIVERED, CANCELLED)")
    public ResponseEntity<ShipmentResponse> updateStatus(@PathVariable String id, @RequestParam ShipmentStatus status) {
        return ResponseEntity.ok(shipmentService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a shipment")
    public ResponseEntity<Void> deleteShipment(@PathVariable String id) {
        shipmentService.deleteShipment(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/environment")
    @Operation(summary = "Record a simulated temperature/humidity/location update for a shipment")
    public ResponseEntity<EnvironmentLogResponse> recordEnvironment(@PathVariable String id,
                                                                      @Valid @RequestBody EnvironmentUpdateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(environmentService.recordUpdate(id, request));
    }

    @GetMapping("/{id}/environment")
    @Operation(summary = "Get environment history for a shipment")
    public ResponseEntity<List<EnvironmentLogResponse>> getEnvironmentHistory(@PathVariable String id) {
        return ResponseEntity.ok(environmentService.getHistory(id));
    }

    @GetMapping("/{id}/risk")
    @Operation(summary = "Get current spoilage risk assessment for a shipment")
    public ResponseEntity<RiskResponse> getRisk(@PathVariable String id) {
        return ResponseEntity.ok(shipmentService.getRisk(id));
    }

    @GetMapping("/{id}/recommendations")
    @Operation(summary = "Get nearby recommended facilities for a shipment")
    public ResponseEntity<List<RecommendationResponse>> getRecommendations(@PathVariable String id) {
        return ResponseEntity.ok(recommendationService.recommendFacilities(id));
    }
}
