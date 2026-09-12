package com.coldchain.service;

import com.coldchain.dto.request.FacilityRequest;
import com.coldchain.dto.response.FacilityResponse;
import com.coldchain.exception.ResourceNotFoundException;
import com.coldchain.model.Facility;
import com.coldchain.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityRepository facilityRepository;

    public FacilityResponse createFacility(FacilityRequest request) {
        Facility facility = Facility.builder()
                .name(request.getName())
                .type(request.getType())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .address(request.getAddress())
                .totalCapacity(request.getTotalCapacity())
                .availableCapacity(request.getAvailableCapacity())
                .supportedCategories(request.getSupportedCategories() != null ? request.getSupportedCategories() : List.of())
                .active(true)
                .build();

        return toResponse(facilityRepository.save(facility));
    }

    public List<FacilityResponse> getAllFacilities() {
        return facilityRepository.findAll().stream().map(this::toResponse).toList();
    }

    public FacilityResponse getFacilityById(String id) {
        return toResponse(getFacilityOrThrow(id));
    }

    public FacilityResponse updateFacility(String id, FacilityRequest request) {
        Facility facility = getFacilityOrThrow(id);

        facility.setName(request.getName());
        facility.setType(request.getType());
        facility.setLatitude(request.getLatitude());
        facility.setLongitude(request.getLongitude());
        facility.setAddress(request.getAddress());
        facility.setTotalCapacity(request.getTotalCapacity());
        facility.setAvailableCapacity(request.getAvailableCapacity());
        facility.setSupportedCategories(request.getSupportedCategories() != null ? request.getSupportedCategories() : List.of());

        return toResponse(facilityRepository.save(facility));
    }

    public void deleteFacility(String id) {
        Facility facility = getFacilityOrThrow(id);
        facilityRepository.delete(facility);
    }

    public Facility getFacilityOrThrow(String id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + id));
    }

    public List<Facility> getAllActiveFacilities() {
        return facilityRepository.findAll().stream().filter(Facility::isActive).toList();
    }

    private FacilityResponse toResponse(Facility facility) {
        return FacilityResponse.builder()
                .id(facility.getId())
                .name(facility.getName())
                .type(facility.getType())
                .latitude(facility.getLatitude())
                .longitude(facility.getLongitude())
                .address(facility.getAddress())
                .totalCapacity(facility.getTotalCapacity())
                .availableCapacity(facility.getAvailableCapacity())
                .supportedCategories(facility.getSupportedCategories())
                .active(facility.isActive())
                .createdAt(facility.getCreatedAt())
                .build();
    }
}
