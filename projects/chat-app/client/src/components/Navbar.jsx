
/* =============================================
   NAVBAR COMPONENT
   Top bar of the app — shows app name on the left
   and a dark/light mode toggle switch on the right.
   
   Props:
   - darkMode: boolean — current theme state
   - setDarkMode: function — toggles the theme
   ============================================= */

function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav style={{
      /* ── Fixed top bar spanning full width ── */
      height: "var(--navbar-height)",
      background: darkMode ? "#111111" : "#1a1a1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      flexShrink: 0,
      zIndex: 100,
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>

      {/* ── App name on the left ── */}
      <span style={{
        fontWeight: "700",
        fontSize: "16px",
        color: "#ffffff",
        letterSpacing: "-0.3px",
      }}>
        Chat App <h5>made with ❤️ by saurav</h5>
      </span>

      {/* ── Theme toggle on the right ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>

        {/* Sun icon — shown when in dark mode (click to go light) */}
        <span style={{
          fontSize: "13px",
          opacity: darkMode ? 0.5 : 1,
          transition: "opacity 0.2s",
        }}>
          
        </span>

        {/* ── iOS-style toggle switch ──
            Clicking anywhere on the track toggles the theme.
            The knob slides left (light) or right (dark). */}
        <div
          onClick={() => setDarkMode(!darkMode)}
          style={{
            position: "relative",
            width: "44px",
            height: "26px",
            borderRadius: "13px",
            /* Track color: blue when dark mode ON, grey when light mode */
            background: darkMode ? "#0a84ff" : "rgba(255,255,255,0.25)",
            cursor: "pointer",
            transition: "background 0.25s ease",
            flexShrink: 0,
          }}
        >
          {/* ── Knob ── slides right when darkMode is true */}
          <div style={{
            position: "absolute",
            top: "3px",
            left: darkMode ? "21px" : "3px",   /* slides between 3px and 21px */
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#ffffff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            transition: "left 0.22s cubic-bezier(0.34, 1.4, 0.64, 1)",  /* springy slide */
          }} />
        </div>

        {/* Moon icon — shown when in light mode (click to go dark) */}
        <span style={{
          fontSize: "13px",
          opacity: darkMode ? 1 : 0.5,
          transition: "opacity 0.2s",
        }}>
          
        </span>
      </div>
    </nav>
  );
}

export default Navbar;