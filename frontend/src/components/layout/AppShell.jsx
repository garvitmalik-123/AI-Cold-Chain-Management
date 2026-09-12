import { useState } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useApiData } from "../../hooks/useApiData";
import { dashboardApi } from "../../api/endpoints";
import { DEMO_SUMMARY } from "../../utils/demoData";

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: summary } = useApiData(() => dashboardApi.summary(), [], DEMO_SUMMARY);
  const alertCount = summary?.criticalRiskShipments != null
    ? (summary.criticalRiskShipments || 0) + (summary.highRiskShipments || 0)
    : 0;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-base-950">
      <Sidebar alertCount={alertCount} />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10">
            <Sidebar alertCount={alertCount} mobile onNavigate={() => setMobileOpen(false)} />
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-4 z-20 text-slate-400"
          >
            <X size={22} />
          </button>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setMobileOpen(true)} alertCount={alertCount} />
        <main className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
