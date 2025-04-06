const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const User = require("./models/User");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "secretKey",
  resave: false,
  saveUninitialized: true,
}));

// Database Connection
mongoose.connect("mongodb://localhost:27017/yumvault", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send("User Registered");
  } catch (error) {
    res.status(500).send("Error registering user");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.user = user;
    res.send("Login successful");
  } else {
    res.status(401).send("Invalid credentials");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("Logged out");
});

app.listen(3000, () => console.log("Server running on port 3000"));

