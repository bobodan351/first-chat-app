import React, { useState } from "react";
import { Heart, MessageCircle, Share2, Music, User, Send } from "lucide-react";
import CreatePostModal from "../components/CreatePostModal";
import { usePostStore } from "../store/usePostStore"; // IMPORT YOUR ZUSTAND STORE
import toast from "react-hot-toast";

const FeedsPage = ({ posts = [], currentUserId }) => {
  if (!posts.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black text-white relative h-screen w-full">
        <p className="text-zinc-400 text-lg">No content available in your feed yet...</p>
        <CreatePostModal />
      </div>
    );
  }

  return (
    <>
      {/* CONTAINER: TikTok full-screen viewport boundary with vertical snap alignment rules */}
      <div className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar">
        {posts.map((post) => (
          <PostItem key={post._id} post={post} currentUserId={currentUserId} />
        ))}
      </div>

      <CreatePostModal />
    </>
  );
};

/* INTERNAL COMPONENT: Individual full-screen snap card */

const PostItem = ({ post, currentUserId }) => {
  const { toggleLikePost, addComment } = usePostStore();
  
  const [liked, setLiked] = useState(post.likes?.includes(currentUserId));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [commentText, setCommentText] = useState("");

  const handleLikeToggle = async () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    try { await toggleLikePost(post._id); } catch {
      setLiked(liked); setLikeCount(post.likes?.length || 0);
    }
  };

  // Submit typed text to database via backend controller
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await addComment(post._id, commentText);
    setCommentText("");
  };

  // NATIVE TIKTOK SHARE SYSTEM: Copies link or fires browser system overlay tray
  const handleShareAction = async () => {
    const shareUrl = `${window.location.origin}/posts/${post._id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by @${post.senderId?.fullName}`,
          text: post.text || "Check out this awesome post!",
          url: shareUrl,
        });
      } catch (err) { console.log("Share aborted"); }
    } else {
      // Fallback: Copy link text automatically if browser drops share API protocols
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Post link copied to clipboard!");
    }
  };

  return (
    <div className="h-screen w-full snap-start relative flex items-center justify-center bg-zinc-950 border-b border-zinc-900">
      
      {/* BACKGROUND MEDIA PORTION */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
        {post.video ? (
          <video src={post.video} className="w-full h-full object-cover sm:object-contain" loop autoPlay muted playsInline />
        ) : post.image ? (
          <img src={post.image} alt="Feed" className="w-full h-full object-cover sm:object-contain" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6 bg-gradient-to-b from-zinc-900 to-black text-center">
            <p className="text-xl font-medium max-w-md text-zinc-100">{post.text}</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* FLOATING CONTROL ACTIONS SIDEBAR */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5 z-20">
        
        {/* Like Button Trigger */}
        <div className="flex flex-col items-center">
          <button onClick={handleLikeToggle} className={`btn btn-circle btn-neutral bg-black/40 border-none ${liked ? "text-error" : "text-white"}`}>
            <Heart size={24} fill={liked ? "currentColor" : "none"} />
          </button>
          <span className="text-xs font-semibold text-white mt-1 drop-shadow">{likeCount}</span>
        </div>

        {/* CONNECTED COMMENT BUTTON: Opens specific post modal drawer instance via ID */}
        <div className="flex flex-col items-center">
          <button 
            onClick={() => document.getElementById(`comment-modal-${post._id}`).showModal()}
            className="btn btn-circle btn-neutral bg-black/40 border-none text-white hover:text-info"
          >
            <MessageCircle size={24} />
          </button>
          {/* FIXED BUG: Shows actual live numbers length instead of hardcoded 24! */}
          <span className="text-xs font-semibold text-white mt-1 drop-shadow">{post.comments?.length || 0}</span>
        </div>

        {/* CONNECTED SHARE BUTTON */}
        <div className="flex flex-col items-center">
          <button onClick={handleShareAction} className="btn btn-circle btn-neutral bg-black/40 border-none text-white hover:text-success">
            <Share2 size={24} />
          </button>
          <span className="text-xs font-semibold text-white mt-1 drop-shadow">Share</span>
        </div>
      </div>

      {/* METADATA INFO PANEL LEFT FOOTER */}
      <div className="absolute left-4 bottom-6 right-20 text-white z-10 flex flex-col gap-2">
        <h3 className="font-bold text-lg">@{post.senderId?.fullName || "user"}</h3>
        {(post.video || post.image) && post.text && <p className="text-sm line-clamp-2 text-zinc-200">{post.text}</p>}
        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-300 max-w-sm bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <Music size={12} />
          <span className="inline-block animate-[marquee_10s_linear_infinite]">Original Sound - {post.senderId?.fullName || "Creator"}</span>
        </div>
      </div>

      {/* INDIVIDUAL POST NESTED DAISYUI COMMENT SHEET MODAL */}
      <dialog id={`comment-modal-${post._id}`} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-zinc-900 text-white flex flex-col max-h-[500px] h-[500px]">
          <h3 className="font-bold text-lg border-b border-zinc-800 pb-3">Comments ({post.comments?.length || 0})</h3>
          
          {/* Scrollable list element rendering live comment loops */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, idx) => (
                <div key={idx} className="flex gap-3 items-start text-sm">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full bg-zinc-700">
                      {comment.profilePic ? <img src={comment.profilePic} alt="" /> : <User size={14} className="m-auto mt-2" />}
                    </div>
                  </div>
                  <div className="flex-1 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                    <span className="font-bold block text-zinc-300 mb-0.5">@{comment.fullName}</span>
                    <p className="text-zinc-100">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500 text-sm">Be the first to leave a comment!</div>
            )}
          </div>

          {/* Persistent Form bottom layout field input box */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 border-t border-zinc-800 pt-3">
            <input
              type="text"
              placeholder="Add a comment down here..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-zinc-950 text-white border border-zinc-800 focus:outline-none focus:border-primary p-2.5 text-sm rounded-xl"
            />
            <button type="submit" disabled={!commentText.trim()} className="btn btn-circle btn-primary btn-sm">
              <Send size={14} />
            </button>
          </form>
          
          <form method="dialog" className="modal-backdrop absolute top-2 right-4">
            <button className="btn btn-xs btn-circle btn-ghost">✕</button>
          </form>
        </div>
      </dialog>

    </div>
  );
};


export default FeedsPage;
