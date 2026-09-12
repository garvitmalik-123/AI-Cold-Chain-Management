import { getStatusMeta } from "../../utils/risk";

export default function StatusPill({ status }) {
  const meta = getStatusMeta(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border"
      style={{
        color: meta.color,
        backgroundColor: `${meta.color}1A`,
        borderColor: `${meta.color}33`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
      {meta.label}
    </span>
  );
}
