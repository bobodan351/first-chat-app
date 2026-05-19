import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadMessages: [], // NEW STATE: Stores _id strings of users with unread texts

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch conversation");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message instantly");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // REMOVED early return check so the socket is always listening for new messages
    socket.on("newMessage", (newMessage) => {
      const { selectedUser, unreadMessages } = get();
      
      // If the message is from the user we currently have open, append to layout instantly
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        set({
          messages: [...get().messages, newMessage],
        });
      } else {
        // If it's a background message, save the sender ID to light up the sidebar badge
        if (!unreadMessages.includes(newMessage.senderId)) {
          set({ unreadMessages: [...unreadMessages, newMessage.senderId] });
          toast("New message received!", { icon: "💬" });
        }
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },

  // UPDATED: Automatically clears notification counts when clicking a profile row card
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    if (selectedUser) {
      const { unreadMessages } = get();
      set({
        unreadMessages: unreadMessages.filter((id) => id !== selectedUser._id),
      });
    }
  },
}));
