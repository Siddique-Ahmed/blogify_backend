import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./DB/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js";
import likeRoute from "./routes/like.route.js";

dotenv.config();

const corsoptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowHeaders: ["Content-Type", "multipart/form-data"],
};

const app = express();

app.use(express.json());
app.use(cors(corsoptions));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/comments", commentRoute);
app.use("/api/v1/likes", likeRoute);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Blog App",
    success: true,
    author: "Siddique Ahmed",
  });
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
