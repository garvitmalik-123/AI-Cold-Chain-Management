import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, TrendingUp, Thermometer } from "lucide-react";
import { useApiData } from "../hooks/useApiData";
import { shipmentsApi } from "../api/endpoints";
import RiskBadge from "../components/ui/RiskBadge";
import DemoBanner from "../components/ui/DemoBanner";
import { LoadingState, EmptyState, ErrorState } from "../components/ui/LoadingState";
import { DEMO_SHIPMENTS } from "../utils/demoData";

const ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export default function RiskMonitoring() {
  const { data: raw, loading, error, isDemo, refetch } = useApiData(
    () => shipmentsApi.list(),
    [],
    DEMO_SHIPMENTS
  );
  const [filter, setFilter] = useState("ALL");

  const shipments = useMemo(() => {
    const list = Array.isArray(raw) ? raw : raw?.content || [];
    return [...list].sort((a, b) => (ORDER[a.riskLevel?.toUpperCase()] ?? 4) - (ORDER[b.riskLevel?.toUpperCase()] ?? 4));
  }, [raw]);

  const filtered = filter === "ALL" ? shipments : shipments.filter((s) => s.riskLevel?.toUpperCase() === filter);

  const counts = useMemo(() => {
    const c = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    shipments.forEach((s) => {
      const lvl = s.riskLevel?.toUpperCase();
      if (c[lvl] != null) c[lvl]++;
    });
    return c;
  }, [shipments]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      <DemoBanner show={isDemo} />

      <div>
        <h1 className="text-xl font-semibold text-white">Risk Monitoring</h1>
        <p className="text-sm text-slate-500 mt-0.5">AI-scored spoilage risk across all active shipments</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilter(filter === lvl ? "ALL" : lvl)}
            className={`glass-panel p-4 text-left transition-all ${filter === lvl ? "border-frost-500/40 shadow-glow" : "glass-panel-hover"}`}
          >
            <div className="flex items-center justify-between">
              <RiskBadge level={lvl} size="sm" />
              <ShieldAlert size={14} className="text-slate-600" />
            </div>
            <p className="stat-value mt-2">{counts[lvl]}</p>
            <p className="label-eyebrow mt-0.5">shipments</p>
          </button>
        ))}
      </div>

      <div className="glass-panel overflow-hidden">
        {loading ? (
          <LoadingState label="Analyzing risk levels" />
        ) : error && !isDemo ? (
          <ErrorState subtitle="Check that the backend is running at localhost:8080." onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={ShieldAlert} title="No shipments in this risk tier" />
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((s) => (
              <Link
                key={s.id}
                to={`/shipments/${s.id}`}
                className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-base-800">
                    <Thermometer size={16} className="text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{s.product} <span className="text-slate-600 font-mono text-xs">· {s.id}</span></p>
                    <p className="text-xs text-slate-500">{s.source} → {s.destination} · currently {s.currentLatitude?.toFixed?.(2)}, {s.currentLongitude?.toFixed?.(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 sm:gap-8 pl-13 sm:pl-0">
                  <div className="text-xs">
                    <p className="text-slate-500">Temp</p>
                    <p className="font-mono text-slate-200">{s.temperature}°C</p>
                  </div>
                  <div className="text-xs">
                    <p className="text-slate-500">Humidity</p>
                    <p className="font-mono text-slate-200">{s.humidity}%</p>
                  </div>
                  <RiskBadge level={s.riskLevel} />
                  <TrendingUp size={14} className="text-slate-600 hidden sm:block" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
