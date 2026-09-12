import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Truck,
  ShieldAlert,
  Warehouse,
  Bell,
  UserRound,
  LogOut,
  Snowflake,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/shipments", label: "Shipments", icon: Truck },
  { to: "/risk-monitoring", label: "Risk Monitoring", icon: ShieldAlert },
  { to: "/facilities", label: "Facilities", icon: Warehouse },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export default function Sidebar({ alertCount = 0, mobile = false, onNavigate }) {
  const { logout } = useAuth();

  return (
    <aside
      className={`flex h-full w-64 flex-col border-r border-white/[0.06] bg-base-900/80 backdrop-blur-xl ${
        mobile ? "" : "hidden lg:flex"
      }`}
    >
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-frost-500/10 border border-frost-500/20">
          <Snowflake className="h-4.5 w-4.5 text-frost-400" size={18} />
        </div>
        <div className="leading-tight">
          <p className="font-display text-[15px] font-semibold text-white">ColdChain AI</p>
          <p className="text-[11px] text-slate-500">Smarter Logistics, Fresher Tomorrow</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-frost-500/10 text-frost-300 border border-frost-500/20"
                  : "text-slate-400 border border-transparent hover:bg-white/[0.04] hover:text-slate-200"
              }`
            }
          >
            <span className="flex items-center gap-3">
              <Icon size={17} strokeWidth={2} />
              {label}
            </span>
            {label === "Alerts" && alertCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-risk-critical/90 px-1 text-[10px] font-semibold text-white">
                {alertCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4">
        <div className="mb-3 rounded-xl border border-white/[0.06] bg-gradient-to-br from-frost-500/10 to-transparent p-4">
          <p className="text-xs font-medium text-slate-300">Keep products fresh.</p>
          <p className="text-xs text-slate-500 mt-0.5">Keep business moving.</p>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/[0.04] hover:text-risk-critical transition-colors"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
