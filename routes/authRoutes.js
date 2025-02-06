const express = require("express");
const {
  register,
  login,
  refreshToken,
  logout,
} = require("../controllers/authController");
const {
  validateRegistration,
  validateLogin,
} = require("../middlewares/validators");
const { authenticate, refreshTokenMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", validateRegistration, register);

router.post("/login", validateLogin, login);

router.post("/refresh-token", refreshTokenMiddleware, refreshToken);

router.post("/logout", authenticate, logout);

module.exports = router;