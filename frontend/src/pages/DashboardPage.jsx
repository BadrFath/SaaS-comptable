import { useEffect, useMemo, useState } from "react";
import { fetchMandants } from "../api";

function statusTone(status) {
  if (status === "alert") {
    return "text-danger bg-red-50 border-red-200";
  }
  if (status === "warning") {
    return "text-warning bg-amber-50 border-amber-200";
  }
  return "text-success bg-emerald-50 border-emerald-200";
}

function formatDate(value) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString("fr-BE");
}

function DashboardPage() {
  const [mandants, setMandants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");
      const payload = await fetchMandants();
      setMandants(payload.data || []);
    } catch (err) {
      setError(err.message || "Chargement impossible");
      setMandants([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const metrics = useMemo(() => {
    const totals = {
      total: mandants.length,
      alert: 0,
      warning: 0,
      activeAlerts: 0
    };

    for (const item of mandants) {
      if (item.status === "alert") {
        totals.alert += 1;
      }
      if (item.status === "warning") {
        totals.warning += 1;
      }
      totals.activeAlerts += Number(item.activeAlertCount || 0);
    }

    return totals;
  }, [mandants]);

  return (
    <section className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-soft backdrop-blur">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Dossiers</p>
          <p className="mt-2 font-display text-3xl font-semibold">{metrics.total}</p>
        </article>
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50/85 p-4 shadow-soft">
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">Statut alert</p>
          <p className="mt-2 font-display text-3xl font-semibold text-emerald-900">{metrics.alert}</p>
        </article>
        <article className="rounded-2xl border border-amber-200 bg-amber-50/85 p-4 shadow-soft">
          <p className="text-xs uppercase tracking-[0.18em] text-amber-700">Statut warning</p>
          <p className="mt-2 font-display text-3xl font-semibold text-amber-900">{metrics.warning}</p>
        </article>
        <article className="rounded-2xl border border-orange-200 bg-orange-50/90 p-4 shadow-soft">
          <p className="text-xs uppercase tracking-[0.18em] text-orange-700">Alertes actives</p>
          <p className="mt-2 font-display text-3xl font-semibold text-orange-900">{metrics.activeAlerts}</p>
        </article>
      </div>

      <article className="rounded-3xl border border-white/85 bg-white/85 p-5 shadow-floating backdrop-blur sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Vue cabinet</h2>
            <p className="text-sm text-slate-600">Etat de vos mandants synchronises avec FPS.</p>
          </div>
          <button
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
            onClick={load}
            type="button"
          >
            Rafraichir
          </button>
        </div>

        {loading && <p className="text-slate-500">Chargement en cours...</p>}
        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-danger">{error}</p>}

        {!loading && mandants.length === 0 && !error && (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Aucun mandant disponible pour le moment.
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {mandants.map((mandant) => (
            <article
              className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft transition hover:-translate-y-1"
              key={mandant.ecbNumber}
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold leading-tight">{mandant.companyName || "Entreprise"}</h3>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${statusTone(mandant.status)}`}>
                  {mandant.status || "ok"}
                </span>
              </div>
              <p className="text-sm text-slate-600">BCE: {mandant.ecbNumber}</p>
              <p className="mt-1 text-sm text-slate-600">Alertes actives: {mandant.activeAlertCount ?? 0}</p>
              <p className="mt-1 text-sm text-slate-600">Consentement: {formatDate(mandant.consentGivenAt)}</p>
              <p className="mt-1 text-sm text-slate-600">Derniere sync: {formatDate(mandant.lastSyncAt)}</p>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

export { DashboardPage };
