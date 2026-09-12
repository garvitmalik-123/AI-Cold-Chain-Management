package com.coldchain.dto.response;

import com.coldchain.model.FacilityType;
import com.coldchain.model.ProductCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacilityResponse {
    private String id;
    private String name;
    private FacilityType type;
    private double latitude;
    private double longitude;
    private String address;
    private double totalCapacity;
    private double availableCapacity;
    private List<ProductCategory> supportedCategories;
    private boolean active;
    private Instant createdAt;
}
