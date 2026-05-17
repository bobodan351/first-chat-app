import express from "express";
import protectRoute  from "../middleware/auth.middleware.js"
import { getFeedPosts, createPost, toggleLikePost, commentOnPost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", protectRoute, getFeedPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, toggleLikePost);
router.post("/comment/:id", protectRoute, commentOnPost);


export default router;
