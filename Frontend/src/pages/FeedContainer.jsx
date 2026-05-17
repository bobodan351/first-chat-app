import React, { useEffect, useState } from "react";
import { usePostStore } from "../store/usePostStore";
import FeedsPage from "./FeedsPage"; 
import { Search } from "lucide-react";


const FeedContainer = ({ currentUserId }) => {
  const { posts, getFeedPosts, isFeedLoading } = usePostStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Initial load event
  useEffect(() => {
    getFeedPosts();
  }, [getFeedPosts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    getFeedPosts(searchTerm); // Pass text directly into store query pipeline
  };

  return (
    <div className="relative w-full h-screen bg-black">
      
      {/* FLOATING SEARCH CONTAINER BAR */}
      <form 
        onSubmit={handleSearchSubmit}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-zinc-800"
      >
        <input
          type="text"
          placeholder="Search post text or creators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent border-none text-white placeholder-zinc-400 text-sm focus:outline-none p-2"
        />
        <button type="submit" className="btn btn-circle btn-ghost btn-sm text-white hover:bg-zinc-800/50">
          <Search size={18} />
        </button>
      </form>

      {/* FEED COMPONENT VIEWPORT RENDERING */}
      {isFeedLoading ? (
        <div className="w-full h-full flex items-center justify-center bg-zinc-950">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
          <FeedsPage posts={posts} currentUserId={currentUserId} />
          
      )}
    </div>
  );
};

export default FeedContainer;
