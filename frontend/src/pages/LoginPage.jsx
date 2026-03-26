import { useState } from "react";

function LoginPage({ defaultEmail = "", isLoading = false, error = "", onLogin }) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    await onLogin({ email, password });
  }

  return (
    <section className="mx-auto mt-8 max-w-lg rounded-3xl border border-white/85 bg-white/85 p-6 shadow-floating backdrop-blur sm:p-7">
      <h2 className="font-display text-2xl font-semibold">Connexion cabinet</h2>
      <p className="mt-1 text-sm text-slate-600">Authentification interne requise avant l'acces aux API FPS.</p>

      <form className="mt-5 space-y-3" onSubmit={onSubmit}>
        <label className="block text-sm font-semibold text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="username"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-accent"
          id="email"
          placeholder="demo-accountant@nv-saas.local"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label className="block text-sm font-semibold text-slate-700" htmlFor="password">
          Mot de passe
        </label>
        <input
          autoComplete="current-password"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-accent"
          id="password"
          placeholder="Votre mot de passe"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-danger">{error}</p>}

        <button
          className="w-full rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-70"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </section>
  );
}

export { LoginPage };
