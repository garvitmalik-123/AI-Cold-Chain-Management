import { useMemo, useState } from "react";
import { Plus, Warehouse, X, Loader2, MapPin, Boxes, Tags } from "lucide-react";
import { useApiData } from "../hooks/useApiData";
import { facilitiesApi } from "../api/endpoints";
import DemoBanner from "../components/ui/DemoBanner";
import { LoadingState, EmptyState, ErrorState } from "../components/ui/LoadingState";
import ShipmentMap from "../components/map/ShipmentMap";
import { DEMO_FACILITIES } from "../utils/demoData";
import { FACILITY_TYPES, PRODUCT_CATEGORIES, humanize } from "../utils/enums";

export default function Facilities() {
  const { data: raw, loading, error, isDemo, refetch } = useApiData(
    () => facilitiesApi.list(),
    [],
    DEMO_FACILITIES
  );
  const [showCreate, setShowCreate] = useState(false);

  const facilities = useMemo(() => (Array.isArray(raw) ? raw : raw?.content || []), [raw]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-5">
      <DemoBanner show={isDemo} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Facilities</h1>
          <p className="text-sm text-slate-500 mt-0.5">Cold storage, mandis and processing centres</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-frost-500 px-4 py-2.5 text-sm font-semibold text-base-950 hover:bg-frost-400 transition-colors shrink-0"
        >
          <Plus size={16} /> Add Facility
        </button>
      </div>

      {loading ? (
        <LoadingState label="Loading facilities" />
      ) : error && !isDemo ? (
        <ErrorState subtitle="Check that the backend is running at localhost:8080." onRetry={refetch} />
      ) : facilities.length === 0 ? (
        <EmptyState icon={Warehouse} title="No facilities registered" subtitle="Add a cold storage, mandi or processing centre to get started." />
      ) : (
        <>
          <div className="glass-panel p-5">
            <h3 className="mb-3 text-sm font-semibold text-white">Facility Map</h3>
            <ShipmentMap facilities={facilities} height={380} zoom={7} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {facilities.map((f) => {
              const pct = f.totalCapacity ? Math.round((f.availableCapacity / f.totalCapacity) * 100) : null;
              return (
                <div key={f.id} className="glass-panel glass-panel-hover p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-frost-500/10 text-frost-300">
                      <Warehouse size={16} />
                    </div>
                    {pct != null && <span className="text-[11px] font-medium text-slate-400">{pct}% free</span>}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white">{f.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{humanize(f.type)}{f.address ? ` · ${f.address}` : ""}</p>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin size={12} />
                      {f.latitude?.toFixed(2)}, {f.longitude?.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Boxes size={12} />
                      {f.availableCapacity} / {f.totalCapacity} kg
                    </div>
                    {f.supportedCategories?.length > 0 && (
                      <div className="flex items-start gap-1.5 text-slate-400">
                        <Tags size={12} className="mt-0.5 shrink-0" />
                        <span>{f.supportedCategories.map(humanize).join(", ")}</span>
                      </div>
                    )}
                  </div>

                  {pct != null && (
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-base-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-frost-500 to-frost-300" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {showCreate && <CreateFacilityModal onClose={() => setShowCreate(false)} onCreated={refetch} />}
    </div>
  );
}

const initialForm = {
  name: "",
  type: FACILITY_TYPES[0],
  latitude: "",
  longitude: "",
  address: "",
  totalCapacity: "",
  availableCapacity: "",
  supportedCategories: [],
};

function CreateFacilityModal({ onClose, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const toggleCategory = (cat) => {
    setForm((f) => ({
      ...f,
      supportedCategories: f.supportedCategories.includes(cat)
        ? f.supportedCategories.filter((c) => c !== cat)
        : [...f.supportedCategories, cat],
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await facilitiesApi.create({
        ...form,
        latitude: parseFloat(form.latitude) || 0,
        longitude: parseFloat(form.longitude) || 0,
        totalCapacity: parseFloat(form.totalCapacity) || 0,
        availableCapacity: parseFloat(form.availableCapacity) || 0,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't add facility. Please check the backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-base-900 p-6 shadow-card my-auto">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Add Facility</h2>
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
            <Field label="Facility Name" name="name" value={form.name} onChange={onChange} placeholder="Panipat Cold Hub" required />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={onChange}
                className="w-full rounded-xl border border-white/[0.08] bg-base-900/60 py-2.5 px-3.5 text-sm text-slate-200 focus:border-frost-500/40 focus:outline-none transition-colors"
              >
                {FACILITY_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-base-900">{humanize(t)}</option>
                ))}
              </select>
            </div>
          </div>

          <Field label="Address" name="address" value={form.address} onChange={onChange} placeholder="Panipat, Haryana" />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude" name="latitude" type="number" step="any" value={form.latitude} onChange={onChange} placeholder="29.39" required />
            <Field label="Longitude" name="longitude" type="number" step="any" value={form.longitude} onChange={onChange} placeholder="76.96" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Total Capacity (kg)" name="totalCapacity" type="number" value={form.totalCapacity} onChange={onChange} placeholder="5000" required />
            <Field label="Available Capacity (kg)" name="availableCapacity" type="number" value={form.availableCapacity} onChange={onChange} placeholder="3200" required />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Supported Categories</label>
            <div className="flex flex-wrap gap-1.5">
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                    form.supportedCategories.includes(cat)
                      ? "bg-frost-500/10 text-frost-300 border-frost-500/30"
                      : "text-slate-400 border-white/[0.08] hover:bg-white/[0.04]"
                  }`}
                >
                  {humanize(cat)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-frost-500 py-2.5 text-sm font-semibold text-base-950 hover:bg-frost-400 transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : "Add Facility"}
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
