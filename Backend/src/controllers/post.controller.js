import Post from "../models/post.model.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";

// Fetch all posts for the global/home feed
export const getFeedPosts = async (req, res) => {
  try {
    const { search } = req.query;
    let queryCondition = {};

    // If a search keyword is provided, scan post text or match user profiles
    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive search match

      // Find user IDs whose full names match the search keyword string
      const matchedUsers = await User.find({ fullName: searchRegex }).select("_id");
      const matchedUserIds = matchedUsers.map((user) => user._id);

      // Match posts containing the text keyword OR created by matched users
      queryCondition = {
        $or: [
          { text: searchRegex },
          { senderId: { $in: matchedUserIds } }
        ],
      };
    }

    // Pull all matching records, attach sender profiles, sort newest first
    const posts = await Post.find(queryCondition)
      .sort({ createdAt: -1 })
      .populate("senderId", "fullName profilePic");

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error inside getFeedPosts controller:", error);
    return res.status(500).json({ message: "Internal server error fetching feed." });
  }
};

// Create a new feed post (handles media files cleanly)
export const createPost = async (req, res) => {
  try {
    const { text, image, video } = req.body;
    const senderId = req.user._id;

    if (!text && !image && !video) {
      return res.status(400).json({ message: "Post content cannot be completely empty" });
    }

    let imageUrl = null;
    let videoUrl = null;

    // Handle Image uploads to Cloudinary safely
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          resource_type: "image",
        });
        imageUrl = uploadResponse.secure_url;
      } catch (err) {
        console.error("Cloudinary image upload failed:", err);
        return res.status(500).json({ message: "Image hosting upload failed" });
      }
    }

    // Handle Video uploads to Cloudinary safely
    if (video) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(video, {
          resource_type: "video",
        });
        videoUrl = uploadResponse.secure_url;
      } catch (err) {
        console.error("Cloudinary video upload failed:", err);
        return res.status(500).json({ message: "Video hosting upload failed" });
      }
    }

    const newPost = new Post({
      senderId,
      text,
      image: imageUrl,
      video: videoUrl,
    });

    await newPost.save();
    
    // Populate sender details before responding to immediately show on the UI
    const populatedPost = await newPost.populate("senderId", "fullName profilePic");

    return res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Error in createPost controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Like or Unlike a post dynamically
export const toggleLikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike: Pull user ID out of the array
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // Like: Push user ID into the array
      post.likes.push(userId);
    }

    await post.save();
    return res.status(200).json({ likes: post.likes });
  } catch (error) {
    console.error("Error in toggleLikePost:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Add a comment to a specific post record
export const commentOnPost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { text } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text cannot be empty." });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    // Construct comment object using active user passport details
    const newComment = {
      userId: req.user._id,
      fullName: req.user.fullName,
      profilePic: req.user.profilePic || "",
      text: text.trim()
    };

    post.comments.push(newComment);
    await post.save();

    // Return the updated comments array straight back to the frontend store
    return res.status(200).json(post.comments);
  } catch (error) {
    console.error("Error inside commentOnPost:", error);
    return res.status(500).json({ message: "Internal server error posting comment." });
  }
};
