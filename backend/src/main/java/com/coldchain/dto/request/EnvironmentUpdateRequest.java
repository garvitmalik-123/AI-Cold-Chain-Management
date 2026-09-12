package com.coldchain.dto.request;

import lombok.Data;

@Data
public class EnvironmentUpdateRequest {
    private double temperature;
    private double humidity;
    private double latitude;
    private double longitude;
}
