import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { fetchCurrentUser, getAuthToken, loginWithPassword, logout, registerAccount } from "./api";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { ConnectMandantPage } from "./pages/ConnectMandantPage.jsx";
import { ConnectResultPage } from "./pages/ConnectResultPage.jsx";
import { AlertsPage } from "./pages/AlertsPage.jsx";
import { AnalysisPage } from "./pages/AnalysisPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/alerts", label: "Alertes" },
  { to: "/analysis", label: "Analyse" },
  { to: "/connect", label: "Connecter" }
];

function AppShell({ children, isAuthenticated, currentUser, onLogout }) {
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
              {isAuthenticated ? (
                <>
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
                <button
                  className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:-translate-y-0.5 hover:bg-red-100"
                  onClick={onLogout}
                  type="button"
                >
                    Se deconnecter
                </button>
                </>
              ) : (
                <span className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Authentification requise</span>
              )}
            </nav>
          </div>
          {isAuthenticated && (
            <p className="mt-2 text-xs text-slate-600">Session: {currentUser?.fullName || currentUser?.email || "Utilisateur"}</p>
          )}
        </header>
        <main className="animate-rise">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function initSession() {
      if (!getAuthToken()) {
        setIsCheckingSession(false);
        return;
      }

      try {
        const payload = await fetchCurrentUser();
        setCurrentUser(payload.user || null);
      } catch (_error) {
        setCurrentUser(null);
      } finally {
        setIsCheckingSession(false);
      }
    }

    initSession();
  }, []);

  async function handleLogin({ email, password }) {
    try {
      setIsLoggingIn(true);
      setLoginError("");
      setRegisterSuccess("");
      const payload = await loginWithPassword({ email, password });
      setCurrentUser(payload.user || null);
    } catch (error) {
      setLoginError(error.message || "Connexion impossible");
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleRegister({ fullName, email, password }) {
    try {
      setIsRegistering(true);
      setRegisterError("");
      setRegisterSuccess("");
      const payload = await registerAccount({ fullName, email, password });
      setCurrentUser(payload.user || null);
      setRegisterSuccess("Inscription reussie. Session ouverte.");
    } catch (error) {
      setRegisterError(error.message || "Inscription impossible");
    } finally {
      setIsRegistering(false);
    }
  }

  async function handleLogout() {
    await logout();
    setCurrentUser(null);
  }

  if (isCheckingSession) {
    return (
      <AppShell currentUser={null} isAuthenticated={false} onLogout={handleLogout}>
        <section className="rounded-2xl border border-white/85 bg-white/85 p-5 text-sm text-slate-600 shadow-soft">
          Verification de la session en cours...
        </section>
      </AppShell>
    );
  }

  const isAuthenticated = Boolean(currentUser?.id || currentUser?.accountantId);

  return (
    <AppShell currentUser={currentUser} isAuthenticated={isAuthenticated} onLogout={handleLogout}>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate replace to="/" />
              ) : (
                <LoginPage
                  defaultEmail="demo-accountant@nv-saas.local"
                  isLoggingIn={isLoggingIn}
                  isRegistering={isRegistering}
                  loginError={loginError}
                  registerError={registerError}
                  registerSuccess={registerSuccess}
                  onLogin={handleLogin}
                  onRegister={handleRegister}
                />
              )
            }
          />
          <Route path="/" element={isAuthenticated ? <DashboardPage /> : <Navigate replace to="/login" />} />
          <Route path="/connect" element={isAuthenticated ? <ConnectMandantPage /> : <Navigate replace to="/login" />} />
          <Route path="/alerts" element={isAuthenticated ? <AlertsPage /> : <Navigate replace to="/login" />} />
          <Route path="/analysis" element={isAuthenticated ? <AnalysisPage /> : <Navigate replace to="/login" />} />
          <Route
            path="/connect/success"
            element={isAuthenticated ? <ConnectResultPage mode="success" /> : <Navigate replace to="/login" />}
          />
          <Route
            path="/connect/error"
            element={isAuthenticated ? <ConnectResultPage mode="error" /> : <Navigate replace to="/login" />}
          />
          <Route path="*" element={<Navigate replace to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
    </AppShell>
  );
}
