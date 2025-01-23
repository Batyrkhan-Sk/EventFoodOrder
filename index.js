require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");

const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const PORT = process.env.PORT || 3000;

connectDB();

const app = express();

app.use(express.json());

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/auth", express.static(path.join(__dirname, "auth")));
app.use("/main", express.static(path.join(__dirname, "main")));

app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes); 
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "main/index.html")));
app.get("/signUp", (req, res) => res.sendFile(path.join(__dirname, "auth/signUp.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "auth/login.html")));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
