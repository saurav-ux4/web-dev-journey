import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";


dotenv.config();

connectDB();

const app = express();

//middleware

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);


app.get("/", (req, res) => {
  res.send("API running..." + "<h6>hello</h6>");
 
});


app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});