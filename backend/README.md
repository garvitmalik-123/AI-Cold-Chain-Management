# Cold Chain Management Backend

AI-Powered Hyper-Local Cold Chain Management & Perishable Logistics Tracking System.
Spring Boot 3.3 + Java 21 + MongoDB, monolithic, demo-ready.

## Run

Requires MongoDB running locally on `mongodb://localhost:27017`.

```bash
mvn spring-boot:run
```

App starts on `http://localhost:8080`.
Swagger UI: `http://localhost:8080/swagger-ui/index.html`

On first run (empty DB), demo data is auto-seeded: 3 users, 4 facilities, 3 shipments.

## Seeded demo users

| Role             | Email                     | Password       |
|------------------|---------------------------|----------------|
| ADMIN            | admin@coldchain.com       | Admin@123      |
| TRANSPORTER      | transporter@coldchain.com | Transport@123  |
| FACILITY_MANAGER | facility@coldchain.com    | Facility@123   |

## Auth flow

1. `POST /api/v1/auth/login` with email/password → returns JWT.
2. Click "Authorize" in Swagger UI and paste `Bearer <token>` (or just the token, depending on your Swagger client) to call protected endpoints.

## API modules

- `/api/v1/auth` — register/login (JWT, BCrypt, roles ADMIN/TRANSPORTER/FACILITY_MANAGER)
- `/api/v1/shipments` — CRUD for shipments
- `/api/v1/shipments/{id}/environment` — record/get simulated temperature, humidity, GPS history
- `/api/v1/shipments/{id}/risk` — rule-based spoilage risk (LOW/MEDIUM/HIGH/CRITICAL)
- `/api/v1/shipments/{id}/recommendations` — nearby facility recommendations (Haversine distance + capacity + category match)
- `/api/v1/facilities` — CRUD for Cold Storage / Mandi / Processing Centre
- `/api/v1/dashboard/summary` — aggregate stats

## Notes

- CORS enabled for `localhost:5173` and `localhost:5174`.
- No real IoT/MQTT/Kafka/ML — environment data is simulated via plain REST calls.
- Risk engine is deterministic rule-based logic in `SpoilageRiskService` (category-specific ideal temp/humidity ranges + transit delay penalty).
