import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, PackageSearch, X, Loader2 } from "lucide-react";
import { useApiData } from "../hooks/useApiData";
import { shipmentsApi } from "../api/endpoints";
import RiskBadge from "../components/ui/RiskBadge";
import StatusPill from "../components/ui/StatusPill";
import DemoBanner from "../components/ui/DemoBanner";
import { LoadingState, EmptyState, ErrorState } from "../components/ui/LoadingState";
import { DEMO_SHIPMENTS } from "../utils/demoData";
import { PRODUCT_CATEGORIES, SHIPMENT_STATUSES, humanize } from "../utils/enums";

export default function Shipments() {
  const { data: shipmentsRaw, loading, error, isDemo, refetch } = useApiData(
    () => shipmentsApi.list(),
    [],
    DEMO_SHIPMENTS
  );
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showCreate, setShowCreate] = useState(false);

  const shipments = useMemo(
    () => (Array.isArray(shipmentsRaw) ? shipmentsRaw : shipmentsRaw?.content || []),
    [shipmentsRaw]
  );

  const filtered = shipments.filter((s) => {
    const matchesQuery =
      !query ||
      s.product?.toLowerCase().includes(query.toLowerCase()) ||
      String(s.id).toLowerCase().includes(query.toLowerCase()) ||
      s.destination?.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || String(s.status).toUpperCase() === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="max-w-[1600px] mx-auto space-y-5">
      <DemoBanner show={isDemo} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Shipments</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track every perishable shipment in real time</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-frost-500 px-4 py-2.5 text-sm font-semibold text-base-950 hover:bg-frost-400 transition-colors shrink-0"
        >
          <Plus size={16} /> Create Shipment
        </button>
      </div>

      <div className="glass-panel p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, product or destination…"
              className="w-full rounded-xl border border-white/[0.08] bg-base-900/60 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:border-frost-500/40 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border ${
                statusFilter === "ALL" ? "bg-frost-500/10 text-frost-300 border-frost-500/30" : "text-slate-400 border-white/[0.06] hover:bg-white/[0.04]"
              }`}
            >
              All
            </button>
            {SHIPMENT_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border ${
                  statusFilter === s
                    ? "bg-frost-500/10 text-frost-300 border-frost-500/30"
                    : "text-slate-400 border-white/[0.06] hover:bg-white/[0.04]"
                }`}
              >
                {humanize(s)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        {loading ? (
          <LoadingState label="Loading shipments" />
        ) : error && !isDemo ? (
          <ErrorState subtitle="Check that the backend is running at localhost:8080." onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No shipments found"
            subtitle={query ? "Try a different search term." : "Create your first shipment to get started."}
          />
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-xs text-slate-500">
                  <th className="px-5 py-3 font-medium">ID</th>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Route</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Temp / Humidity</th>
                  <th className="px-5 py-3 font-medium">Risk</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500 max-w-[110px] truncate">{s.id}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-200">
                      {s.product} <span className="text-slate-500 font-normal">· {s.quantity}kg</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{humanize(s.category)}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">
                      {s.source} <span className="text-slate-600">→</span> {s.destination}
                    </td>
                    <td className="px-5 py-3.5"><StatusPill status={s.status} /></td>
                    <td className="px-5 py-3.5 text-slate-300 text-xs font-mono">
                      {s.temperature != null ? `${s.temperature}°C` : "—"} / {s.humidity != null ? `${s.humidity}%` : "—"}
                    </td>
                    <td className="px-5 py-3.5"><RiskBadge level={s.riskLevel} size="sm" /></td>
                    <td className="px-5 py-3.5 text-right">
                      <Link to={`/shipments/${s.id}`} className="text-xs font-medium text-frost-300 hover:text-frost-200">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && <CreateShipmentModal onClose={() => setShowCreate(false)} onCreated={refetch} />}
    </div>
  );
}

const initialForm = {
  product: "",
  category: PRODUCT_CATEGORIES[0],
  quantity: "",
  source: "",
  destination: "",
  sourceLatitude: "",
  sourceLongitude: "",
  destinationLatitude: "",
  destinationLongitude: "",
  temperature: "",
  humidity: "",
};

function CreateShipmentModal({ onClose, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        quantity: parseFloat(form.quantity) || 0,
        sourceLatitude: parseFloat(form.sourceLatitude) || 0,
        sourceLongitude: parseFloat(form.sourceLongitude) || 0,
        destinationLatitude: parseFloat(form.destinationLatitude) || 0,
        destinationLongitude: parseFloat(form.destinationLongitude) || 0,
        temperature: parseFloat(form.temperature) || 0,
        humidity: parseFloat(form.humidity) || 0,
        currentLatitude: parseFloat(form.sourceLatitude) || 0,
        currentLongitude: parseFloat(form.sourceLongitude) || 0,
      };
      await shipmentsApi.create(payload);
      onCreated();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't create shipment. Please check the backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-base-900 p-6 shadow-card my-auto">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Create Shipment</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3.5">
          {error && (
            <div className="rounded-xl border border-risk-critical/25 bg-risk-critical/[0.07] px-3.5 py-2.5 text-xs text-risk-critical">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Product" name="product" value={form.product} onChange={onChange} placeholder="Tomatoes" required />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={onChange}
                className="w-full rounded-xl border border-white/[0.08] bg-base-900/60 py-2.5 px-3.5 text-sm text-slate-200 focus:border-frost-500/40 focus:outline-none transition-colors"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-base-900">{humanize(c)}</option>
                ))}
              </select>
            </div>
          </div>

          <Field label="Quantity (kg)" name="quantity" type="number" value={form.quantity} onChange={onChange} placeholder="500" required />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Source" name="source" value={form.source} onChange={onChange} placeholder="Rohtak" required />
            <Field label="Destination" name="destination" value={form.destination} onChange={onChange} placeholder="Dehradun" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Source Latitude" name="sourceLatitude" type="number" step="any" value={form.sourceLatitude} onChange={onChange} placeholder="28.90" />
            <Field label="Source Longitude" name="sourceLongitude" type="number" step="any" value={form.sourceLongitude} onChange={onChange} placeholder="76.60" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Dest. Latitude" name="destinationLatitude" type="number" step="any" value={form.destinationLatitude} onChange={onChange} placeholder="30.31" />
            <Field label="Dest. Longitude" name="destinationLongitude" type="number" step="any" value={form.destinationLongitude} onChange={onChange} placeholder="78.03" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Initial Temp (°C)" name="temperature" type="number" step="any" value={form.temperature} onChange={onChange} placeholder="4.5" />
            <Field label="Initial Humidity (%)" name="humidity" type="number" step="any" value={form.humidity} onChange={onChange} placeholder="65" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-frost-500 py-2.5 text-sm font-semibold text-base-950 hover:bg-frost-400 transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : "Create Shipment"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-400">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl border border-white/[0.08] bg-base-900/60 py-2.5 px-3.5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-frost-500/40 focus:outline-none transition-colors"
      />
    </div>
  );
}
