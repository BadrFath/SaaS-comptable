import { useEffect, useState } from "react";
import { fetchSignals } from "../api";

function scoreTone(score) {
  if (score >= 70) {
    return "bg-red-500";
  }
  if (score >= 40) {
    return "bg-amber-500";
  }
  return "bg-emerald-500";
}

function AnalysisPage() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    fetchSignals().then((payload) => setSignals(payload.data || [])).catch(() => setSignals([]));
  }, []);

  return (
    <section className="space-y-5">
      <article className="rounded-3xl border border-white/85 bg-white/85 p-5 shadow-floating backdrop-blur sm:p-6">
        <h2 className="font-display text-xl font-semibold">Analyse proactive</h2>
        <p className="mt-1 text-sm text-slate-600">
          Variations TVA et signaux de risque calcules a partir des metadonnees synchronisees.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {signals.length === 0 && (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Aucun signal disponible.
            </p>
          )}

          {signals.map((signal) => (
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft" key={signal.mandantEcb}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-semibold">{signal.companyName}</h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  BCE {signal.mandantEcb}
                </span>
              </div>

              <div className="mb-3">
                <div className="mb-1 flex justify-between text-xs text-slate-600">
                  <span>Score risque</span>
                  <span>{signal.riskScore}/100</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div
                    className={`h-2.5 rounded-full ${scoreTone(signal.riskScore)}`}
                    style={{ width: `${Math.max(5, signal.riskScore)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1 text-sm text-slate-700">
                <p>Variation TVA vs N-1: {signal.vatDelta}%</p>
                <p>Incoherences detectees: {signal.inconsistencyCount}</p>
                <p>Retards historiques: {signal.lateHistoryCount}</p>
              </div>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

export { AnalysisPage };
