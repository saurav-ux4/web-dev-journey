import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/Chatbox";
import MessageInput from "../components/MessageInput";
import { SocketContext } from "../context/SocketContext";

/* =============================================
   HOME PAGE
   Main layout: Sidebar (left) + Chat area (right).
   Manages all state: groups, messages, selected group.
   All socket events for real-time chat are wired here.
   ============================================= */

function Home() {
  const { socket, onlineUsers } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  /* ── App state ── */
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [lastMessages, setLastMessages] = useState({});
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  /* ── Load all groups user belongs to on mount ── */
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const res = await API.get("/groups", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setGroups(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    loadGroups();
  }, [user]);

  /* ── When a group is selected: join its socket room + load history ── */
  useEffect(() => {
    if (!selectedGroup) return;
    socket.emit("join_group", selectedGroup._id);

    const loadMessages = async () => {
      try {
        const res = await API.get(`/messages/${selectedGroup._id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setMessages(res.data);
        /* Update last message preview in sidebar */
        if (res.data.length > 0) {
          setLastMessages((prev) => ({
            ...prev,
            [selectedGroup._id]: res.data[res.data.length - 1]
          }));
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadMessages();
  }, [selectedGroup, user, socket]);

  /* ── Listen for incoming messages from socket ── */
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      setLastMessages((prev) => ({
        ...prev,
        [message.group._id]: message
      }));
    };
    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [socket]);

  /* ── Create a new group (called from sidebar + button) ── */
  const createGroup = async () => {
    if (!groupName.trim()) return;
    try {
      const res = await API.post(
        "/groups",
        { name: groupName },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setGroups([...groups, res.data]);
      setGroupName("");
      setShowCreateGroup(false);
    } catch (error) {
      console.log(error);
    }
  };

  /* ── Add a member to the selected group by email ── */
  const addMember = async () => {
    if (!memberEmail.trim()) return;
    try {
      await API.put(
        "/groups/add-member",
        { groupId: selectedGroup._id, email: memberEmail },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Member Added");
      setMemberEmail("");
      setShowAddMember(false);
    } catch (error) {
      alert(error.response?.data?.message || "Error adding member");
    }
  };

  /* ── Send a message via API then broadcast via socket ── */
  const sendMessage = async (content) => {
    try {
      const res = await API.post(
        "/messages",
        { groupId: selectedGroup._id, content },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      socket.emit("send_message", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  /* Count how many group members are currently online */
  const onlineCount = selectedGroup?.members?.filter(
    (m) => onlineUsers.includes(m._id)
  ).length || 0;

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

      {/* ══════════════════════════════════════════
          LEFT: SIDEBAR COLUMN
          Contains group list, search, new group,
          and logout — all inside the dark teal panel.
          ══════════════════════════════════════════ */}
      <div style={{
        width: "var(--sidebar-width)",
        minWidth: "300px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>

        {/* Sidebar takes full height of this column */}
        <Sidebar
          groups={groups}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          lastMessages={lastMessages}
          currentUser={user}
          /* onNewGroup — triggered by the + button inside Sidebar */
          onNewGroup={() => setShowCreateGroup(true)}
        />

        {/* ── CREATE GROUP INPUT ──
            Slides in below sidebar when "+" is clicked.
            Sits at the very bottom of the sidebar column. */}
        {showCreateGroup && (
          <div style={{
            padding: "10px 12px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            background: "var(--sidebar-bg)",
            display: "flex",
            gap: "8px",
          }}>
            <input
              type="text"
              placeholder="Group name…"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createGroup()}
              autoFocus
              style={{
                flex: 1,
                padding: "9px 13px",
                borderRadius: "var(--radius-sm)",
                border: "1.5px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <button
              onClick={createGroup}
              style={{
                padding: "9px 13px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: "rgba(255,255,255,0.25)",
                color: "#fff",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              ✓
            </button>
            <button
              onClick={() => setShowCreateGroup(false)}
              style={{
                padding: "9px 11px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: "transparent",
                color: "rgba(255,255,255,0.6)",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          RIGHT: MAIN CHAT AREA
          Header + message list + input bar.
          White/light background contrasting the sidebar.
          ══════════════════════════════════════════ */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--chat-bg)",
        // padding:"10px"
      }}>

        {selectedGroup ? (
          <>
            {/* ── CHAT HEADER ──
                Shows group name, member count / online count,
                and the "add member" button on the right.
                Matches the reference: name on left, icon on right. */}
            <div style={{
              padding: "12px 20px",
              background: "var(--chat-header-bg)",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>

              {/* Group avatar + name + status */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  /* Group initial avatar — matches sidebar style */
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "var(--sidebar-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "16px",
                  color: "#fff",
                }}>
                  {selectedGroup.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  {/* Group name */}
                  <div style={{
                    fontWeight: "700",
                    fontSize: "15px",
                    letterSpacing: "-0.2px",
                    color: "var(--text-primary)",
                  }}>
                    {selectedGroup.name}
                  </div>
                  {/* Member count + online indicator */}
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {onlineCount > 0
                      ? `Active now · ${selectedGroup.members?.length || 0} members`
                      : `${selectedGroup.members?.length || 0} members`
                    }
                  </div>
                </div>
              </div>

              {/* ── Add member area (right side of header) ── */}
              <div>
                {showAddMember ? (
                  /* Inline email input when adding a member */
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type="email"
                      placeholder="Email address…"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addMember()}
                      autoFocus
                      style={{
                        padding: "7px 12px",
                        borderRadius: "var(--radius-sm)",
                        border: "1.5px solid var(--accent)",
                        background: "var(--bg-input)",
                        color: "var(--text-primary)",
                        fontSize: "13px",
                        outline: "none",
                        width: "200px",
                      }}
                    />
                    <button
                      onClick={addMember}
                      style={{
                        padding: "7px 14px",
                        borderRadius: "var(--radius-sm)",
                        border: "none",
                        background: "var(--accent)",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddMember(false)}
                      style={{
                        padding: "7px 10px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)",
                        background: "transparent",
                        color: "var(--text-secondary)",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  /* Add member icon button — person silhouette with + */
                  <button
                    onClick={() => setShowAddMember(true)}
                    title="Add member"
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
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
                    {/* Person + add icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <line x1="19" y1="8" x2="19" y2="14"/>
                      <line x1="22" y1="11" x2="16" y2="11"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* ── CHAT MESSAGES (Chatbox component) ── */}
            <ChatBox
              messages={messages}
              user={user}
              groupId={selectedGroup._id}
            />

            {/* ── MESSAGE INPUT BAR (MessageInput component) ── */}
            <MessageInput
              sendMessage={sendMessage}
              groupId={selectedGroup._id}
              userName={user.name}
            />
          </>
        ) : (

          /* ── EMPTY STATE ──
             Shown when no group is selected.
             Centered icon + prompt text. */
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--chat-bg)",
            gap: "14px",
          }}>
            <div style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}>
              💬
            </div>
            <div style={{ textAlign: "center" }}>
              <h2 style={{
                fontSize: "20px",
                fontWeight: "700",
                letterSpacing: "-0.4px",
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}>
                GroupChat
              </h2>
              <p style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                maxWidth: "260px",
                lineHeight: "1.5",
              }}>
                Select a group to start chatting, or create a new one with the + button.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;