package com.coldchain.repository;

import com.coldchain.model.Facility;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FacilityRepository extends MongoRepository<Facility, String> {
}
