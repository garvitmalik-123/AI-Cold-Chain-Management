# ColdChain AI — Full Stack

AI-powered hyper-local cold chain management & perishable logistics
tracking system.

```
.
├── backend/    Spring Boot 3.3.4 API (Java, MongoDB, JWT auth) — port 8080
└── frontend/   React + Vite dashboard (Tailwind, Leaflet, Recharts) — port 5173
```

## Run the backend

Requires Java 17+, Maven, and MongoDB running locally (`mongodb://localhost:27017/coldchain_db`).

```bash
cd backend
mvn spring-boot:run
```

On first run it seeds three demo users and a handful of facilities/shipments
(see `backend/README.md` / `src/main/java/com/coldchain/seed/DataSeeder.java`).
Swagger UI is available at `http://localhost:8080/swagger-ui/index.html`.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` and sign in with a seeded account, e.g.
`admin@coldchain.com` / `Admin@123`.

## How they connect

The frontend's Axios client (`frontend/src/api/client.js`) points at
`http://localhost:8080/api/v1` and attaches the JWT returned by
`/auth/login` / `/auth/register` as a Bearer token. CORS on the backend
(`backend/src/main/resources/application.yml`) already allows
`http://localhost:5173` and `5174`.

See `frontend/README.md` for a rundown of a couple of places where the
frontend was adjusted to match the backend's real API shape (no `/auth/me`,
environment history path, etc).
