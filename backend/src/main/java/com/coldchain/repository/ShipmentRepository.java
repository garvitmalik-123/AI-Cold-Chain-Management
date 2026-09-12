package com.coldchain.repository;

import com.coldchain.model.RiskLevel;
import com.coldchain.model.Shipment;
import com.coldchain.model.ShipmentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ShipmentRepository extends MongoRepository<Shipment, String> {
    long countByStatus(ShipmentStatus status);
    long countByStatusIn(List<ShipmentStatus> statuses);
    long countByRiskLevel(RiskLevel riskLevel);
}
