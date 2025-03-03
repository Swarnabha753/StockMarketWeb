const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/UserModel");

const router = express.Router();

// Signup Route
router.post("/signup", async(req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists!" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new UserModel({ username, email, password: hashedPassword });
        await newUser.save();

        // Generate token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "User registered successfully!", token });
    } catch (error) {
        console.error("Signup error:", error); // Log the error details
        res.status(500).json({ message: "Signup failed", error });
    }
});

// ✅ Login Route
router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        // Generate token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed", error });
    }
});

// ✅ Logout Route (Handled on Frontend)
router.post("/logout", (req, res) => {
    res.json({ message: "User logged out successfully" });
});

module.exports = router;