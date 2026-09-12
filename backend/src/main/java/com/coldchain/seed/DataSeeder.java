package com.coldchain.seed;

import com.coldchain.model.*;
import com.coldchain.repository.FacilityRepository;
import com.coldchain.repository.ShipmentRepository;
import com.coldchain.repository.UserRepository;
import com.coldchain.service.SpoilageRiskService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ShipmentRepository shipmentRepository;
    private final FacilityRepository facilityRepository;
    private final PasswordEncoder passwordEncoder;
    private final SpoilageRiskService spoilageRiskService;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    @Override
    public void run(String... args) {
        if (!seedEnabled || userRepository.count() > 0) {
            return;
        }

        User admin = userRepository.save(User.builder()
                .name("Admin User")
                .email("admin@coldchain.com")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN)
                .active(true)
                .build());

        userRepository.save(User.builder()
                .name("Transporter Raj")
                .email("transporter@coldchain.com")
                .password(passwordEncoder.encode("Transport@123"))
                .role(Role.TRANSPORTER)
                .active(true)
                .build());

        userRepository.save(User.builder()
                .name("Facility Manager Sunita")
                .email("facility@coldchain.com")
                .password(passwordEncoder.encode("Facility@123"))
                .role(Role.FACILITY_MANAGER)
                .active(true)
                .build());

        Facility coldStorage = facilityRepository.save(Facility.builder()
                .name("Yamunanagar Cold Storage")
                .type(FacilityType.COLD_STORAGE)
                .latitude(30.1290)
                .longitude(77.2674)
                .address("Yamunanagar, Haryana")
                .totalCapacity(5000)
                .availableCapacity(3200)
                .supportedCategories(List.of(ProductCategory.DAIRY, ProductCategory.MEAT, ProductCategory.SEAFOOD))
                .active(true)
                .build());

        facilityRepository.save(Facility.builder()
                .name("Karnal Mandi")
                .type(FacilityType.MANDI)
                .latitude(29.6857)
                .longitude(76.9905)
                .address("Karnal, Haryana")
                .totalCapacity(8000)
                .availableCapacity(6000)
                .supportedCategories(List.of(ProductCategory.FRUITS, ProductCategory.VEGETABLES))
                .active(true)
                .build());

        facilityRepository.save(Facility.builder()
                .name("Ambala Processing Centre")
                .type(FacilityType.PROCESSING_CENTRE)
                .latitude(30.3752)
                .longitude(76.7821)
                .address("Ambala, Haryana")
                .totalCapacity(4000)
                .availableCapacity(1500)
                .supportedCategories(List.of(ProductCategory.MEAT, ProductCategory.SEAFOOD, ProductCategory.OTHER))
                .active(true)
                .build());

        facilityRepository.save(Facility.builder()
                .name("Panipat Pharma Cold Store")
                .type(FacilityType.COLD_STORAGE)
                .latitude(29.3909)
                .longitude(76.9635)
                .address("Panipat, Haryana")
                .totalCapacity(2000)
                .availableCapacity(1800)
                .supportedCategories(List.of(ProductCategory.PHARMA, ProductCategory.FLOWERS))
                .active(true)
                .build());

        Shipment s1 = Shipment.builder()
                .product("Fresh Milk")
                .category(ProductCategory.DAIRY)
                .quantity(500)
                .source("Yamunanagar")
                .destination("Karnal")
                .sourceLatitude(30.1290)
                .sourceLongitude(77.2674)
                .destinationLatitude(29.6857)
                .destinationLongitude(76.9905)
                .temperature(3.5)
                .humidity(60)
                .currentLatitude(30.0)
                .currentLongitude(77.1)
                .status(ShipmentStatus.IN_TRANSIT)
                .createdBy(admin.getEmail())
                .build();
        s1.setRiskLevel(spoilageRiskService.calculateRisk(s1.getCategory(), s1.getTemperature(), s1.getHumidity(), s1.getStatus()));
        shipmentRepository.save(s1);

        Shipment s2 = Shipment.builder()
                .product("Tomatoes")
                .category(ProductCategory.VEGETABLES)
                .quantity(1200)
                .source("Karnal")
                .destination("Ambala")
                .sourceLatitude(29.6857)
                .sourceLongitude(76.9905)
                .destinationLatitude(30.3752)
                .destinationLongitude(76.7821)
                .temperature(12.0)
                .humidity(70)
                .currentLatitude(30.0)
                .currentLongitude(76.9)
                .status(ShipmentStatus.DELAYED)
                .createdBy(admin.getEmail())
                .build();
        s2.setRiskLevel(spoilageRiskService.calculateRisk(s2.getCategory(), s2.getTemperature(), s2.getHumidity(), s2.getStatus()));
        shipmentRepository.save(s2);

        Shipment s3 = Shipment.builder()
                .product("Frozen Prawns")
                .category(ProductCategory.SEAFOOD)
                .quantity(300)
                .source("Ambala")
                .destination("Yamunanagar")
                .sourceLatitude(30.3752)
                .sourceLongitude(76.7821)
                .destinationLatitude(30.1290)
                .destinationLongitude(77.2674)
                .temperature(-1.0)
                .humidity(80)
                .currentLatitude(30.2)
                .currentLongitude(77.0)
                .status(ShipmentStatus.CREATED)
                .createdBy(admin.getEmail())
                .build();
        s3.setRiskLevel(spoilageRiskService.calculateRisk(s3.getCategory(), s3.getTemperature(), s3.getHumidity(), s3.getStatus()));
        shipmentRepository.save(s3);
    }
}
