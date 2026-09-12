package com.coldchain.service;

import com.coldchain.model.ProductCategory;
import com.coldchain.model.RiskLevel;
import com.coldchain.model.ShipmentStatus;
import org.springframework.stereotype.Service;

/**
 * Simple rule-based spoilage risk engine.
 * Evaluates temperature/humidity deviation from the ideal range for a
 * product category, plus transit status, to produce a risk level.
 */
@Service
public class SpoilageRiskService {

    private record Range(double min, double max) {
        double deviation(double value) {
            if (value < min) return min - value;
            if (value > max) return value - max;
            return 0;
        }
    }

    // Ideal temperature ranges (Celsius) per product category
    private Range idealTemp(ProductCategory category) {
        return switch (category) {
            case DAIRY -> new Range(0, 4);
            case MEAT -> new Range(-2, 2);
            case SEAFOOD -> new Range(-1, 2);
            case FRUITS -> new Range(2, 8);
            case VEGETABLES -> new Range(2, 8);
            case FLOWERS -> new Range(1, 6);
            case PHARMA -> new Range(2, 8);
            case OTHER -> new Range(2, 10);
        };
    }

    // Ideal humidity ranges (%) per product category
    private Range idealHumidity(ProductCategory category) {
        return switch (category) {
            case DAIRY -> new Range(50, 70);
            case MEAT -> new Range(60, 80);
            case SEAFOOD -> new Range(70, 90);
            case FRUITS -> new Range(85, 95);
            case VEGETABLES -> new Range(85, 95);
            case FLOWERS -> new Range(80, 95);
            case PHARMA -> new Range(35, 65);
            case OTHER -> new Range(40, 80);
        };
    }

    public RiskLevel calculateRisk(ProductCategory category, double temperature, double humidity,
                                    ShipmentStatus status) {
        Range tempRange = idealTemp(category);
        Range humidityRange = idealHumidity(category);

        double tempDeviation = tempRange.deviation(temperature);
        double humidityDeviation = humidityRange.deviation(humidity);

        double score = 0;

        // Temperature deviation is the strongest signal
        score += tempDeviation * 3;
        // Humidity deviation contributes less
        score += humidityDeviation * 0.5;

        // Extra risk if shipment is delayed in transit
        if (status == ShipmentStatus.DELAYED) {
            score += 8;
        }

        if (score <= 2) {
            return RiskLevel.LOW;
        } else if (score <= 8) {
            return RiskLevel.MEDIUM;
        } else if (score <= 18) {
            return RiskLevel.HIGH;
        } else {
            return RiskLevel.CRITICAL;
        }
    }

    public String explainRisk(ProductCategory category, double temperature, double humidity, ShipmentStatus status) {
        Range tempRange = idealTemp(category);
        Range humidityRange = idealHumidity(category);

        StringBuilder sb = new StringBuilder();
        sb.append("Ideal temp for ").append(category).append(": ")
                .append(tempRange.min()).append("-").append(tempRange.max()).append("C, current: ")
                .append(temperature).append("C. ");
        sb.append("Ideal humidity: ").append(humidityRange.min()).append("-").append(humidityRange.max())
                .append("%, current: ").append(humidity).append("%. ");
        if (status == ShipmentStatus.DELAYED) {
            sb.append("Shipment is DELAYED which increases spoilage risk.");
        }
        return sb.toString();
    }
}
