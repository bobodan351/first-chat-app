import React from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200 flex items-center justify-center pt-16">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)] flex overflow-hidden">
        
        {/* 1. SIDEBAR: Hidden on mobile IF a chat is active/selected */}
        <div className={`h-full ${selectedUser ? "hidden md:flex" : "flex w-full md:w-auto"}`}>
          <Sidebar />
        </div>

        {/* 2. CHAT CONTAINER: Hidden on mobile IF NO chat is selected */}
        <div className={`flex-1 h-full flex flex-col ${!selectedUser ? "hidden md:flex" : "flex"}`}>
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>

      </div>
    </div>
  );
};

export default HomePage;
