require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
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
app.use(cors());

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/auth", express.static(path.join(__dirname, "auth")));
app.use("/main", express.static(path.join(__dirname, "main")));
app.use("/payment", express.static(path.join(__dirname, "payment")));

app.get("/food", (req, res) => {
  res.sendFile(path.join(__dirname, "food", "food.html"));
});

app.use("/fooddesc", express.static(path.join(__dirname, "fooddesc")));

app.use("/api/orders", authenticate, orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", authenticate, paymentRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "main", "index.html"))
);
app.get("/signUp", (req, res) =>
  res.sendFile(path.join(__dirname, "auth", "signUp.html"))
);
app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "auth", "login.html"))
);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});