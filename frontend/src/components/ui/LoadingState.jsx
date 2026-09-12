import { Loader2, Inbox, AlertTriangle, Snowflake } from "lucide-react";

export function LoadingState({ label = "Loading data" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
      <Loader2 className="h-6 w-6 animate-spin text-frost-400" />
      <p className="text-sm">{label}…</p>
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title = "Nothing here yet", subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-base-800 border border-white/[0.06]">
        <Icon className="h-5 w-5 text-slate-500" />
      </div>
      <p className="text-sm font-medium text-slate-300">{title}</p>
      {subtitle && <p className="text-xs text-slate-500 max-w-xs">{subtitle}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Couldn't load this", subtitle, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-risk-critical/10 border border-risk-critical/20">
        <AlertTriangle className="h-5 w-5 text-risk-critical" />
      </div>
      <p className="text-sm font-medium text-slate-200">{title}</p>
      {subtitle && <p className="text-xs text-slate-500 max-w-sm">{subtitle}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 rounded-lg border border-white/10 bg-base-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-base-700 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function FullPageLoader({ label = "Booting up ColdChain AI" }) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-base-950">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-frost-500/20 blur-xl animate-pulse-slow" />
        <Snowflake className="relative h-7 w-7 text-frost-400 animate-spin" style={{ animationDuration: "3s" }} />
      </div>
      <p className="text-sm text-slate-500">{label}…</p>
    </div>
  );
}
