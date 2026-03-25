import { Link, Route, Routes, useLocation } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { ConnectMandantPage } from "./pages/ConnectMandantPage.jsx";
import { ConnectResultPage } from "./pages/ConnectResultPage.jsx";
import { AlertsPage } from "./pages/AlertsPage.jsx";
import { AnalysisPage } from "./pages/AnalysisPage.jsx";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/alerts", label: "Alertes" },
  { to: "/analysis", label: "Analyse" },
  { to: "/connect", label: "Connecter" }
];

function AppShell({ children }) {
  const location = useLocation();

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas font-body text-ink">
      <div className="pointer-events-none absolute -left-16 top-20 h-72 w-72 rounded-full bg-[#8fd4dd]/45 blur-3xl" />
      <div className="pointer-events-none absolute right-[-5rem] top-[-2rem] h-80 w-80 rounded-full bg-[#f3c58a]/50 blur-3xl" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <header className="mb-6 animate-rise rounded-3xl border border-white/70 bg-white/70 px-5 py-4 shadow-soft backdrop-blur sm:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.26em] text-accent">NV SaaS Comptable</p>
              <h1 className="font-display text-2xl font-semibold sm:text-3xl">Cabinet cockpit fiscal</h1>
            </div>
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-ink text-white shadow-soft"
                        : "bg-white/80 text-ink hover:-translate-y-0.5 hover:bg-white"
                    }`}
                    key={item.to}
                    to={item.to}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>
        <main className="animate-rise">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/connect" element={<ConnectMandantPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/connect/success" element={<ConnectResultPage mode="success" />} />
          <Route path="/connect/error" element={<ConnectResultPage mode="error" />} />
        </Routes>
    </AppShell>
  );
}
