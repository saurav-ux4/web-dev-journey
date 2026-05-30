import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setUser(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: "var(--radius-sm)",
    border: "1.5px solid var(--border)",
    background: "var(--bg-input)",
    color: "var(--text-primary)",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s ease, background 0.2s ease",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-primary)",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "380px",
        animation: "scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"
      }}>

        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "18px",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            margin: "0 auto 16px",
            boxShadow: "0 8px 24px rgba(0,122,255,0.35)"
          }}>
            💬
          </div>
          <h1 style={{
            fontSize: "26px",
            fontWeight: "700",
            letterSpacing: "-0.6px",
            color: "var(--text-primary)"
          }}>
            Sign in
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "6px" }}>
            to GroupChat
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--bg-glass-heavy)",
          backdropFilter: "var(--blur)",
          WebkitBackdropFilter: "var(--blur)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border)",
          padding: "28px 28px 24px",
          boxShadow: "var(--shadow-lg)"
        }}>

          {error && (
            <div style={{
              background: "rgba(255,59,48,0.1)",
              border: "1px solid rgba(255,59,48,0.2)",
              color: "#ff3b30",
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              fontSize: "13px",
              marginBottom: "16px",
              fontWeight: "500"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", letterSpacing: "0.4px", textTransform: "uppercase" }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={e => {
                  e.target.style.borderColor = "var(--accent)";
                  e.target.style.background = "var(--bg-secondary)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.background = "var(--bg-input)";
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", letterSpacing: "0.4px", textTransform: "uppercase" }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={e => {
                  e.target.style.borderColor = "var(--accent)";
                  e.target.style.background = "var(--bg-secondary)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.background = "var(--bg-input)";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "6px",
                padding: "13px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: loading ? "var(--text-tertiary)" : "var(--accent)",
                color: "#fff",
                fontWeight: "600",
                fontSize: "15px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                boxShadow: loading ? "none" : "0 4px 14px rgba(0,122,255,0.35)"
              }}
            >
              {loading ? "Signing in…" : "Continue"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-secondary)", marginTop: "20px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--accent)", fontWeight: "600", textDecoration: "none" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;