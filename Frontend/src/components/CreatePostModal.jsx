import React, { useState, useRef } from "react";
import { usePostStore } from "../store/usePostStore";
import { Image, Video, X, Send } from "lucide-react";
import toast from "react-hot-toast";

const CreatePostModal = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const { createPost } = usePostStore();

  // Handle local File conversions to Base64 strings
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "image" && !file.type.startsWith("image/")) {
      return toast.error("Please select an image file.");
    }
    if (type === "video" && !file.type.startsWith("video/")) {
      return toast.error("Please select a valid video file.");
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "image") {
        setImagePreview(reader.result);
        setVideoPreview(null); // Clear video if image is picked
      } else {
        setVideoPreview(reader.result);
        setImagePreview(null); // Clear image if video is picked
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !videoPreview) return;

    setIsSubmitting(true);
    const success = await createPost({
      text: text.trim(),
      image: imagePreview,
      video: videoPreview,
    });
    setIsSubmitting(false);

    if (success) {
      setText("");
      setImagePreview(null);
      setVideoPreview(null);
      document.getElementById("create-post-modal").close(); // Closes DaisyUI Modal
    }
  };

  return (
    <div>
      {/* TRIGGER BUTTON (Place this floating over your Feed) */}
      <button 
        className="fixed bottom-6 left-6 btn btn-circle btn-primary shadow-xl z-50 animate-bounce"
        onClick={() => document.getElementById("create-post-modal").showModal()}
      >
        <span className="text-xl font-bold">+</span>
      </button>

      {/* DAISYUI DIALOG MODAL BOX */}
      <dialog id="create-post-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-zinc-900 text-white border border-zinc-800">
          <h3 className="font-bold text-lg mb-4">Create Feed Post</h3>
          
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <textarea
              className="textarea textarea-bordered w-full bg-zinc-950 text-white placeholder-zinc-500 focus:outline-none focus:border-primary resize-none h-24"
              placeholder="What is on your mind? Add captions here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {/* DYNAMIC MEDIA PREVIEWS */}
            {imagePreview && (
              <div className="relative rounded-lg overflow-hidden border border-zinc-700 max-h-48">
                <img src={imagePreview} alt="Upload preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 btn btn-circle btn-xs btn-neutral bg-black/70 border-none"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {videoPreview && (
              <div className="relative rounded-lg overflow-hidden border border-zinc-700 max-h-48">
                <video src={videoPreview} className="w-full h-full object-cover" controls muted />
                <button 
                  type="button" 
                  onClick={() => setVideoPreview(null)}
                  className="absolute top-2 right-2 btn btn-circle btn-xs btn-neutral bg-black/70 border-none"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* CONTROL TRIGGER LAYOUT BUTTONS */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                {/* Image Picker Trigger */}
                <input 
                  type="file" accept="image/*" className="hidden" 
                  ref={imageInputRef} onChange={(e) => handleFileChange(e, "image")} 
                />
                <button 
                  type="button" onClick={() => imageInputRef.current?.click()}
                  className="btn btn-circle btn-ghost btn-sm text-emerald-500 hover:bg-zinc-800"
                >
                  <Image size={20} />
                </button>

                {/* Video Picker Trigger */}
                <input 
                  type="file" accept="video/*" className="hidden" 
                  ref={videoInputRef} onChange={(e) => handleFileChange(e, "video")} 
                />
                <button 
                  type="button" onClick={() => videoInputRef.current?.click()}
                  className="btn btn-circle btn-ghost btn-sm text-sky-500 hover:bg-zinc-800"
                >
                  <Video size={20} />
                </button>
              </div>

              {/* Action Submit Trigger */}
              <button 
                type="submit" 
                className="btn btn-primary btn-sm rounded-full px-4 gap-2"
                disabled={isSubmitting || (!text.trim() && !imagePreview && !videoPreview)}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <>Publish <Send size={14} /></>
                )}
              </button>
            </div>
          </form>

          {/* DaisyUI close trigger layout when clicking outside wrapper */}
          <div className="modal-action mt-0 absolute top-2 right-4">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost text-zinc-400 hover:text-white">✕</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CreatePostModal;
