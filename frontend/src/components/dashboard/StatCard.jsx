export default function StatCard({ icon: Icon, label, value, delta, deltaDirection = "up", tone = "default" }) {
  const toneRing = {
    default: "bg-base-800 text-frost-300",
    warning: "bg-risk-medium/10 text-risk-medium",
    danger: "bg-risk-critical/10 text-risk-critical",
    high: "bg-risk-high/10 text-risk-high",
  }[tone];

  const deltaColor = deltaDirection === "up" ? "text-risk-low" : "text-risk-critical";

  return (
    <div className="glass-panel glass-panel-hover p-4">
      <div className="flex items-start justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneRing}`}>
          <Icon size={17} />
        </div>
        {delta && (
          <span className={`text-[11px] font-medium ${deltaColor}`}>
            {deltaDirection === "up" ? "↑" : "↓"} {delta}
          </span>
        )}
      </div>
      <p className="stat-value mt-3">{value}</p>
      <p className="label-eyebrow mt-0.5">{label}</p>
    </div>
  );
}
