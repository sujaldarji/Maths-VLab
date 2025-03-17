const express = require("express");
const jwt = require("jsonwebtoken"); // Added missing import
const authenticateUser = require("../middlewares/auth.js");
const StudentModel = require("../Models/Student.js");

const router = express.Router();

// Check Auth Status
router.get("/auth-status", authenticateUser, async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ authenticated: false });
        }

        const user = await StudentModel.findById(req.user.userId).select("name");
        if (!user) {
            return res.status(404).json({ authenticated: false });
        }

        res.json({ authenticated: true, user: { name: user.name } });
    } catch (error) {
        res.status(500).json({ authenticated: false });
    }
});

// Profile route using middleware
router.get('/profile', authenticateUser, async (req, res) => {
    try {
        const user = await StudentModel.findById(req.user.userId).select("name");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ name: user.name });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Success route (dummy protected route)
router.get('/success', authenticateUser, async (req, res) => {
    try {
        const user = await StudentModel.findById(req.user.userId).select("name");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: `Welcome, ${user.name}` });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
