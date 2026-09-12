package com.coldchain.controller;

import com.coldchain.dto.request.FacilityRequest;
import com.coldchain.dto.response.FacilityResponse;
import com.coldchain.service.FacilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/facilities")
@RequiredArgsConstructor
@Tag(name = "Facilities", description = "Cold Storage, Mandi and Processing Centre CRUD")
public class FacilityController {

    private final FacilityService facilityService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACILITY_MANAGER')")
    @Operation(summary = "Create a facility")
    public ResponseEntity<FacilityResponse> createFacility(@Valid @RequestBody FacilityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(facilityService.createFacility(request));
    }

    @GetMapping
    @Operation(summary = "Get all facilities")
    public ResponseEntity<List<FacilityResponse>> getAllFacilities() {
        return ResponseEntity.ok(facilityService.getAllFacilities());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get facility by id")
    public ResponseEntity<FacilityResponse> getFacility(@PathVariable String id) {
        return ResponseEntity.ok(facilityService.getFacilityById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACILITY_MANAGER')")
    @Operation(summary = "Update a facility")
    public ResponseEntity<FacilityResponse> updateFacility(@PathVariable String id,
                                                             @Valid @RequestBody FacilityRequest request) {
        return ResponseEntity.ok(facilityService.updateFacility(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACILITY_MANAGER')")
    @Operation(summary = "Delete a facility")
    public ResponseEntity<Void> deleteFacility(@PathVariable String id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.noContent().build();
    }
}
