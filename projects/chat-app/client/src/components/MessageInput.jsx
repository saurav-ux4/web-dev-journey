import { useState } from "react";

function MessageInput({ sendMessage }) {

  const [message, setMessage] = useState("");

  const handleSend = () => {

    if (!message.trim()) return;

    sendMessage(message);

    setMessage("");

  };

  return (

    <div>

      <input
        type="text"
        placeholder="Type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={handleSend}>
        Send
      </button>

    </div>
  );
}

export default MessageInput;