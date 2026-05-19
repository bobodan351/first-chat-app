import React from "react";
import { useNavigate, useLocation } from "react-router";
import { MessageSquare, Film, User, Settings } from "lucide-react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Active path checking
  const isChats = location.pathname === "/";
  const isFeeds = location.pathname === "/feeds";
  const isProfile = location.pathname === "/profile";
  const isSettings = location.pathname === "/settings";

  return (
    <div className="btm-nav btm-nav-md bg-zinc-950 text-zinc-400 border-t border-zinc-900 z-50 md:hidden">
      {/* CHATS TAB */}
      <button 
        className={isChats ? "active text-primary bg-zinc-900/40" : "hover:text-white"}
        onClick={() => navigate("/")}
      >
        <MessageSquare size={20} />
        <span className="btm-nav-label text-[10px] font-semibold">Chats</span>
      </button>

      {/* FEEDS TAB */}
      <button 
        className={isFeeds ? "active text-primary bg-zinc-900/40" : "hover:text-white"}
        onClick={() => navigate("/feeds")}
      >
        <Film size={20} />
        <span className="btm-nav-label text-[10px] font-semibold">Feeds</span>
      </button>

      {/* PROFILE TAB */}
      <button 
        className={isProfile ? "active text-primary bg-zinc-900/40" : "hover:text-white"}
        onClick={() => navigate("/profile")}
      >
        <User size={20} />
        <span className="btm-nav-label text-[10px] font-semibold">Profile</span>
      </button>

      {/* SETTINGS TAB */}
      <button 
        className={isSettings ? "active text-primary bg-zinc-900/40" : "hover:text-white"}
        onClick={() => navigate("/settings")}
      >
        <Settings size={20} />
        <span className="btm-nav-label text-[10px] font-semibold">Settings</span>
      </button>
    </div>
  );
};

export default BottomNav;
