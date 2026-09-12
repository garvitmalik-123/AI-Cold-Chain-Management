import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from "react-leaflet";
import L from "leaflet";
import { getRiskMeta } from "../../utils/risk";

// Build a colored divIcon marker (avoids default leaflet icon asset issues)
function buildIcon(color, pulse = false) {
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:16px;height:16px;">
        ${pulse ? `<span style="position:absolute;inset:-8px;border-radius:9999px;background:${color}33;animation:ping 1.8s cubic-bezier(0,0,0.2,1) infinite;"></span>` : ""}
        <span style="position:absolute;inset:0;border-radius:9999px;background:${color};box-shadow:0 0 0 3px ${color}33, 0 2px 6px rgba(0,0,0,0.5);border:2px solid #0A0E16;"></span>
      </div>
      <style>@keyframes ping{75%,100%{transform:scale(2.2);opacity:0;}}</style>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function buildFacilityIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:22px;height:22px;border-radius:8px;background:#111827;border:1.5px solid #5EEAD4;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.5);">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" stroke-width="2.5"><path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6"/></svg>
    </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

export default function ShipmentMap({ shipments = [], facilities = [], height = 420, center, zoom = 8, showRoute = false }) {
  const validShipments = shipments.filter((s) => s.latitude && s.longitude);
  const validFacilities = facilities.filter((f) => f.latitude && f.longitude);

  const mapCenter =
    center ||
    (validShipments[0]
      ? [validShipments[0].latitude, validShipments[0].longitude]
      : validFacilities[0]
      ? [validFacilities[0].latitude, validFacilities[0].longitude]
      : [28.7041, 77.1025]); // Default: Delhi NCR region

  return (
    <div className="dark-tiles overflow-hidden rounded-xl border border-white/[0.06]" style={{ height }}>
      <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validShipments.map((s) => {
          const meta = getRiskMeta(s.riskLevel);
          const isCritical = String(s.riskLevel).toUpperCase() === "CRITICAL";
          return (
            <Marker key={s.id} position={[s.latitude, s.longitude]} icon={buildIcon(meta.color, isCritical)}>
              <Popup>
                <div className="text-xs">
                  <p className="font-semibold text-white mb-0.5">{s.id}</p>
                  <p className="text-slate-300">{s.product} · {s.quantity}</p>
                  <p className="mt-1 font-medium" style={{ color: meta.color }}>{meta.label} risk</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {validFacilities.map((f) => (
          <Marker key={f.id || f.name} position={[f.latitude, f.longitude]} icon={buildFacilityIcon()}>
            <Popup>
              <div className="text-xs">
                <p className="font-semibold text-white mb-0.5">{f.name}</p>
                <p className="text-slate-300">{f.type}</p>
                {f.availableCapacity != null && (
                  <p className="text-slate-400 mt-1">Available: {f.availableCapacity}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {showRoute &&
          validShipments.map(
            (s) =>
              s.route &&
              s.route.length > 1 && (
                <Polyline
                  key={`route-${s.id}`}
                  positions={s.route}
                  pathOptions={{ color: "#5EEAD4", weight: 2, dashArray: "5 6", opacity: 0.7 }}
                />
              )
          )}
      </MapContainer>
    </div>
  );
}