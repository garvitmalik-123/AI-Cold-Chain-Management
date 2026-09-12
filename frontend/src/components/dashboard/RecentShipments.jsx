import { Link } from "react-router-dom";
import { ChevronRight, PackageSearch } from "lucide-react";
import RiskBadge from "../ui/RiskBadge";
import { EmptyState } from "../ui/LoadingState";

export default function RecentShipments({ shipments }) {
  return (
    <div className="glass-panel p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Recent Shipments</h3>
        <Link to="/shipments" className="text-xs font-medium text-frost-300 hover:text-frost-200">
          View All
        </Link>
      </div>

      {shipments.length === 0 ? (
        <EmptyState icon={PackageSearch} title="No shipments yet" subtitle="Create your first shipment to see it here." />
      ) : (
        <div className="space-y-1">
          {shipments.slice(0, 5).map((s) => (
            <Link
              key={s.id}
              to={`/shipments/${s.id}`}
              className="flex items-center justify-between rounded-xl px-2.5 py-2.5 hover:bg-white/[0.03] transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-base-800 text-[10px] font-mono text-slate-400">
                  {String(s.id).replace(/\D/g, "").slice(-2) || "•"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{s.product}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{s.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <RiskBadge level={s.riskLevel} size="sm" />
                <ChevronRight size={14} className="text-slate-600 group-hover:text-frost-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
