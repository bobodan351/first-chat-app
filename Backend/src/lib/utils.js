import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const S_key = process.env.JWT_SECRET;
const secureChecker = process.env.NODE_ENV

console.log(secureChecker!== "development");
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, S_key, {
    expiresIn: "7d",
  });
  
  // DEBUG: Log what secure actually evaluates to
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("secure value:", process.env.NODE_ENV !== "development");
  
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV !== "development",
    path: "/",  // ✅ Add this - ensures cookie is sent on all paths
  });
  
  return token;
};
