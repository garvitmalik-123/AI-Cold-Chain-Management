import { getRiskMeta } from "../../utils/risk";

export default function RiskBadge({ level, size = "md" }) {
  const meta = getRiskMeta(level);
  const sizeCls =
    size === "sm" ? "text-[10px] px-2 py-0.5 gap-1" : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${meta.bg} ${meta.text} ${meta.border} ${sizeCls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot} ${level?.toUpperCase() === "CRITICAL" ? "animate-pulse-slow" : ""}`} />
      {meta.label}
    </span>
  );
}
