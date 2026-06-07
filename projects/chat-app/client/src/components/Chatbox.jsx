import { useContext, useEffect, useRef } from "react";
import { SocketContext } from "../context/SocketContext";

/* =============================================
   CHATBOX COMPONENT
   Renders the scrollable list of messages.
   - My messages appear on the right (dark bubble)
   - Others' messages appear on the left (light bubble)
   - Shows sender name above first consecutive message from same person
   - Shows date separator when date changes between messages
   - Shows typing indicator at the bottom when someone is typing
   ============================================= */

/* ── Helper: format a date into "Nov 30, 2023, 9:41 AM" style ──
   Used for the date separator line between message groups */
function formatDateSeparator(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── Helper: get just the calendar date string for comparison ──
   Used to detect when a new day starts so we can insert a separator */
function getDateKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function ChatBox({ messages, user }) {
  /* typingUser comes from SocketContext — set when someone emits "typing" */
  const { typingUsers } = useContext(SocketContext);
  const bottomRef = useRef(null);

  /* Get typing user for current group — passed via groupId if available */
  /* We use the first available typing user as a fallback */
  const typingUser = typingUsers
    ? Object.values(typingUsers)[0]
    : null;

  /* Auto-scroll to the latest message whenever messages update */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{
      /* ── Main scrollable chat area ── */
      flex: 1,
      overflowY: "auto",
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: "2px",
      background: "var(--chat-bg)",
    }}>

      {messages.map((msg, index) => {
        const isMyMessage = msg.sender._id === user._id;
        const prevMsg = messages[index - 1];

        /* ── Date separator logic ──
           Show "Nov 30, 2023, 9:41 AM" line when the date changes */
        const showDateSep = !prevMsg ||
          getDateKey(msg.createdAt) !== getDateKey(prevMsg.createdAt);

        /* ── Sender name logic ──
           Only show name for received messages, and only when
           the previous message was from someone different */
        const showSenderName =
          !isMyMessage &&
          (!prevMsg || prevMsg.sender._id !== msg.sender._id);

        return (
          <div key={msg._id}>

            {/* ── Date separator line (e.g. "Nov 30, 2023, 9:41 AM") ── */}
            {showDateSep && (
              <div style={{
                textAlign: "center",
                margin: "18px 0 10px",
                fontSize: "11px",
                color: "var(--date-sep-color)",
                fontWeight: "500",
                letterSpacing: "0.3px",
              }}>
                {formatDateSeparator(msg.createdAt)}
              </div>
            )}

            {/* ── Message row — aligns left or right based on sender ── */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMyMessage ? "flex-end" : "flex-start",
              marginTop: showSenderName ? "10px" : "2px",
            }}>

              {/* ── Sender name label (only for received messages) ── */}
              {showSenderName && (
                <span style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#888",
                  marginBottom: "4px",
                  marginLeft: "4px",
                  letterSpacing: "0.2px",
                }}>
                  {msg.sender.name}
                </span>
              )}

              {/* ── Message bubble ──
                  Sent = dark, right-aligned, right-bottom corner sharp
                  Received = light grey, left-aligned, left-bottom corner sharp */}
              <div style={{
                maxWidth: "62%",
                padding: "10px 16px",
                borderRadius: isMyMessage
                  ? "20px 20px 4px 20px"    /* sent bubble shape */
                  : "20px 20px 20px 4px",   /* received bubble shape */
                background: isMyMessage
                  ? "var(--bubble-sent-bg)"
                  : "var(--bubble-received-bg)",
                color: isMyMessage
                  ? "var(--bubble-sent-text)"
                  : "var(--bubble-received-text)",
                fontSize: "14px",
                lineHeight: "1.5",
                wordBreak: "break-word",
              }}>
                {msg.content}
              </div>

            </div>
          </div>
        );
      })}

      {/* ── Typing indicator ── 
          Shows "X is typing" with three bouncing dots when active */}
      {typingUser && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "10px",
          marginLeft: "4px",
        }}>
          {/* Three bouncing dots */}
          <div style={{
            background: "var(--bubble-received-bg)",
            borderRadius: "20px 20px 20px 4px",
            padding: "10px 14px",
            display: "flex",
            gap: "4px",
            alignItems: "center",
          }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: "#aaa",
                  display: "inline-block",
                  animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: "12px", color: "#999", fontStyle: "italic" }}>
            {typingUser} is typing
          </span>
        </div>
      )}

      {/* Invisible div at the bottom — scrollIntoView targets this */}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatBox;