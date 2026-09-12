import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  Created: "#94A3B8",
  "In Transit": "#5EEAD4",
  Delayed: "#FBBF24",
  Delivered: "#34D399",
  Cancelled: "#F87171",
};

export default function ShipmentStatusChart({ data, total }) {
  const chartData = data.filter((d) => d.value > 0);

  return (
    <div className="glass-panel p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Shipment Status</h3>
      </div>
      <div className="relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={3}
              stroke="none"
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={COLORS[entry.name] || "#3C4A66"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                fontSize: 12,
                color: "#e2e8f0",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute flex flex-col items-center">
          <span className="font-display text-2xl font-bold text-white">{total}</span>
          <span className="text-[10px] text-slate-500">Total Shipments</span>
        </div>
      </div>
      <div className="mt-2 space-y-1.5">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-400">
              <span className="h-2 w-2 rounded-full" style={{ background: COLORS[d.name] || "#3C4A66" }} />
              {d.name}
            </span>
            <span className="text-slate-300 font-medium">
              {d.value} <span className="text-slate-600">· {total ? Math.round((d.value / total) * 100) : 0}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
