const onlineUsers = new Map();

const socketHandler = (io) => {

    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);

        // ==============================
        // USER ONLINE
        // ==============================

        socket.on("user_online", (userId) => {

            onlineUsers.set(userId, socket.id);

            socket.userId = userId;

            io.emit(
                "online_users",
                Array.from(onlineUsers.keys())
            );

        });

        // ==============================
        // JOIN GROUP
        // ==============================

        socket.on("join_group", (groupId) => {

            

            socket.join(groupId);

            console.log(`Socket joined group: ${groupId}`);

        });

        // ==============================
        // SEND MESSAGE
        // ==============================

           socket.on("send_message", (messageData) => {

        const groupId = messageData.group._id;

              

                io.to(groupId).emit(
                    "receive_message",
                     messageData
                     );

            });
        // ==============================
        // TYPING
        // ==============================

        socket.on("typing", ({ groupId, userName }) => {

            socket.to(groupId).emit(
                "user_typing",
                userName
            );

        });

        // ==============================
        // STOP TYPING
        // ==============================

        socket.on("stop_typing", (groupId) => {

            socket.to(groupId).emit(
                "user_stop_typing"
            );

        });

        // ==============================
        // DISCONNECT
        // ==============================

        socket.on("disconnect", () => {

            console.log("User disconnected:", socket.id);

            if (socket.userId) {

                onlineUsers.delete(socket.userId);

                io.emit(
                    "online_users",
                    Array.from(onlineUsers.keys())
                );

            }

        });

    });

};

export default socketHandler;