import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    // 1. Read cookie
    const token = req.cookies.jwt;
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // 2. Verify with environment variable loaded globally at server start
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // 3. Find and attach user to request object
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protective middleware: ", error.message);
    return res.status(401).json({ message: "Unauthorized - Token verification failed" });
  }
};

export default protectRoute;
