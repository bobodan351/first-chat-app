import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import { io, getReceiverSocketId } from "../lib/socket.js";
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("error in getUsersForSidebar :", error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("error in getMessages controller :", error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const sendMessages = async (req, res) => {
	try {
	  const {text,image} =  req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;
		let imageUrl;
		if (image) {
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url
            console.log("2. Cloudinary response link generated:", imageUrl);

		}
		const newMessages = new Message({
			senderId,
			receiverId,
			text,
			image: imageUrl
		})
    await newMessages.save()
        console.log("3. Saved Database Record payload:", newMessages);

    const receiverSocketId = getReceiverSocketId(receiverId);
if (receiverSocketId) {
  io.to(receiverSocketId).emit("newMessage", newMessages);
}
		res.status(201).json(newMessages)
  } catch (error) {
	      console.log("error in sendMessages controller :", error);
    res.status(500).json({ message: "internal server error in sendMessages" });
  }
};
