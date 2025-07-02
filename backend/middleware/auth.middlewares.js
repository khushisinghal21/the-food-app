import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = async (req, res, next) => {
  try {
    // 1. Extract token from either cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request: Token not provided",
      });
    }

    // 2. Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Fetch user using ID from token
    const user = await User.findById(decoded._id).select("-password -refreshToken");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized  request: User not found",
      });
    }

    // 4. Attach user to request object
    req.user = user;

    // 5. Continue to next middleware
    next();

  } catch (error) {
    // Handle expired or invalid tokens
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};
