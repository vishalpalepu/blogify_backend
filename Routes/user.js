// Routes/user.js
const { Router } = require("express");
const router = Router();
const User = require("../Models/user");

// Signup endpoint
router.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    const newUser = await User.create({ fullname, email, password });
    res.json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Signin endpoint
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
