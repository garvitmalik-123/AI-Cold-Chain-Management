# ColdChain AI — Frontend

Premium dark dashboard for an AI-powered hyper-local cold chain management and
perishable logistics tracking system.

## Tech Stack
React + Vite, JavaScript, Tailwind CSS, Axios, React Router, Lucide React,
Recharts, Leaflet + React Leaflet.

## Getting Started

```bash
npm install
npm run dev
```

The app runs on http://localhost:5173 by default.

## Backend

The app expects a Spring Boot backend at:

```
http://localhost:8080/api/v1
```

configured in `src/api/client.js`. All requests attach the JWT stored in
`localStorage` as `Authorization: Bearer <token>`.

If the backend is unreachable, pages fall back to clearly-labeled demo data
so the UI stays presentable — no page ever silently invents an API endpoint.

## Structure

```
src/
  api/            axios client + endpoint functions (matches backend contract exactly)
  context/        AuthContext (JWT session)
  components/
    layout/       Sidebar, Topbar, AppShell, ProtectedRoute
    ui/           RiskBadge, StatusPill, loading/empty/error states, DemoBanner
    dashboard/    StatCard, charts, RecentShipments, AlertPanel
    map/          ShipmentMap (Leaflet)
  pages/          Login, Register, Dashboard, Shipments, ShipmentDetails,
                  Facilities, RiskMonitoring, Alerts, Profile
  hooks/          useApiData (loading/error/demo-fallback fetch hook)
  utils/          risk-level helpers, demo data
```

## Build

```bash
npm run build
```
