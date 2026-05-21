import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, X } from "lucide-react"; // Added Search and X icons

const Sidebar = () => {
  // Added unreadMessages to the store destructuring extractor
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, unreadMessages } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // NEW: Search state

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Modified logic: First filter by online status, then by search query input string
  const baseFilteredUsers = users.filter((user) => {
    const matchesOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOnline && matchesSearch;
  });

  const filteredUsers = [...baseFilteredUsers].sort((a, b) => {
    const isAOnline = onlineUsers.includes(a._id);
    const isBOnline = onlineUsers.includes(b._id);
    if (isAOnline && !isBOnline) return -1;
    if (!isAOnline && isBOnline) return 1;
    return 0;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium block">Contacts</span>
        </div>
        
        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={showOnlineOnly} 
              onChange={(e) => setShowOnlineOnly(e.target.checked)} 
              className="checkbox checkbox-sm" 
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({Math.max(0, onlineUsers.length - 1)} online)
          </span>
        </div>

        {/* NEW SEARCH BAR INPUT INTERFACE */}
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
            <Search className="size-4" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-base-200 text-sm rounded-lg border border-base-300 focus:outline-none focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-2 flex items-center text-zinc-400 hover:text-zinc-200"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button 
            key={user._id} 
            onClick={() => setSelectedUser(user)} 
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""
            }`}
          >
            <div className="relative mx-0">
              <img src={user.profilePic || "/avatar.png"} alt={user.fullName} className="size-12 object-cover rounded-full" />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            {/* Modified text layout wrapper to align item details horizontally */}
            <div className="text-left min-w-0 flex-1 flex items-center justify-between">
              <div>
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>

              {/* NEW MESSAGE BADGE INDICATOR */}
              {unreadMessages.includes(user._id) && (
                <span className="badge badge-primary badge-sm font-bold text-white px-2.5 py-2 rounded-full animate-pulse bg-green-900">
                  
                </span>
              )}
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-8 text-sm">
            No contacts match your search
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
