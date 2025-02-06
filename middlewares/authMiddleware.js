const { verifyAccessToken, verifyRefreshToken } = require("../utils/jwt");
const { generateAccessToken } = require("../utils/jwt");
const User = require("../models/user");

exports.authenticate = async (req, res, next) => {
  const accessToken = req.header("Authorization");

  if (!accessToken) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = verifyAccessToken(accessToken.replace("Bearer ", ""));

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid token: User not found" });
    }

   
    req.user = user; 
    req.deviceId = decoded.deviceId;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired", error: "TokenExpiredError" });
    }

    res.status(401).json({ message: "Invalid token" });
  }
};

exports.refreshTokenMiddleware = async (req, res, next) => {
  const refreshToken = req.header("Authorization");

  if (!refreshToken) {
    return res.status(401).json({ message: "Access denied, no refresh token provided" });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken.replace("Bearer ", ""));

    const user = await User.findOne({
      _id: decoded.userId,
      "refreshTokens.token": refreshToken.replace("Bearer ", ""),
      "refreshTokens.deviceId": decoded.deviceId,
    });

    if (!user) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(user._id, decoded.deviceId);

    res.locals.newAccessToken = newAccessToken;

    next();
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};