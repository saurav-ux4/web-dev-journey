import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar({ darkMode, setDarkMode }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav style={{
      height: "var(--navbar-height)",
      background: "var(--bg-glass)",
      backdropFilter: "var(--blur)",
      WebkitBackdropFilter: "var(--blur)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      flexShrink: 0,
      position: "relative",
      zIndex: 100,
    }}>

      {/* Logo */}
      <Link to="/" style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        textDecoration: "none",
        color: "var(--text-primary)"
      }}>
        <div style={{
          width: "28px",
          height: "28px",
          borderRadius: "8px",
          background: "var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px"
        }}>
          💬
        </div>
        <span style={{
          fontWeight: "700",
          fontSize: "16px",
          letterSpacing: "-0.4px",
          color: "var(--text-primary)"
        }}>
          GroupChat
        </span>
      </Link>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Light mode" : "Dark mode"}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1px solid var(--border)",
            background: "var(--bg-input)",
            color: "var(--text-secondary)",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease"
          }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* User pill */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "5px 14px 5px 6px",
          borderRadius: "var(--radius-full)",
          background: "var(--bg-input)",
          border: "1px solid var(--border)"
        }}>
          <div style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: "700",
            color: "#fff"
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span style={{
            fontSize: "13px",
            fontWeight: "500",
            color: "var(--text-primary)"
          }}>
            {user.name}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            padding: "7px 14px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-secondary)",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "var(--bg-hover)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;