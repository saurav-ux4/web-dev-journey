import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/* =============================================
   SIDEBAR COMPONENT
   Left panel showing all groups the user belongs to.
   Also contains search, "new group" button at bottom,
   and a logout button. Dark teal color scheme.
   ============================================= */

function Sidebar({ groups, selectedGroup, setSelectedGroup, lastMessages = {}, currentUser, onNewGroup }) {
  const [search, setSearch] = useState("");
  const { logout } = useContext(AuthContext);

  /* Filter groups by name as user types in search */
  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      /* ── Sidebar container — fixed dark teal column ── */
      width: "var(--sidebar-width)",
      minWidth: "260px",
      display: "flex",
      flexDirection: "column",
      background: "var(--sidebar-bg)",
      overflow: "hidden",
      height: "100%",
    }}>

      {/* ── TOP SECTION: Search bar ── */}
      <div style={{
        padding: "16px 16px 12px",
        borderBottom: "1px solid var(--sidebar-border)"
      }}>
        {/* Search input — filters group list in real time */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--sidebar-search-bg)",
          borderRadius: "var(--radius-full)",
          padding: "9px 14px",
        }}>
          {/* Search icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search chats"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: "14px",
              color: "var(--sidebar-text-primary)",
              /* Placeholder color handled via CSS below */
            }}
          />
        </div>
      </div>

      {/* ── MIDDLE SECTION: Scrollable group list ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
        {filtered.length === 0 ? (
          /* Empty state shown when no groups or search has no results */
          <div style={{
            padding: "32px 16px",
            textAlign: "center",
            color: "var(--sidebar-text-secondary)",
            fontSize: "13px"
          }}>
            {search ? "No groups found" : "No groups yet"}
          </div>
        ) : (
          filtered.map((group, i) => {
            const isActive = selectedGroup?._id === group._id;

            /* Build the last message preview text shown under group name */
            const lastMsg = lastMessages[group._id];
            let preview = "No messages yet";
            if (lastMsg) {
              const isMe = lastMsg.sender._id === currentUser._id;
              const label = isMe ? "You" : lastMsg.sender.name;
              const text = `${label}: ${lastMsg.content}`;
              preview = text.length > 32 ? text.slice(0, 32) + "…" : text;
            }

            return (
              /* ── Individual group row ── */
              <div
                key={group._id}
                onClick={() => setSelectedGroup(group)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 16px",
                  cursor: "pointer",
                  background: isActive
                    ? "var(--sidebar-active)"
                    : "transparent",
                  transition: "background 0.15s ease",
                  animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
                  /* Border on active row left edge for a "selected" feel */
                  borderLeft: isActive
                    ? "3px solid rgba(255,255,255,0.7)"
                    : "3px solid transparent",
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.background = "var(--sidebar-hover)";
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                {/* ── Avatar circle — shows first letter of group name ── */}
                <div style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "50%",
                  /* Slightly lighter teal for avatar so it pops against sidebar */
                  background: isActive
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "17px",
                  color: "#fff",
                  flexShrink: 0,
                  letterSpacing: "-0.5px",
                }}>
                  {group.name.charAt(0).toUpperCase()}
                </div>

                {/* ── Group name + last message preview ── */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "var(--sidebar-text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: "2px",
                  }}>
                    {group.name}
                  </div>
                  <div style={{
                    fontSize: "12px",
                    color: "var(--sidebar-text-secondary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {preview}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── BOTTOM SECTION: Action icons (new group + logout) ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderTop: "1px solid var(--sidebar-border)",
      }}>
        {/* New group button — triggers the create group input in Home.jsx */}
        <button
          onClick={onNewGroup}
          title="New group"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.2s",
            lineHeight: 1,
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
        >
          +
        </button>

        {/* Logout button — calls logout from AuthContext */}
        <button
          onClick={logout}
          title="Logout"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
        >
          {/* Exit arrow icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>

      {/* ── INLINE STYLE: placeholder color for search input ──
          Can't do ::placeholder in inline JS, so we inject it here */}
      <style>{`
        input::placeholder { color: rgba(255,255,255,0.35); }
      `}</style>
    </div>
  );
}

export default Sidebar;