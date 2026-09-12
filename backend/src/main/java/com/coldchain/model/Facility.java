package com.coldchain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "facilities")
public class Facility {

    @Id
    private String id;

    private String name;
    private FacilityType type;

    private double latitude;
    private double longitude;
    private String address;

    private double totalCapacity;
    private double availableCapacity;

    @Builder.Default
    private List<ProductCategory> supportedCategories = List.of();

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
