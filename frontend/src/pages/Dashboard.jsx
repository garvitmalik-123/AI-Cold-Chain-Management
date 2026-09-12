import { useMemo } from "react";
import {
  Package,
  Truck,
  ShieldAlert,
  Siren,
  Clock,
  Warehouse,
  PlusCircle,
  ListChecks,
  Search,
  Thermometer,
  Droplets,
  Route,
  Boxes,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApiData } from "../hooks/useApiData";
import { dashboardApi, shipmentsApi, facilitiesApi } from "../api/endpoints";
import StatCard from "../components/dashboard/StatCard";
import ShipmentStatusChart from "../components/dashboard/ShipmentStatusChart";
import RiskDistributionChart from "../components/dashboard/RiskDistributionChart";
import RecentShipments from "../components/dashboard/RecentShipments";
import AlertPanel from "../components/dashboard/AlertPanel";
import ShipmentMap from "../components/map/ShipmentMap";
import DemoBanner from "../components/ui/DemoBanner";
import { LoadingState } from "../components/ui/LoadingState";
import { deriveAlerts } from "../utils/alerts";
import { DEMO_SUMMARY, DEMO_SHIPMENTS, DEMO_FACILITIES } from "../utils/demoData";

export default function Dashboard() {
  const { data: summary, isDemo: summaryDemo } = useApiData(
    () => dashboardApi.summary(),
    [],
    DEMO_SUMMARY
  );

  const { data: shipmentsRaw, loading: shipmentsLoading, isDemo: shipmentsDemo } = useApiData(
    () => shipmentsApi.list(),
    [],
    DEMO_SHIPMENTS
  );

  const { data: facilitiesRaw, isDemo: facilitiesDemo } = useApiData(
    () => facilitiesApi.list(),
    [],
    DEMO_FACILITIES
  );

  const shipments = useMemo(
    () => (Array.isArray(shipmentsRaw) ? shipmentsRaw : shipmentsRaw?.content || []),
    [shipmentsRaw]
  );
  const facilities = useMemo(
    () => (Array.isArray(facilitiesRaw) ? facilitiesRaw : facilitiesRaw?.content || []),
    [facilitiesRaw]
  );

  const isDemo = summaryDemo || shipmentsDemo || facilitiesDemo;

  const statusCounts = useMemo(() => {
    const counts = { Created: 0, "In Transit": 0, Delayed: 0, Delivered: 0, Cancelled: 0 };
    shipments.forEach((s) => {
      const status = String(s.status || "").toUpperCase();
      if (status === "CREATED") counts.Created++;
      else if (status === "IN_TRANSIT") counts["In Transit"]++;
      else if (status === "DELAYED") counts.Delayed++;
      else if (status === "DELIVERED") counts.Delivered++;
      else if (status === "CANCELLED") counts.Cancelled++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [shipments]);

  const riskCounts = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    shipments.forEach((s) => {
      const lvl = String(s.riskLevel || "LOW").toUpperCase();
      if (lvl === "LOW") counts.Low++;
      else if (lvl === "MEDIUM") counts.Medium++;
      else if (lvl === "HIGH") counts.High++;
      else if (lvl === "CRITICAL") counts.Critical++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [shipments]);

  const alerts = useMemo(() => deriveAlerts(shipments), [shipments]);

  const avgTemperature = shipments.length
    ? (shipments.reduce((sum, s) => sum + (s.temperature ?? 0), 0) / shipments.length).toFixed(1)
    : "—";
  const avgHumidity = shipments.length
    ? Math.round(shipments.reduce((sum, s) => sum + (s.humidity ?? 0), 0) / shipments.length)
    : "—";
  const totalAvailableCapacity = facilities.reduce((sum, f) => sum + (f.availableCapacity ?? 0), 0);
  const totalCapacity = facilities.reduce((sum, f) => sum + (f.totalCapacity ?? 0), 0);
  const capacityFreePct = totalCapacity ? Math.round((totalAvailableCapacity / totalCapacity) * 100) : "—";

  const mapShipments = shipments.map((s) => ({
    ...s,
    latitude: s.currentLatitude,
    longitude: s.currentLongitude,
  }));

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <DemoBanner show={isDemo} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Package} label="Total Shipments" value={summary?.totalShipments ?? "—"} />
        <StatCard icon={Truck} label="Active Shipments" value={summary?.activeShipments ?? "—"} />
        <StatCard icon={ShieldAlert} label="High Risk" value={summary?.highRiskShipments ?? "—"} tone="high" />
        <StatCard icon={Siren} label="Critical" value={summary?.criticalRiskShipments ?? "—"} tone="danger" />
        <StatCard icon={Clock} label="Delayed" value={summary?.delayedShipments ?? "—"} tone="warning" />
        <StatCard icon={Warehouse} label="Facilities" value={summary?.totalFacilities ?? "—"} />
      </div>

      {/* Map + side charts */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="glass-panel p-5 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Live Shipment Map</h3>
            <Link to="/shipments" className="flex items-center gap-1.5 text-xs font-medium text-frost-300 hover:text-frost-200">
              <Route size={13} /> Full tracking view
            </Link>
          </div>
          {shipmentsLoading ? <LoadingState label="Loading live positions" /> : <ShipmentMap shipments={mapShipments} facilities={facilities} height={360} zoom={7} />}
        </div>

        <ShipmentStatusChart data={statusCounts} total={shipments.length} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <RiskDistributionChart data={riskCounts} />
        <RecentShipments shipments={shipments} />
        <AlertPanel alerts={alerts} />
      </div>

      {/* Overview trend + quick actions + quick stats */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="glass-panel p-5 xl:col-span-2">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Shipment Overview</h3>
          </div>
          <p className="text-xs text-slate-500 mb-2">Relative shipment volume, most recent activity first</p>
          <MiniTrend count={shipments.length} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <div className="glass-panel p-5">
            <h3 className="mb-3 text-sm font-semibold text-white">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction icon={PlusCircle} label="Create Shipment" sub="Add new shipment" to="/shipments" />
              <QuickAction icon={Warehouse} label="Add Facility" sub="Register new site" to="/facilities" />
              <QuickAction icon={ListChecks} label="View All Shipments" sub="Track & manage" to="/shipments" />
              <QuickAction icon={Search} label="Risk Monitoring" sub="Check risk levels" to="/risk-monitoring" />
            </div>
          </div>

          <div className="glass-panel p-5">
            <h3 className="mb-3 text-sm font-semibold text-white">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickStat icon={Thermometer} label="Avg. Temperature" value={avgTemperature !== "—" ? `${avgTemperature}°C` : "—"} />
              <QuickStat icon={Droplets} label="Avg. Humidity" value={avgHumidity !== "—" ? `${avgHumidity}%` : "—"} />
              <QuickStat icon={Boxes} label="Capacity Free" value={capacityFreePct !== "—" ? `${capacityFreePct}%` : "—"} />
              <QuickStat icon={Warehouse} label="Facilities Online" value={facilities.filter((f) => f.active).length} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, sub, to }) {
  return (
    <Link
      to={to}
      className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-base-900/40 p-3.5 hover:border-frost-500/30 hover:bg-base-800/60 transition-colors"
    >
      <Icon size={16} className="text-frost-300" />
      <div>
        <p className="text-xs font-medium text-slate-200 leading-tight">{label}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>
      </div>
    </Link>
  );
}

function QuickStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-base-900/40 p-3.5">
      <Icon size={15} className="text-frost-300 mb-2" />
      <p className="text-sm font-semibold text-white">{value}</p>
      <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

function MiniTrend({ count }) {
  const seed = Math.max(count, 1);
  const points = Array.from({ length: 7 }).map((_, i) => 30 + ((Math.sin(i * seed) + 1) / 2) * 60);
  const max = Math.max(...points);
  const w = 600;
  const h = 140;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * (h - 20)}`)
    .join(" ");
  const areaPath = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-36" preserveAspectRatio="none">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#trendFill)" />
      <path d={path} fill="none" stroke="#5EEAD4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
