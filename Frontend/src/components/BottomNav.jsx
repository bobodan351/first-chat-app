import React from "react";
import { useNavigate, useLocation } from "react-router";
import { MessageSquare, Film, User, Settings } from "lucide-react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isChats = location.pathname === "/";
  const isFeeds = location.pathname === "/feeds";
  const isProfile = location.pathname === "/profile";
  const isSettings = location.pathname === "/settings";

  return (
    /* 
      FIXED CONFIGURATION: 
      - Replaced flex layout with 'grid grid-cols-4' to stop buttons from shrinking together.
      - Increased height to h-18 (72px) for safer smartphone touch targets.
    */
    <div className="fixed bottom-0 left-0 right-0 h-18 bg-zinc-950 border-t border-zinc-900 grid grid-cols-4 z-50 md:hidden safe-bottom">
      
      {/* CHATS BUTTON */}
      <button 
        className={`flex flex-col items-center justify-center w-full h-full transition-all ${
          isChats ? "text-primary bg-zinc-900/40 font-bold" : "text-zinc-400 hover:text-white"
        }`}
        onClick={() => navigate("/")}
      >
        <MessageSquare size={22} />
        <span className="text-[10px] mt-1 tracking-wide">Chats</span>
      </button>

      {/* FEEDS BUTTON */}
      <button 
        className={`flex flex-col items-center justify-center w-full h-full transition-all ${
          isFeeds ? "text-primary bg-zinc-900/40 font-bold" : "text-zinc-400 hover:text-white"
        }`}
        onClick={() => navigate("/feeds")}
      >
        <Film size={22} />
        <span className="text-[10px] mt-1 tracking-wide">Feeds</span>
      </button>

      {/* PROFILE BUTTON */}
      <button 
        className={`flex flex-col items-center justify-center w-full h-full transition-all ${
          isProfile ? "text-primary bg-zinc-900/40 font-bold" : "text-zinc-400 hover:text-white"
        }`}
        onClick={() => navigate("/profile")}
      >
        <User size={22} />
        <span className="text-[10px] mt-1 tracking-wide">Profile</span>
      </button>

      {/* SETTINGS BUTTON */}
      <button 
        className={`flex flex-col items-center justify-center w-full h-full transition-all ${
          isSettings ? "text-primary bg-zinc-900/40 font-bold" : "text-zinc-400 hover:text-white"
        }`}
        onClick={() => navigate("/settings")}
      >
        <Settings size={22} />
        <span className="text-[10px] mt-1 tracking-wide">Settings</span>
      </button>

    </div>
  );
};

export default BottomNav;
