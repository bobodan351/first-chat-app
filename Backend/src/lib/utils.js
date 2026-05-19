import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const S_key = process.env.JWT_SECRET;

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, S_key, { expiresIn: "7d" });
  
  // Still set cookie as fallback, but main auth will be via header
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });
  
  return token; // Return token for localStorage
};