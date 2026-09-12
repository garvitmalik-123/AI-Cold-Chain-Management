import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";

const COLORS = { Low: "#34D399", Medium: "#FBBF24", High: "#FB923C", Critical: "#F87171" };

export default function RiskDistributionChart({ data }) {
  return (
    <div className="glass-panel p-5">
      <h3 className="mb-3 text-sm font-semibold text-white">Risk Distribution</h3>
      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={data} margin={{ top: 10, right: 8, left: 8, bottom: 0 }} barSize={40}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            contentStyle={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              fontSize: 12,
              color: "#e2e8f0",
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[entry.name] || "#3C4A66"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
