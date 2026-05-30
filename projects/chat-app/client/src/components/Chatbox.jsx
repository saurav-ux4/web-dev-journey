import { useContext, useEffect, useRef } from "react";
import { SocketContext } from "../context/SocketContext";

function ChatBox({ messages, user, groupId }) {
  const { typingUsers } = useContext(SocketContext);
  const bottomRef = useRef(null);
  const typingUser = typingUsers?.[groupId] || null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  // Group consecutive messages from same sender
  const grouped = [];
  messages.forEach((msg) => {
    const last = grouped[grouped.length - 1];
    if (last && last.senderId === msg.sender._id) {
      last.messages.push(msg);
    } else {
      grouped.push({
        senderId: msg.sender._id,
        senderName: msg.sender.name,
        isMe: msg.sender._id === user._id,
        messages: [msg]
      });
    }
  });

  return (
    <div style={{
      flex: 1,
      overflowY: "auto",
      padding: "20px 20px 8px",
      display: "flex",
      flexDirection: "column",
      gap: "2px",
      background: "var(--bg-primary)"
    }}>

      {grouped.map((group, gi) => (
        <div
          key={gi}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: group.isMe ? "flex-end" : "flex-start",
            marginBottom: "10px",
            animation: "fadeUp 0.25s ease"
          }}
        >
          {/* Sender name */}
          {!group.isMe && (
            <span style={{
              fontSize: "11px",
              fontWeight: "600",
              color: "var(--text-secondary)",
              marginLeft: "14px",
              marginBottom: "3px",
              letterSpacing: "0.1px"
            }}>
              {group.senderName}
            </span>
          )}

          {group.messages.map((msg, mi) => {
            const isFirst = mi === 0;
            const isLast = mi === group.messages.length - 1;
            const isOnly = group.messages.length === 1;

            const radius = group.isMe
              ? `${isFirst || isOnly ? "18px" : "5px"} 18px 18px ${isLast || isOnly ? "18px" : "5px"}`
              : `18px ${isFirst || isOnly ? "18px" : "5px"} ${isLast || isOnly ? "18px" : "5px"} 18px`;

            return (
              <div
                key={msg._id}
                style={{
                  maxWidth: "68%",
                  padding: "9px 14px",
                  marginBottom: "2px",
                  borderRadius: radius,
                  background: group.isMe ? "var(--bubble-me)" : "var(--bubble-other)",
                  color: group.isMe ? "var(--bubble-me-text)" : "var(--bubble-other-text)",
                  fontSize: "14.5px",
                  lineHeight: "1.45",
                  wordBreak: "break-word",
                  boxShadow: "var(--shadow-sm)",
                  transition: "transform 0.1s ease"
                }}
              >
                <span>{msg.content}</span>
                {isLast && (
                  <div style={{
                    fontSize: "10px",
                    opacity: 0.65,
                    marginTop: "3px",
                    textAlign: "right"
                  }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Typing indicator */}
      {typingUser && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "8px",
          animation: "fadeIn 0.2s ease"
        }}>
          <div style={{
            background: "var(--bubble-other)",
            borderRadius: "18px 18px 18px 5px",
            padding: "10px 16px",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)", marginRight: "4px" }}>
              {typingUser}
            </span>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "var(--text-tertiary)",
                display: "inline-block",
                animation: "typingBounce 1.2s infinite",
                animationDelay: `${i * 0.18}s`
              }} />
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatBox;