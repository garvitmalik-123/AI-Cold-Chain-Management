package com.coldchain.dto.request;

import com.coldchain.model.FacilityType;
import com.coldchain.model.ProductCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.util.List;

@Data
public class FacilityRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Type is required")
    private FacilityType type;

    private double latitude;
    private double longitude;
    private String address;

    @PositiveOrZero(message = "Total capacity must be zero or positive")
    private double totalCapacity;

    @PositiveOrZero(message = "Available capacity must be zero or positive")
    private double availableCapacity;

    private List<ProductCategory> supportedCategories;
}
