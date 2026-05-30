import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import MessageInput from "../components/MessageInput";
import { SocketContext } from "../context/SocketContext";

function Home() {
  const { socket, onlineUsers } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [lastMessages, setLastMessages] = useState({});
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  // LOAD GROUPS
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

  // JOIN GROUP + LOAD MESSAGES
  useEffect(() => {
    if (!selectedGroup) return;
    socket.emit("join_group", selectedGroup._id);

    const loadMessages = async () => {
      try {
        const res = await API.get(`/messages/${selectedGroup._id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setMessages(res.data);
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

  // RECEIVE MESSAGE
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

  // CREATE GROUP
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

  // ADD MEMBER
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

  // SEND MESSAGE
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

  const onlineCount = selectedGroup?.members?.filter(
    (m) => onlineUsers.includes(m._id)
  ).length || 0;

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

      {/* ── SIDEBAR COLUMN ── */}
      <div style={{
        width: "var(--sidebar-width)",
        minWidth: "260px",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid var(--border)"
      }}>

        {/* Group list */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <Sidebar
            groups={groups}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            lastMessages={lastMessages}
            currentUser={user}
          />
        </div>

        {/* CREATE GROUP BUTTON */}
        <div style={{
          padding: "10px 12px",
          borderTop: "1px solid var(--border)",
          background: "var(--bg-glass)",
          backdropFilter: "var(--blur)",
          WebkitBackdropFilter: "var(--blur)"
        }}>
          {showCreateGroup ? (
            <div style={{ display: "flex", gap: "8px" }}>
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
                  border: "1.5px solid var(--accent)",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  outline: "none"
                }}
              />
              <button
                onClick={createGroup}
                style={{
                  padding: "9px 13px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background: "var(--accent)",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                ✓
              </button>
              <button
                onClick={() => setShowCreateGroup(false)}
                style={{
                  padding: "9px 13px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-secondary)",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateGroup(true)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "var(--radius-sm)",
                border: "1.5px dashed var(--border)",
                background: "transparent",
                color: "var(--text-secondary)",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              + New Group
            </button>
          )}
        </div>
      </div>

      {/* ── MAIN CHAT AREA ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {selectedGroup ? (
          <>
            {/* CHAT HEADER */}
            <div style={{
              padding: "12px 20px",
              background: "var(--bg-glass)",
              backdropFilter: "var(--blur)",
              WebkitBackdropFilter: "var(--blur)",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "16px",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(0,122,255,0.3)"
                }}>
                  {selectedGroup.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{
                    fontWeight: "700",
                    fontSize: "15px",
                    letterSpacing: "-0.2px",
                    color: "var(--text-primary)"
                  }}>
                    {selectedGroup.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {selectedGroup.members?.length || 0} members
                    {onlineCount > 0 && (
                      <span style={{ color: "var(--accent)", marginLeft: "6px" }}>
                        · {onlineCount} online
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ADD MEMBER */}
              <div>
                {showAddMember ? (
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
                        width: "220px"
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
                        cursor: "pointer"
                      }}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddMember(false)}
                      style={{
                        padding: "7px 12px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)",
                        background: "transparent",
                        color: "var(--text-secondary)",
                        fontSize: "13px",
                        cursor: "pointer"
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddMember(true)}
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
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    + Add Member
                  </button>
                )}
              </div>
            </div>

            {/* CHATBOX */}
            <ChatBox
              messages={messages}
              user={user}
              groupId={selectedGroup._id}
            />

            {/* MESSAGE INPUT */}
            <MessageInput
              sendMessage={sendMessage}
              groupId={selectedGroup._id}
              userName={user.name}
            />
          </>
        ) : (

          /* EMPTY STATE */
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-primary)",
            gap: "14px"
          }}>
            <div style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "var(--accent-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px"
            }}>
              💬
            </div>
            <div style={{ textAlign: "center" }}>
              <h2 style={{
                fontSize: "20px",
                fontWeight: "700",
                letterSpacing: "-0.4px",
                color: "var(--text-primary)",
                marginBottom: "6px"
              }}>
                GroupChat
              </h2>
              <p style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                maxWidth: "260px",
                lineHeight: "1.5"
              }}>
                Select a group to start chatting, or create a new one from the sidebar.
              </p>
            </div>
          </div>

        )}
      </div>
    </div>
  );
}

export default Home;