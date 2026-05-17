import axios from "axios";

export const axiosInstance = 
  axios.create({
    baseURL: "https://first-chat-app-n05p.onrender.com/api",
    withCredentials: true,
  });

