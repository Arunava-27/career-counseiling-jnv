import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../shared/api";

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.login(username.trim(), password);
      navigate("/console");
    } catch {
      setError("Incorrect username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "var(--radius)",
              background: "var(--accent-bg)",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              margin: "0 auto 1rem",
            }}
          >
            🎯
          </div>
          <h1 style={{ fontSize: "1.4rem" }}>Instructor Login</h1>
          <p className="muted" style={{ marginTop: "0.2rem" }}>
            Career Counselling Console
          </p>
        </div>
        <form onSubmit={handleSubmit} className="stack">
          <div>
            <label className="field-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              placeholder="e.g. arunava"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" disabled={loading} style={{ width: "100%", marginTop: "0.3rem" }}>
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
