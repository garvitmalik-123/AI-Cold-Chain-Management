# ❄️ AI Cold Chain Management

### AI-Powered Hyper-Local Perishable Logistics & Cold Chain Tracking System

> **Track → Predict → Recommend → Reduce Wastage**

AI Cold Chain Management is a full-stack logistics platform designed to monitor perishable shipments, analyze environmental conditions, predict spoilage risk, and recommend nearby suitable facilities when intervention is required.

---

## ✨ Features

* 🚚 **Shipment Tracking** — Monitor shipment status, location and ETA
* 🌡️ **Environment Monitoring** — Track simulated temperature & humidity data
* 🤖 **Spoilage Risk Prediction** — Identify LOW, MEDIUM, HIGH and CRITICAL risk
* 📍 **Hyper-Local Recommendations** — Find nearby suitable cold storage, mandis and processing centres
* 🗺️ **Location Tracking** — View shipment movement and facility locations
* 🚨 **Smart Alerts** — Get alerts for high temperature, delays and spoilage risks
* 📊 **Analytics Dashboard** — Shipment, risk and facility statistics
* 🔐 **JWT Authentication** — Secure role-based access
* 📚 **Swagger Documentation** — Test and explore APIs directly

---

## 🧠 How It Works

```text
┌──────────────┐
│   Shipment   │
└──────┬───────┘
       ↓
┌──────────────────┐
│ Temp / Humidity  │
│ Location / ETA   │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Spoilage Risk    │
│ Analysis Engine  │
└────────┬─────────┘
         ↓
   ┌─────┴─────┐
   ↓           ↓
 Risk       Hyper-Local
Analysis    Recommendation
   ↓           ↓
   └─────┬─────┘
         ↓
┌──────────────────┐
│ Dashboard / Map  │
└──────────────────┘
```

> **Current version uses simulated sensor data through REST APIs. Real IoT/IIoT integration can be added later.**

---

## 🛠️ Tech Stack

### Backend

* Java 21
* Spring Boot
* Spring Security
* JWT
* MongoDB
* Spring Data MongoDB
* Lombok
* SpringDoc OpenAPI

### Frontend

* React
* Vite
* JavaScript
* Tailwind CSS
* Axios
* React Router
* Recharts
* Leaflet / OpenStreetMap

---

## 👥 User Roles

| Role                | Access                         |
| ------------------- | ------------------------------ |
| 👑 Admin            | System & facility management   |
| 🚚 Transporter      | Shipment management & tracking |
| 🏭 Facility Manager | Facility & capacity management |

---

## 📂 Project Structure

```text
AI-Cold-Chain-Management/
│
├── backend/
│   └── Spring Boot Application
│
├── frontend/
│   └── React + Vite Application
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/garvitmalik-123/AI-Cold-Chain-Management.git
cd AI-Cold-Chain-Management
```

### 2. Backend

Configure MongoDB and environment variables, then run:

```bash
cd backend
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 📚 API Documentation

Swagger UI:

```text
http://localhost:8080/swagger-ui/index.html
```

OpenAPI:

```text
http://localhost:8080/v3/api-docs
```

---

## 🔌 Core API Modules

```text
/api/v1/auth
/api/v1/shipments
/api/v1/facilities
/api/v1/dashboard
/api/v1/alerts
```

Environment & risk APIs:

```text
/api/v1/shipments/{id}/environment
/api/v1/shipments/{id}/risk
/api/v1/shipments/{id}/recommendations
```

---

## 🔮 Future Enhancements

* 📡 Real IoT sensor integration
* 🧠 ML-based spoilage prediction
* 🚦 Real-time traffic-aware routing
* 📱 Mobile application
* ☁️ Cloud deployment
* 📈 Advanced predictive analytics
* 🔔 Real-time IoT alerts

---

## 🎯 Project Goal

The goal is to reduce **food wastage and cold-chain inefficiencies** by combining shipment tracking, environmental monitoring, risk prediction and hyper-local logistics recommendations into one intelligent platform.

---

## 👨‍💻 Team

Built with ❤️ using **Java, Spring Boot, React & MongoDB**.

**GitHub:** [garvitmalik-123](https://github.com/garvitmalik-123)

---

### ⭐ If you find this project useful, consider giving it a star!
