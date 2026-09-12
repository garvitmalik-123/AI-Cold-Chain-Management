package com.coldchain.repository;

import com.coldchain.model.EnvironmentLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EnvironmentLogRepository extends MongoRepository<EnvironmentLog, String> {
    List<EnvironmentLog> findByShipmentIdOrderByRecordedAtDesc(String shipmentId);
}
