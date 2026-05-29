import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";


dotenv.config();

connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {

  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }

});

//middleware

app.use(cors({
    origin: "http://localhost:5173"
})

);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running..." + "<h6>hello</h6>");
 
});

app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);


// SOCKET.IO
io.on("connection", (socket) => {

  console.log("User Connected:", socket.id);


   // JOIN GROUP ROOM
  socket.on("joinGroup", (groupId) => {

    socket.join(groupId);

    console.log(`Joined Group: ${groupId}`);

  });


  // SEND MESSAGE
  socket.on("sendMessage", (message) => {

    io.to(message.group._id).emit(
      "receiveMessage",
      message
    );

  });

  socket.on("disconnect", () => {

    console.log("User Disconnected");

  });

});



const PORT = process.env.PORT || 5000;



server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});