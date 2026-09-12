import { useState } from "react";
import { User, Mail, Shield, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { humanize } from "../utils/enums";

export default function Profile() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const name = user?.name || user?.email?.split("@")[0] || "User";
  const email = user?.email || "—";
  const role = humanize(user?.role) !== "—" ? humanize(user?.role) : "Transporter";

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => logout(), 300);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white">Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">Your account details</p>
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-frost-400 to-frost-600 text-xl font-semibold text-base-950">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{name}</p>
            <p className="text-sm text-slate-500">{role}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t border-white/[0.06] pt-5">
          <InfoRow icon={User} label="Full Name" value={name} />
          <InfoRow icon={Mail} label="Email Address" value={email} />
          <InfoRow icon={Shield} label="Role" value={role} />
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-sm font-semibold text-white mb-1">Session</h3>
        <p className="text-xs text-slate-500 mb-4">Sign out of ColdChain AI on this device.</p>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 rounded-xl border border-risk-critical/25 bg-risk-critical/[0.08] px-4 py-2.5 text-sm font-medium text-risk-critical hover:bg-risk-critical/[0.14] transition-colors disabled:opacity-60"
        >
          {loggingOut ? <Loader2 size={15} className="animate-spin" /> : <LogOut size={15} />}
          Log Out
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-base-800 text-slate-400">
        <Icon size={15} />
      </div>
      <div>
        <p className="text-[11px] text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-200">{value}</p>
      </div>
    </div>
  );
}
