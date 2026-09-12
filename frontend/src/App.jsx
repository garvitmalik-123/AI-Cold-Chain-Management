import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppShell from "./components/layout/AppShell";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import ShipmentDetails from "./pages/ShipmentDetails";
import Facilities from "./pages/Facilities";
import RiskMonitoring from "./pages/RiskMonitoring";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/shipments/:id" element={<ShipmentDetails />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/risk-monitoring" element={<RiskMonitoring />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
