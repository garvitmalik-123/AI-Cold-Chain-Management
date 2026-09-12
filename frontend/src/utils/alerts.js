// Alerts are derived from live shipment risk/status signals since the
// backend has no dedicated /alerts endpoint in its API contract.
export function deriveAlerts(shipments) {
  const alerts = [];
  shipments.forEach((s) => {
    const lvl = s.riskLevel?.toUpperCase();
    if (lvl === "CRITICAL") {
      alerts.push({
        id: `${s.id}-risk`,
        shipmentId: s.id,
        severity: "CRITICAL",
        message: `Critical spoilage risk detected for ${s.product} (${s.id})`,
        time: "Live",
      });
    } else if (lvl === "HIGH") {
      alerts.push({
        id: `${s.id}-risk`,
        shipmentId: s.id,
        severity: "HIGH",
        message: `High risk conditions on ${s.product} (${s.id})`,
        time: "Live",
      });
    }
    if (s.status?.toUpperCase() === "DELAYED") {
      alerts.push({
        id: `${s.id}-delay`,
        shipmentId: s.id,
        severity: "MEDIUM",
        message: `Shipment ${s.id} delayed — ${s.product}`,
        time: "Live",
      });
    }
  });
  return alerts;
}
