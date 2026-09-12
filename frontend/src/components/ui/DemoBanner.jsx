import { WifiOff } from "lucide-react";

export default function DemoBanner({ show }) {
  if (!show) return null;
  return (
    <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-risk-medium/25 bg-risk-medium/[0.06] px-4 py-2.5 text-xs text-risk-medium">
      <WifiOff size={14} />
      Backend unreachable at localhost:8080 — showing sample demo data.
    </div>
  );
}
