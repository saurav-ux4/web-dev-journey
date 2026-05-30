import { useState, useRef, useContext } from "react";
import { SocketContext } from "../context/SocketContext";

function MessageInput({ sendMessage, groupId, userName }) {
  const { socket } = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { groupId, userName });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", groupId);
    }, 1000);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
    socket.emit("stop_typing", groupId);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasText = message.trim().length > 0;

  return (
    <div style={{
      padding: "10px 16px 14px",
      background: "var(--bg-glass)",
      backdropFilter: "var(--blur)",
      WebkitBackdropFilter: "var(--blur)",
      borderTop: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }}>
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        background: "var(--bg-input)",
        borderRadius: "var(--radius-full)",
        border: "1.5px solid var(--border)",
        padding: "0 16px",
        transition: "border-color 0.2s ease"
      }}
        onFocusCapture={e => e.currentTarget.style.borderColor = "var(--accent)"}
        onBlurCapture={e => e.currentTarget.style.borderColor = "var(--border)"}
      >
        <input
          type="text"
          placeholder="Message…"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            padding: "11px 0",
            border: "none",
            background: "transparent",
            fontSize: "15px",
            color: "var(--text-primary)",
            outline: "none"
          }}
        />
      </div>

      <button
        onClick={handleSend}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "none",
          background: hasText ? "var(--accent)" : "var(--bg-input)",
          color: hasText ? "#fff" : "var(--text-tertiary)",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: hasText ? "pointer" : "default",
          transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
          transform: hasText ? "scale(1)" : "scale(0.9)",
          boxShadow: hasText ? "0 4px 12px rgba(0,122,255,0.35)" : "none",
          flexShrink: 0
        }}
      >
        ↑
      </button>
    </div>
  );
}

export default MessageInput;