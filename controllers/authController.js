const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const generateAccessToken = (userId, deviceId) => {
  return jwt.sign({ userId, deviceId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m", 
  });
};

const generateRefreshToken = (userId, deviceId) => {
  return jwt.sign({ userId, deviceId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d", 
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, deviceId } = req.body;

    if (!email || !password || !deviceId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user._id, deviceId);
    const refreshToken = generateRefreshToken(user._id, deviceId);

    user.refreshTokens = user.refreshTokens.filter((t) => t.deviceId !== deviceId);

    user.refreshTokens.push({ token: refreshToken, deviceId });
    await user.save();

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken, deviceId } = req.body;

    if (!refreshToken || !deviceId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findOne({
      _id: decoded.userId,
      "refreshTokens.token": refreshToken,
      "refreshTokens.deviceId": deviceId,
    });

    if (!user) {
      throw new Error("Invalid refresh token");
    }

    // Хранить refreshToken в куках
    const newAccessToken = generateAccessToken(user._id, deviceId);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ message: "Device ID is required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user.refreshTokens = req.user.refreshTokens.filter((t) => t.deviceId !== deviceId);
    await req.user.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};