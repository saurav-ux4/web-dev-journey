import { useEffect, useState,useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

import { SocketContext } from "./SocketContext";

const socket = io("http://localhost:5000");

const SocketProvider = ({ children}) => {
  const { user } = useContext(AuthContext);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  useEffect(() => {
    if (user) {
      socket.emit("user_online", user._id);
    }
  }, [user]);

  useEffect(() => {
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online_users");
    };
  }, []);

  useEffect(() => {
    socket.on("user_typing", (userName) => {
      setTypingUser(userName);
    });

    socket.on("user_stop_typing", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        typingUser,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;