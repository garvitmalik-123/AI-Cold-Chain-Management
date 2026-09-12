export const RISK_LEVELS = {
  LOW: {
    label: "Low",
    color: "#34D399",
    bg: "bg-risk-low/10",
    text: "text-risk-low",
    border: "border-risk-low/30",
    dot: "bg-risk-low",
  },
  MEDIUM: {
    label: "Medium",
    color: "#FBBF24",
    bg: "bg-risk-medium/10",
    text: "text-risk-medium",
    border: "border-risk-medium/30",
    dot: "bg-risk-medium",
  },
  HIGH: {
    label: "High",
    color: "#FB923C",
    bg: "bg-risk-high/10",
    text: "text-risk-high",
    border: "border-risk-high/30",
    dot: "bg-risk-high",
  },
  CRITICAL: {
    label: "Critical",
    color: "#F87171",
    bg: "bg-risk-critical/10",
    text: "text-risk-critical",
    border: "border-risk-critical/30",
    dot: "bg-risk-critical",
  },
};

export function getRiskMeta(level) {
  if (!level) return RISK_LEVELS.LOW;
  const key = String(level).toUpperCase();
  return RISK_LEVELS[key] || RISK_LEVELS.LOW;
}

export const STATUS_META = {
  CREATED: { label: "Created", color: "#94A3B8" },
  IN_TRANSIT: { label: "In Transit", color: "#5EEAD4" },
  DELIVERED: { label: "Delivered", color: "#34D399" },
  DELAYED: { label: "Delayed", color: "#FBBF24" },
  CANCELLED: { label: "Cancelled", color: "#F87171" },
};

export function getStatusMeta(status) {
  if (!status) return STATUS_META.CREATED;
  const key = String(status).toUpperCase().replace(/\s+/g, "_");
  return STATUS_META[key] || { label: status, color: "#94A3B8" };
}
