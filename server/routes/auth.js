const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const StudentModel = require("../Models/Student.js");
const { validateSignUp, validateSignIn } = require("../middlewares/validation.js");
const { sanitizeInput } = require("../middlewares/sanitize.js");

const router = express.Router();

// Generate Access & Refresh Tokens
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
};

// Register Endpoint
router.post('/register', validateSignUp, async (req, res) => {
    try {
        const name = sanitizeInput(req.body.name);
        const email = sanitizeInput(req.body.email);
        const password = req.body.password;

        const existingUser = await StudentModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await StudentModel.create({ name, email, password: hashedPassword });

        res.status(201).json({ success: true, message: "User registered successfully. Please sign in." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Sign In Endpoint
// Sign In Endpoint
router.post('/signin', validateSignIn, async (req, res) => {
    try {
        const email = sanitizeInput(req.body.email);
        const password = req.body.password;

        const user = await StudentModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No user found with this email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Generate Tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Set Refresh Token in HTTP-only Cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict", // More secure
            path: "/", // Ensure it's accessible site-wide
        });

        res.status(200).json({ 
            message: "Login successful", 
            accessToken 
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;
