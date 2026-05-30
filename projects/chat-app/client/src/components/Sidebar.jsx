import { useState } from "react";

function Sidebar({ groups, selectedGroup, setSelectedGroup, lastMessages = {}, currentUser }) {
  const [search, setSearch] = useState("");

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      width: "var(--sidebar-width)",
      minWidth: "260px",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-glass)",
      backdropFilter: "var(--blur)",
      WebkitBackdropFilter: "var(--blur)",
      borderRight: "1px solid var(--border)",
      overflow: "hidden"
    }}>

      {/* Header */}
      <div style={{
        padding: "16px 16px 12px",
        borderBottom: "1px solid var(--border)"
      }}>
        <h2 style={{
          fontSize: "20px",
          fontWeight: "700",
          letterSpacing: "-0.4px",
          color: "var(--text-primary)",
          marginBottom: "12px"
        }}>
          Messages
        </h2>

        {/* Search */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--bg-input)",
          borderRadius: "var(--radius-sm)",
          padding: "8px 12px",
          border: "1px solid var(--border)"
        }}>
          <span style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>🔍</span>
          <input
            type="text"
            placeholder="Search groups…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: "14px",
              color: "var(--text-primary)"
            }}
          />
        </div>
      </div>

      {/* Group list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
        {filtered.length === 0 ? (
          <div style={{
            padding: "32px 16px",
            textAlign: "center",
            color: "var(--text-tertiary)",
            fontSize: "13px"
          }}>
            {search ? "No groups found" : "No groups yet"}
          </div>
        ) : (
          filtered.map((group, i) => {
            const isActive = selectedGroup?._id === group._id;
            const lastMsg = lastMessages[group._id];
            let preview = "No messages yet";
            if (lastMsg) {
              const isMe = lastMsg.sender._id === currentUser._id;
              const label = isMe ? "You" : lastMsg.sender.name;
              const text = `${label}: ${lastMsg.content}`;
              preview = text.length > 34 ? text.slice(0, 34) + "…" : text;
            }

            return (
              <div
                key={group._id}
                onClick={() => setSelectedGroup(group)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "11px",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  background: isActive ? "var(--bg-active)" : "transparent",
                  transition: "background 0.15s ease",
                  animation: `fadeUp 0.3s ease ${i * 0.04}s both`
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.background = "var(--bg-hover)";
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "50%",
                  background: isActive
                    ? "var(--accent)"
                    : "linear-gradient(135deg, #c0c0c5 0%, #9b9ba0 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "17px",
                  color: "#fff",
                  flexShrink: 0,
                  transition: "background 0.2s ease",
                  boxShadow: isActive ? "0 4px 12px rgba(0,122,255,0.3)" : "none"
                }}>
                  {group.name.charAt(0).toUpperCase()}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.2px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {group.name}
                  </div>
                  <div style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    marginTop: "2px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {preview}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Sidebar;