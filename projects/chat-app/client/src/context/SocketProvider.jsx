import { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import { SocketContext } from "./SocketContext";

const socket = io("http://localhost:5000");

const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({}); // { groupId: "userName" }

  useEffect(() => {
    if (user) {
      socket.emit("user_online", user._id);
    }
  }, [user]);

  useEffect(() => {
    const handleOnlineUsers = (users) => setOnlineUsers(users);
    socket.on("online_users", handleOnlineUsers);
    return () => socket.off("online_users", handleOnlineUsers);
  }, []);

  useEffect(() => {
    const handleTyping = ({ groupId, userName }) => {
      setTypingUsers((prev) => ({ ...prev, [groupId]: userName }));
    };

    const handleStopTyping = ({ groupId }) => {
      setTypingUsers((prev) => {
        const updated = { ...prev };
        delete updated[groupId];
        return updated;
      });
    };

    socket.on("user_typing", handleTyping);
    socket.on("user_stop_typing", handleStopTyping);

    return () => {
      socket.off("user_typing", handleTyping);
      socket.off("user_stop_typing", handleStopTyping);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, typingUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;