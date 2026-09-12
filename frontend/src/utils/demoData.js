// Realistic fallback data — only rendered when the backend cannot be reached,
// clearly flagged in the UI as demo data. Shaped to match the real backend
// DTOs exactly (see backend/src/main/java/com/coldchain/dto/response).

export const DEMO_SUMMARY = {
  totalShipments: 12,
  activeShipments: 8,
  highRiskShipments: 2,
  criticalRiskShipments: 1,
  delayedShipments: 1,
  totalFacilities: 6,
};

export const DEMO_SHIPMENTS = [
  {
    id: "demo-shp-001", product: "Fresh Milk", category: "DAIRY", quantity: 500,
    source: "Yamunanagar", destination: "Karnal",
    sourceLatitude: 30.129, sourceLongitude: 77.2674,
    destinationLatitude: 29.6857, destinationLongitude: 76.9905,
    temperature: 3.5, humidity: 60, currentLatitude: 30.0, currentLongitude: 77.1,
    status: "IN_TRANSIT", riskLevel: "LOW", createdBy: "admin@coldchain.com",
  },
  {
    id: "demo-shp-002", product: "Tomatoes", category: "VEGETABLES", quantity: 1200,
    source: "Karnal", destination: "Ambala",
    sourceLatitude: 29.6857, sourceLongitude: 76.9905,
    destinationLatitude: 30.3752, destinationLongitude: 76.7821,
    temperature: 12.0, humidity: 70, currentLatitude: 30.0, currentLongitude: 76.9,
    status: "DELAYED", riskLevel: "HIGH", createdBy: "admin@coldchain.com",
  },
  {
    id: "demo-shp-003", product: "Frozen Prawns", category: "SEAFOOD", quantity: 300,
    source: "Ambala", destination: "Yamunanagar",
    sourceLatitude: 30.3752, sourceLongitude: 76.7821,
    destinationLatitude: 30.129, destinationLongitude: 77.2674,
    temperature: -1.0, humidity: 80, currentLatitude: 30.2, currentLongitude: 77.0,
    status: "CREATED", riskLevel: "LOW", createdBy: "admin@coldchain.com",
  },
  {
    id: "demo-shp-004", product: "Table Grapes", category: "FRUITS", quantity: 900,
    source: "Panipat", destination: "Dehradun",
    sourceLatitude: 29.3909, sourceLongitude: 76.9635,
    destinationLatitude: 30.3165, destinationLongitude: 78.0322,
    temperature: 9.8, humidity: 88, currentLatitude: 29.97, currentLongitude: 77.55,
    status: "IN_TRANSIT", riskLevel: "CRITICAL", createdBy: "admin@coldchain.com",
  },
  {
    id: "demo-shp-005", product: "Paneer", category: "DAIRY", quantity: 400,
    source: "Hisar", destination: "Chandigarh",
    sourceLatitude: 29.1492, sourceLongitude: 75.7217,
    destinationLatitude: 30.7333, destinationLongitude: 76.7794,
    temperature: 5.1, humidity: 65, currentLatitude: 29.97, currentLongitude: 76.85,
    status: "IN_TRANSIT", riskLevel: "MEDIUM", createdBy: "admin@coldchain.com",
  },
];

export const DEMO_FACILITIES = [
  {
    id: "demo-fac-01", name: "Yamunanagar Cold Storage", type: "COLD_STORAGE",
    latitude: 30.129, longitude: 77.2674, address: "Yamunanagar, Haryana",
    totalCapacity: 5000, availableCapacity: 3200,
    supportedCategories: ["DAIRY", "MEAT", "SEAFOOD"], active: true,
  },
  {
    id: "demo-fac-02", name: "Karnal Mandi", type: "MANDI",
    latitude: 29.6857, longitude: 76.9905, address: "Karnal, Haryana",
    totalCapacity: 8000, availableCapacity: 6000,
    supportedCategories: ["FRUITS", "VEGETABLES"], active: true,
  },
  {
    id: "demo-fac-03", name: "Ambala Processing Centre", type: "PROCESSING_CENTRE",
    latitude: 30.3752, longitude: 76.7821, address: "Ambala, Haryana",
    totalCapacity: 4000, availableCapacity: 1500,
    supportedCategories: ["MEAT", "SEAFOOD", "OTHER"], active: true,
  },
  {
    id: "demo-fac-04", name: "Panipat Pharma Cold Store", type: "COLD_STORAGE",
    latitude: 29.3909, longitude: 76.9635, address: "Panipat, Haryana",
    totalCapacity: 2000, availableCapacity: 1800,
    supportedCategories: ["PHARMA", "FLOWERS"], active: true,
  },
];

export const DEMO_ENV_HISTORY = Array.from({ length: 12 }).map((_, i) => ({
  id: `demo-env-${i}`,
  temperature: +(4 + Math.sin(i / 2) * 2 + (i > 8 ? 3 : 0)).toFixed(1),
  humidity: +(65 + Math.cos(i / 3) * 8).toFixed(0),
  recordedAt: new Date(Date.now() - (11 - i) * 45 * 60 * 1000).toISOString(),
}));

export const DEMO_RISK = {
  riskLevel: "CRITICAL",
  reason:
    "Trailer temperature has exceeded the safe threshold for this product category for over 20 minutes while status is IN_TRANSIT. Immediate rerouting to the nearest compatible cold facility is recommended to avoid spoilage.",
  temperature: 9.8,
  humidity: 88,
};

export const DEMO_RECOMMENDATIONS = [
  { facilityId: "demo-fac-02", facilityName: "Karnal Mandi", facilityType: "MANDI", distanceKm: 6.2, availableCapacity: 6000, categoryCompatible: true, score: 92 },
  { facilityId: "demo-fac-01", facilityName: "Yamunanagar Cold Storage", facilityType: "COLD_STORAGE", distanceKm: 14.8, availableCapacity: 3200, categoryCompatible: false, score: 61 },
  { facilityId: "demo-fac-03", facilityName: "Ambala Processing Centre", facilityType: "PROCESSING_CENTRE", distanceKm: 31.5, availableCapacity: 1500, categoryCompatible: false, score: 48 },
];
