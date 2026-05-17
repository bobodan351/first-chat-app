import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"; 
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "password must be more than 8 characters" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exist " });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPasswords = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPasswords,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "invalid user data" });
    }
  } catch (error) {
    console.log("error in user controller ", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "incorrect password" });
      // remember to add that if the password is wrong you ssay email is wrong and vice versa
    }
    const isPasswordCorrect =await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "incorrect email address"});
      // remember to add that if the password is wrong you ssay email is wrong and vice versa
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("error in the consoler", error)
    res.status(500).json({
      message: `internal server error,from the developer side. Error:${error}`
    })
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV !== "development",
      path: "/",  // ✅ Must match the path used when setting
    });
    res.status(200).json({ message: "successfully logged out" });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({ message: `error in logout controller ${error}` });
  }
};
export const updateProfile = async (req, res) => {
  try{
    const {profilePic} = req.body;
    const userId = req.user._id;
    if (!profilePic){
      return res.status(400).json({message: "profile pic is required"})

    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {profilePic: uploadResponse.secure_url},
      {new: true}

    );
    res.status(200).json(updatedUser);
  }
  catch(error){
    console.log("error in update profile :", error)
    res.status(500).json({message: "internal server error"})

  }
}
export const checkAuth = async (req, res) => { 
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log("error in check auth controller", error)
    res.status(500).json({ message: "internal server error" });
  }

}