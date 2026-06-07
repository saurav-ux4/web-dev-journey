import { useState, useRef, useContext } from "react";
import { SocketContext } from "../context/SocketContext";

/* =============================================
   MESSAGE INPUT COMPONENT
   The bottom bar where users type and send messages.
   - Pill-shaped text input with placeholder "Enter your message"
   - Round send button (dark circle with arrow) on the right
   - Emits typing/stop_typing socket events while user types
   - Sends on Enter key or button click
   ============================================= */

function MessageInput({ sendMessage, groupId, userName }) {
  const { socket } = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef(null);

  /* ── Handle text change ──
     Emit typing event and reset stop_typing timeout on every keystroke */
  const handleChange = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { groupId, userName });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", groupId);
    }, 1000);
  };

  /* ── Handle send ──
     Trim whitespace, call parent sendMessage, clear input */
  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
    socket.emit("stop_typing", groupId);
  };

  /* Allow sending with Enter key (Shift+Enter for newline if needed later) */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasText = message.trim().length > 0;

  return (
    /* ── Outer wrapper — white bar sitting above screen bottom ── */
    <div style={{
      padding: "12px 16px 16px",
      background: "var(--chat-input-bg)",
      borderTop: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}>

      {/* ── Pill-shaped input container ── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        background: "var(--input-bg)",
        borderRadius: "var(--radius-full)",
        border: "1px solid var(--input-border)",
        padding: "0 18px",
        transition: "border-color 0.2s",
      }}
        onFocusCapture={e => e.currentTarget.style.borderColor = "#bbb"}
        onBlurCapture={e => e.currentTarget.style.borderColor = "var(--input-border)"}
      >
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            padding: "12px 0",
            border: "none",
            background: "transparent",
            fontSize: "14px",
            color: "var(--input-text)",
            outline: "none",
          }}
        />
      </div>

      {/* ── Send button — circular dark button with up-arrow icon ──
          Becomes active (slightly scaled up) when there's text */}
      <button
        onClick={handleSend}
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          border: "none",
          background: hasText ? "var(--send-btn-bg)" : "#d0d0d0",
          color: "var(--send-btn-text)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: hasText ? "pointer" : "default",
          transition: "all 0.2s ease",
          flexShrink: 0,
          transform: hasText ? "scale(1)" : "scale(0.92)",
        }}
      >
        {/* Up-arrow SVG icon — matches the screenshot's send icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"/>
          <polyline points="5 12 12 5 19 12"/>
        </svg>
      </button>
    </div>
  );
}

export default MessageInput;