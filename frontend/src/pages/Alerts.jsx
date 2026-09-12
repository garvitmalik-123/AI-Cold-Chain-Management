import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Thermometer, Clock, Sparkles, ShieldCheck, Bell } from "lucide-react";
import { useApiData } from "../hooks/useApiData";
import { shipmentsApi } from "../api/endpoints";
import DemoBanner from "../components/ui/DemoBanner";
import { LoadingState, EmptyState, ErrorState } from "../components/ui/LoadingState";
import { DEMO_SHIPMENTS } from "../utils/demoData";
import { deriveAlerts } from "../utils/alerts";

const ICONS = { CRITICAL: AlertTriangle, HIGH: Thermometer, MEDIUM: Clock, LOW: Sparkles };
const COLORS = {
  CRITICAL: "text-risk-critical bg-risk-critical/10 border-risk-critical/20",
  HIGH: "text-risk-high bg-risk-high/10 border-risk-high/20",
  MEDIUM: "text-risk-medium bg-risk-medium/10 border-risk-medium/20",
  LOW: "text-frost-300 bg-frost-500/10 border-frost-500/20",
};

export default function Alerts() {
  const { data: raw, loading, error, isDemo, refetch } = useApiData(
    () => shipmentsApi.list(),
    [],
    DEMO_SHIPMENTS
  );
  const [filter, setFilter] = useState("ALL");

  const shipments = useMemo(() => (Array.isArray(raw) ? raw : raw?.content || []), [raw]);
  const alerts = useMemo(() => deriveAlerts(shipments), [shipments]);
  const filtered = filter === "ALL" ? alerts : alerts.filter((a) => a.severity === filter);

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <DemoBanner show={isDemo} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Alerts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time notifications from your cold chain</p>
        </div>
        <div className="flex items-center gap-1.5">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                filter === f ? "bg-frost-500/10 text-frost-300 border-frost-500/30" : "text-slate-400 border-white/[0.06] hover:bg-white/[0.04]"
              }`}
            >
              {f === "ALL" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel p-2">
        {loading ? (
          <LoadingState label="Checking for alerts" />
        ) : error && !isDemo ? (
          <ErrorState subtitle="Check that the backend is running at localhost:8080." onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={ShieldCheck} title="All clear" subtitle="No alerts match this filter right now." />
        ) : (
          <div className="space-y-2 p-3">
            {filtered.map((a) => {
              const Icon = ICONS[a.severity] || Bell;
              return (
                <Link
                  key={a.id}
                  to={`/shipments/${a.shipmentId}`}
                  className={`flex items-start gap-3.5 rounded-xl border p-4 hover:brightness-110 transition-all ${COLORS[a.severity] || COLORS.LOW}`}
                >
                  <Icon size={17} className="mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-100">{a.message}</p>
                    <p className="mt-1 text-xs text-slate-500">{a.time} · {a.shipmentId}</p>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80 shrink-0">{a.severity}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
