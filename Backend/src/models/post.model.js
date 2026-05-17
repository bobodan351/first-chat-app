import mongoose from "mongoose";

// Inside src/models/post.model.js
const postSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String },
    image: { type: String },
    video: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // NEW: Structured Comments array nested directly inside the post
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        fullName: { type: String, required: true },
        profilePic: { type: String },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

// FIX: Avoid re-compilation conflicts during hot reloads
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post; // FIX: Export the Model, not the Schema!
