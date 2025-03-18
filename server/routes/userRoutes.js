const express = require("express");
const authenticateUser = require("../middlewares/authMiddleware.js");
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
        console.error("Auth Status Error:", error);
        res.status(500).json({ authenticated: false });
    }
});

// Protected Success Route
router.get("/success", authenticateUser, async (req, res) => {
    try {
        const user = await StudentModel.findById(req.user.userId).select("name");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: `Welcome, ${user.name}! You have successfully accessed a protected route.` });
    } catch (error) {
        console.error("Success Route Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
