import { useEffect, useMemo, useState } from "react";
import { fetchAlerts } from "../api";

function levelTone(level) {
  if (level === "critical") {
    return "border-red-200 bg-red-50 text-danger";
  }
  if (level === "warning") {
    return "border-amber-200 bg-amber-50 text-warning";
  }
  return "border-cyan-200 bg-cyan-50 text-accent";
}

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAlerts().then((payload) => setAlerts(payload.data || [])).catch(() => setAlerts([]));
  }, []);

  const visibleAlerts = useMemo(() => {
    if (filter === "all") {
      return alerts;
    }
    return alerts.filter((item) => item.level === filter);
  }, [alerts, filter]);

  return (
    <section className="space-y-5">
      <article className="rounded-3xl border border-white/85 bg-white/85 p-5 shadow-floating backdrop-blur sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Alertes fiscales</h2>
            <p className="text-sm text-slate-600">Signaux prioritaires remontes depuis FPS MyMinfin.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "Toutes" },
              { key: "critical", label: "Critical" },
              { key: "warning", label: "Warning" },
              { key: "info", label: "Info" }
            ].map((entry) => (
              <button
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  filter === entry.key
                    ? "bg-ink text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                key={entry.key}
                onClick={() => setFilter(entry.key)}
                type="button"
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {visibleAlerts.length === 0 && (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Aucune alerte dans ce filtre.
            </p>
          )}
          {visibleAlerts.map((alert) => (
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft" key={alert.id}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-lg font-semibold">{alert.title}</h3>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${levelTone(alert.level)}`}>
                  {alert.level}
                </span>
              </div>
              <p className="text-sm text-slate-700">{alert.detail}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                <span>Mandant: {alert.mandantEcb}</span>
                <span>Date document: {alert.documentDate}</span>
                <span>Statut: {alert.status}</span>
              </div>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

export { AlertsPage };
