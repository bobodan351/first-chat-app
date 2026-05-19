import React from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import { useEffect } from "react";

const HomePage = () => {
  const { selectedUser } = useChatStore();
    useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [subscribeToMessages, unsubscribeFromMessages, selectedUser]); // Re-runs cleanly when selectedUser swaps


  return (
    <div className="h-screen bg-base-200 flex items-center justify-center pt-16">
      {/* Changed height properties to scale dynamically on mobile browsers */}
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl md:h-[calc(100vh-8rem)] h-[calc(100vh-4rem)] flex overflow-hidden">
        
        {/* 1. SIDEBAR WRAPPER */}
        <div className={`h-full ${selectedUser ? "hidden md:flex md:w-72" : "flex w-full md:w-72"}`}>
          <Sidebar />
        </div>

        {/* 2. CHAT CONTAINER WRAPPER */}
        <div className={`flex-1 h-full flex flex-col ${!selectedUser ? "hidden md:flex" : "flex"}`}>
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>

      </div>
    </div>
  );
};

export default HomePage;
