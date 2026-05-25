const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
dotenv.config();

connectDB();

const app = express();

const PORT =process.env.PORT|| 5000;


// Middleware
app.use(express.json());
app.use(cors({
     origin:["https://todo-jjmroiljx-saurav982216-6629s-projects.vercel.app",
            "https://todo-saurav982216-6629s-projects.vercel.app"]
}
));




//routes
const todoRoutes = require("./routes/todoRoutes");

app.use("/todos", todoRoutes);


// Home route
app.get("/", (req, res) => {
  res.send("API is running");
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});