package com.coldchain.dto.request;

import com.coldchain.model.ProductCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ShipmentRequest {

    @NotBlank(message = "Product is required")
    private String product;

    @NotNull(message = "Category is required")
    private ProductCategory category;

    @Positive(message = "Quantity must be positive")
    private double quantity;

    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Destination is required")
    private String destination;

    private double sourceLatitude;
    private double sourceLongitude;
    private double destinationLatitude;
    private double destinationLongitude;

    private double temperature;
    private double humidity;
    private double currentLatitude;
    private double currentLongitude;
}
