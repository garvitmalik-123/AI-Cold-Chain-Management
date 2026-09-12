import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Snowflake, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ROLES, humanize } from "../utils/enums";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "TRANSPORTER" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-base-950 px-6 py-12">
      <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-frost-500/10 border border-frost-500/20">
            <Snowflake className="h-4.5 w-4.5 text-frost-400" size={18} />
          </div>
          <span className="font-display text-lg font-semibold text-white">ColdChain AI</span>
        </div>

        <div className="glass-panel p-8">
          <h1 className="text-xl font-semibold text-white text-center">Create your account</h1>
          <p className="mt-1.5 text-sm text-slate-400 text-center">Start monitoring your cold chain in minutes.</p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            {error && (
              <div className="rounded-xl border border-risk-critical/25 bg-risk-critical/[0.07] px-3.5 py-2.5 text-xs text-risk-critical">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Rahul Sharma"
                  className="w-full rounded-xl border border-white/[0.08] bg-base-900/60 py-3 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:border-frost-500/40 focus:outline-none transition-colors"
                />
              </div>
            </div>

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
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Role</label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                <select
                  name="role"
                  value={form.role}
                  onChange={onChange}
                  className="w-full appearance-none rounded-xl border border-white/[0.08] bg-base-900/60 py-3 pl-10 pr-4 text-sm text-slate-200 focus:border-frost-500/40 focus:outline-none transition-colors"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r} className="bg-base-900">
                      {humanize(r)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  required
                  minLength={6}
                  type={showPw ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="At least 6 characters"
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
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Create account <ArrowRight size={15} /></>}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-frost-300 hover:text-frost-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
