require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const { authenticate } = require("./middlewares/authMiddleware");

const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const productRoutes = require("./routes/productRoutes");

const PORT = process.env.PORT || 3000;

connectDB();

const app = express();

app.use(express.json());

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/auth", express.static(path.join(__dirname, "auth")));
app.use("/main", express.static(path.join(__dirname, "main")));
app.use("/food", express.static(path.join(__dirname, "food"))); 



app.use("/api/orders", authenticate, orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", authenticate, paymentRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/main/index.html")));
app.get("/signUp", (req, res) => res.sendFile(path.join(__dirname, "auth/signUp.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "auth/login.html")));
app.get("/food", (req, res) => res.sendFile(path.join(__dirname, "food/food.html"))); 



app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});