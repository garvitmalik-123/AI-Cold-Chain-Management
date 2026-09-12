import { Link } from "react-router-dom";
import { AlertTriangle, Thermometer, Clock, Sparkles, ShieldCheck } from "lucide-react";
import { EmptyState } from "../ui/LoadingState";

const ICONS = {
  CRITICAL: AlertTriangle,
  HIGH: Thermometer,
  MEDIUM: Clock,
  LOW: Sparkles,
};

const COLORS = {
  CRITICAL: "text-risk-critical bg-risk-critical/10 border-risk-critical/20",
  HIGH: "text-risk-high bg-risk-high/10 border-risk-high/20",
  MEDIUM: "text-risk-medium bg-risk-medium/10 border-risk-medium/20",
  LOW: "text-frost-300 bg-frost-500/10 border-frost-500/20",
};

export default function AlertPanel({ alerts }) {
  return (
    <div className="glass-panel p-5 h-full flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Alerts</h3>
        <Link to="/alerts" className="text-xs font-medium text-frost-300 hover:text-frost-200">
          View All
        </Link>
      </div>

      {alerts.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="All clear" subtitle="No active alerts across your cold chain." />
      ) : (
        <div className="space-y-2.5 overflow-y-auto scrollbar-thin pr-1 max-h-[340px]">
          {alerts.map((a) => {
            const Icon = ICONS[a.severity] || Clock;
            return (
              <div key={a.id} className={`flex items-start gap-3 rounded-xl border p-3 ${COLORS[a.severity] || COLORS.LOW}`}>
                <Icon size={15} className="mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium leading-snug text-slate-200">{a.message}</p>
                  <p className="mt-1 text-[10px] text-slate-500">{a.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
