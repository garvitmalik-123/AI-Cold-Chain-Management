import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Thermometer,
  Droplets,
  MapPin,
  Navigation,
  Sparkles,
  Building2,
  Gauge,
  Tag,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useApiData } from "../hooks/useApiData";
import { shipmentsApi } from "../api/endpoints";
import RiskBadge from "../components/ui/RiskBadge";
import StatusPill from "../components/ui/StatusPill";
import DemoBanner from "../components/ui/DemoBanner";
import { LoadingState, ErrorState } from "../components/ui/LoadingState";
import ShipmentMap from "../components/map/ShipmentMap";
import { DEMO_SHIPMENTS, DEMO_ENV_HISTORY, DEMO_RISK, DEMO_RECOMMENDATIONS } from "../utils/demoData";
import { getRiskMeta } from "../utils/risk";
import { humanize } from "../utils/enums";

export default function ShipmentDetails() {
  const { id } = useParams();

  const demoShipment = DEMO_SHIPMENTS.find((s) => s.id === id) || DEMO_SHIPMENTS[0];

  const { data: shipmentRaw, loading, error, isDemo, refetch } = useApiData(
    () => shipmentsApi.getById(id),
    [id],
    demoShipment
  );

  const { data: envHistoryRaw, isDemo: envDemo } = useApiData(
    () => shipmentsApi.getEnvironmentHistory(id),
    [id],
    DEMO_ENV_HISTORY
  );

  const { data: riskRaw, isDemo: riskDemo } = useApiData(
    () => shipmentsApi.getRisk(id),
    [id],
    DEMO_RISK
  );

  const shipment = shipmentRaw || demoShipment;
  const riskLevel = riskRaw?.riskLevel || shipment.riskLevel;
  const isElevated = ["HIGH", "CRITICAL"].includes(String(riskLevel).toUpperCase());

  const { data: recommendationsRaw, loading: recoLoading } = useApiData(
    () => (isElevated ? shipmentsApi.getRecommendations(id) : Promise.resolve({ data: [] })),
    [id, isElevated],
    isElevated ? DEMO_RECOMMENDATIONS : []
  );
  const recommendations = Array.isArray(recommendationsRaw) ? recommendationsRaw : [];

  const envHistory = useMemo(() => {
    const list = Array.isArray(envHistoryRaw) ? envHistoryRaw : envHistoryRaw?.content || [];
    return list.map((e) => ({
      ...e,
      timeLabel: new Date(e.recordedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));
  }, [envHistoryRaw]);

  if (loading) return <LoadingState label="Loading shipment details" />;
  if (error && !isDemo) return <ErrorState subtitle="Couldn't reach the backend for this shipment." onRetry={refetch} />;

  const meta = getRiskMeta(riskLevel);

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      <DemoBanner show={isDemo || envDemo || riskDemo} />

      <div className="flex items-center gap-3">
        <Link to="/shipments" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-slate-400 hover:text-white hover:border-frost-500/30 transition-colors">
          <ArrowLeft size={15} />
        </Link>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-white flex items-center gap-2 truncate">
            {shipment.product} <span className="text-slate-500 font-normal">·</span>{" "}
            <span className="font-mono text-sm text-slate-400 truncate">{shipment.id}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{shipment.source} → {shipment.destination}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <StatusPill status={shipment.status} />
          <RiskBadge level={riskLevel} />
        </div>
      </div>

      {/* Elevated risk banner */}
      {isElevated && (
        <div className="rounded-2xl border p-5" style={{ borderColor: `${meta.color}33`, background: `${meta.color}0D` }}>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `${meta.color}1A` }}>
              <Sparkles size={16} style={{ color: meta.color }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: meta.color }}>
                AI Recommendation — {meta.label} Risk Detected
              </p>
              <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
                {riskRaw?.reason || "Monitor this shipment closely and prepare a contingency reroute."}
              </p>
            </div>
          </div>

          {recoLoading ? (
            <p className="mt-4 text-xs text-slate-500">Finding nearby compatible facilities…</p>
          ) : recommendations.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {recommendations.map((f) => (
                <div key={f.facilityId} className="rounded-xl border border-white/[0.08] bg-base-900/60 p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={14} className="text-frost-300 shrink-0" />
                    <p className="text-sm font-medium text-slate-200 truncate">{f.facilityName}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">{humanize(f.facilityType)}</p>
                  <div className="space-y-1 text-[11px]">
                    <Row label="Distance" value={`${f.distanceKm?.toFixed?.(1) ?? f.distanceKm} km`} />
                    <Row label="Available Capacity" value={`${f.availableCapacity} kg`} />
                    <Row label="Compatibility" value={f.categoryCompatible ? "Compatible" : "Not compatible"} />
                    <Row label="Match Score" value={`${Math.round(f.score)}/100`} highlight />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-xs text-slate-500">No compatible nearby facilities found for this shipment right now.</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left: details + chart */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-panel p-5">
            <h3 className="mb-4 text-sm font-semibold text-white">Shipment Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Detail icon={Package} label="Product" value={shipment.product} />
              <Detail icon={Tag} label="Category" value={humanize(shipment.category)} />
              <Detail icon={Gauge} label="Quantity" value={`${shipment.quantity} kg`} />
              <Detail icon={Navigation} label="Source → Destination" value={`${shipment.source} → ${shipment.destination}`} />
              <Detail icon={MapPin} label="Current Coordinates" value={`${shipment.currentLatitude?.toFixed?.(3)}, ${shipment.currentLongitude?.toFixed?.(3)}`} />
              <Detail icon={Thermometer} label="Temperature" value={`${shipment.temperature ?? "—"}°C`} accent={isElevated} />
              <Detail icon={Droplets} label="Humidity" value={`${shipment.humidity ?? "—"}%`} />
              <Detail icon={Gauge} label="Risk Level" value={humanize(riskLevel)} accent={isElevated} />
            </div>
          </div>

          <div className="glass-panel p-5">
            <h3 className="mb-1 text-sm font-semibold text-white">Environment History</h3>
            <p className="text-xs text-slate-500 mb-3">Temperature and humidity recorded over the shipment's journey</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={envHistory} margin={{ top: 5, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="timeLabel" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    fontSize: 12,
                    color: "#e2e8f0",
                  }}
                />
                <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#FB923C" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#5EEAD4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400"><span className="h-2 w-2 rounded-full bg-risk-high" /> Temperature</span>
              <span className="flex items-center gap-1.5 text-slate-400"><span className="h-2 w-2 rounded-full bg-frost-400" /> Humidity</span>
            </div>
          </div>
        </div>

        {/* Right: map */}
        <div className="glass-panel p-5">
          <h3 className="mb-3 text-sm font-semibold text-white">Live Location</h3>
          <ShipmentMap
            shipments={[{ ...shipment, latitude: shipment.currentLatitude, longitude: shipment.currentLongitude }]}
            height={520}
            zoom={9}
          />
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value, accent }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-slate-500 mb-1">
        <Icon size={12} />
        <span className="text-[11px]">{label}</span>
      </div>
      <p className={`text-sm font-medium ${accent ? "text-risk-high" : "text-slate-200"}`}>{value}</p>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={highlight ? "font-semibold text-frost-300" : "text-slate-300"}>{value}</span>
    </div>
  );
}
