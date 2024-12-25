const express = require("express");
const path = require("path");

const app = express();

app.use("/assets", express.static(path.join(__dirname, "assets"))); 
app.use("/auth", express.static(path.join(__dirname, "auth"))); 
app.use("/main", express.static(path.join(__dirname, "main"))); 

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "main/index.html"));
});

app.get("/signUp", function (req, res) {
    res.sendFile(path.join(__dirname, "auth/signUp.html"));
});

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "auth/login.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`);
});
