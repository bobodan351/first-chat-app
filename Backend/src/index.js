import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import postRoutes from "./routes/post.route.js";

// IMPORT THE SERVER INFRASTRUCTURE
import { app, server } from "./lib/socket.js"; 

dotenv.config();

// Note: REMOVE your old "const app = express();" line if it's still here!

app.use(cookieParser());
app.use(cors({ origin: "https://first-chat-app-limm.vercel.app", credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/posts", postRoutes);

const port = process.env.PORT || 5001;

// IMPORTANT: Change app.listen to server.listen
server.listen(port, () => {
  console.log("The real-time server is running on port:", port);
  connectDB();
});
