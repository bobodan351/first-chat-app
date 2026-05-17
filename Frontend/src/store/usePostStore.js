import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const usePostStore = create((set, get) => ({
  posts: [],
  isFeedLoading: false,

  // Fetches items. Pass an optional string argument to execute server filtering
  getFeedPosts: async (searchQuery = "") => {
    set({ isFeedLoading: true });
    try {
      // Constructs URL query string conditionally: /api/posts?search=keyword
      const url = searchQuery ? `/posts?search=${encodeURIComponent(searchQuery)}` : "/posts";
      const res = await axiosInstance.get(url);
      set({ posts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to parse feed updates.");
    } finally {
      set({ isFeedLoading: false });
    }
  },

  // Dispatches likes and merges state instantly
  toggleLikePost: async (postId) => {
    const { posts } = get();
    try {
      const res = await axiosInstance.post(`/posts/like/${postId}`);
      
      // Map across active array memory and change target likes array with server response
      const updatedPosts = posts.map((post) =>
        post._id === postId ? { ...post, likes: res.data.likes } : post
      );
      set({ posts: updatedPosts });
    } catch (error) {
      toast.error("Could not complete like action.");
    }
	},
  // Add this action inside your usePostStore.js configuration block:
createPost: async (postData) => {
  const { posts } = get();
  try {
    // postData contains { text, image: "base64...", video: "base64..." }
    const res = await axiosInstance.post("/posts/create", postData);
    
    // Add the new post straight to the top of your local array
    set({ posts: [res.data, ...posts] });
    toast.success("Post published successfully!");
    return true; // Used to let the component know it can close or clear
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to publish post");
    return false;
  }
},
addComment: async (postId, text) => {
  const { posts } = get();
  try {
    const res = await axiosInstance.post(`/posts/comment/${postId}`, { text });
    
    // Instantly map updated array properties inside global cache
    const updatedPosts = posts.map((post) =>
      post._id === postId ? { ...post, comments: res.data } : post
    );
    set({ posts: updatedPosts });
  } catch (error) {
    toast.error("Failed to add comment.");
  }
	},

}));
