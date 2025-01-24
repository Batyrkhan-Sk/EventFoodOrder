require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const jwt = require("jsonwebtoken");

const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const productRoutes = require("./routes/productRoutes");

const PORT = process.env.PORT || 3000;

connectDB();

const app = express();

app.use(express.json());

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization"); 
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. Invalid token format." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verified; 
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid token", error: error.message });
  }
};

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/auth", express.static(path.join(__dirname, "auth")));
app.use("/main", express.static(path.join(__dirname, "main")));

app.use("/api/orders", verifyToken, orderRoutes); 
app.use("/api/auth", authRoutes); 
app.use("/api/payment", verifyToken, paymentRoutes); 
app.use("/api/products", productRoutes); 

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "main/index.html")));
app.get("/signUp", (req, res) => res.sendFile(path.join(__dirname, "auth/signUp.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "auth/login.html")));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
