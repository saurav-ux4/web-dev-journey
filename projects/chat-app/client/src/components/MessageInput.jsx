import { useState, useRef, useContext } from "react";

import { SocketContext } from "../context/SocketContext";

function MessageInput({
  sendMessage,
  groupId,
  userName
}) {

  const { socket } = useContext(SocketContext);

  const [message, setMessage] = useState("");

  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {

    const value = e.target.value;

    setMessage(value);

    console.log("TYPING EMITTED");

    socket.emit(
      "typing",
      {
        groupId,
        userName
      }
    );

    clearTimeout(
      typingTimeoutRef.current
    );

    typingTimeoutRef.current = setTimeout(() => {

      socket.emit(
        "stop_typing",
        groupId
      );

    }, 1000);

  };

  const handleSend = () => {

    if (!message.trim()) return;

    sendMessage(message);

    setMessage("");

    socket.emit(
      "stop_typing",
      groupId
    );

  };

  const handleKeyDown = (e) => {

  if (e.key === "Enter") {

    handleSend();

  }

};

  return (

    <div>

      <input
        type="text"
        placeholder="Type message..."
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      <button onClick={handleSend}>
        Send
      </button>

    </div>

  );
}

export default MessageInput;