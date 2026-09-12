import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Snowflake, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-base-950">
      {/* Left visual panel */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between p-12 border-r border-white/[0.06]">
        <div className="absolute inset-0 bg-grid-fade" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(94,234,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-frost-500/10 border border-frost-500/20">
            <Snowflake className="h-4.5 w-4.5 text-frost-400" size={18} />
          </div>
          <span className="font-display text-lg font-semibold text-white">ColdChain AI</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-semibold leading-tight text-white">
            Every degree matters.
            <br />
            <span className="text-frost-300">Every second counts.</span>
          </h2>
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            AI-powered risk prediction, live cold-chain telemetry and hyper-local rerouting —
            built to stop spoilage before it starts.
          </p>
          <div className="mt-8 flex gap-6">
            <div>
              <p className="font-display text-2xl font-semibold text-white">99.2%</p>
              <p className="text-xs text-slate-500 mt-0.5">Spoilage prevented</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-white">4.8s</p>
              <p className="text-xs text-slate-500 mt-0.5">Avg. risk detection</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-white">1,200+</p>
              <p className="text-xs text-slate-500 mt-0.5">Facilities mapped</p>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-slate-600">© 2026 ColdChain AI. Hyper-local perishable logistics intelligence.</p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-frost-500/10 border border-frost-500/20">
              <Snowflake className="h-4.5 w-4.5 text-frost-400" size={18} />
            </div>
            <span className="font-display text-lg font-semibold text-white">ColdChain AI</span>
          </div>

          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="mt-1.5 text-sm text-slate-400">Sign in to monitor your cold chain in real time.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-xl border border-risk-critical/25 bg-risk-critical/[0.07] px-3.5 py-2.5 text-xs text-risk-critical">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-white/[0.08] bg-base-900/60 py-3 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:border-frost-500/40 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  required
                  type={showPw ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/[0.08] bg-base-900/60 py-3 pl-10 pr-10 text-sm text-slate-200 placeholder:text-slate-600 focus:border-frost-500/40 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-frost-500 py-3 text-sm font-semibold text-base-950 hover:bg-frost-400 transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign in <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-frost-300 hover:text-frost-200">
              Create one
            </Link>
          </p>

          <div className="mt-6 rounded-xl border border-white/[0.06] bg-base-900/40 p-3.5">
            <p className="text-[11px] font-medium text-slate-400 mb-1.5">Demo credentials (seeded)</p>
            <div className="space-y-1 text-[11px] text-slate-500 font-mono">
              <p>admin@coldchain.com · Admin@123</p>
              <p>transporter@coldchain.com · Transport@123</p>
              <p>facility@coldchain.com · Facility@123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
