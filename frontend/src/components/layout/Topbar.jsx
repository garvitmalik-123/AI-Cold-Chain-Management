import { useState } from "react";
import { Search, Bell, Menu, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function Topbar({ onMenuClick, alertCount = 0 }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const firstName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "there";
  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/[0.06] bg-base-950/80 backdrop-blur-xl px-4 py-4 lg:px-8">
      <button onClick={onMenuClick} className="lg:hidden text-slate-400 hover:text-white">
        <Menu size={22} />
      </button>

      <div className="hidden sm:block">
        <h1 className="text-lg font-semibold text-white leading-tight">
          {greeting()}, {firstName}
        </h1>
        <p className="text-xs text-slate-500">Here's what's happening with your cold chain today</p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input
            type="text"
            placeholder="Search shipments, facilities…"
            className="w-64 rounded-xl border border-white/[0.06] bg-base-900/60 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-frost-500/40 focus:outline-none transition-colors"
          />
        </div>

        <span className="hidden md:inline text-xs text-slate-500 rounded-lg border border-white/[0.06] px-2.5 py-1.5">
          {today}
        </span>

        <Link
          to="/alerts"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-base-900/60 text-slate-400 hover:text-frost-300 hover:border-frost-500/30 transition-colors"
        >
          <Bell size={16} />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-risk-critical px-1 text-[9px] font-bold text-white">
              {alertCount}
            </span>
          )}
        </Link>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-base-900/60 py-1.5 pl-1.5 pr-2.5 hover:border-frost-500/30 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-frost-400 to-frost-600 text-xs font-semibold text-base-950">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-200">{firstName}</span>
            <ChevronDown size={14} className="hidden sm:block text-slate-500" />
          </button>
          {menuOpen && (
            <div
              onMouseLeave={() => setMenuOpen(false)}
              className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-white/[0.08] bg-base-850 shadow-card"
            >
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm text-slate-300 hover:bg-white/[0.04]"
              >
                My Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
