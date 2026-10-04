const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const secret = () => process.env.JWT_SECRET || "demo_secret";

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered." });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    res.json({ message: "Registration successful.", id: user._id });
  } catch (e) {
    res.status(500).json({ message: "Registration failed." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid email or password." });

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      secret(),
      { expiresIn: "2h" }
    );

    res.json({ token, name: user.name, role: user.role });
  } catch {
    res.status(500).json({ message: "Login failed." });
  }
});

module.exports = router;