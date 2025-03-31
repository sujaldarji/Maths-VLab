const express = require("express");
const authenticateUser = require("../middlewares/authMiddleware.js");
const StudentModel = require("../Models/Student.js");

const router = express.Router();

// 🔹 Check Authentication Status (Returns authenticated user info)
router.get("/auth-status", authenticateUser, async (req, res) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({ success: false, authenticated: false, message: "Unauthorized" });
        }

        const user = await StudentModel.findById(req.user.userId).select("name");
        if (!user) {
            return res.status(404).json({ success: false, authenticated: false, message: "User not found" });
        }

        res.json({ success: true, authenticated: true, user: { name: user.name } });
    } catch (error) {
        console.error("Auth Status Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// 🔹 Protected Success Route (Example Protected Endpoint)
router.get("/success", authenticateUser, async (req, res) => {
    try {
        const user = await StudentModel.findById(req.user.userId).select("name");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: `Welcome, ${user.name}! You have successfully accessed a protected route.` });
    } catch (error) {
        console.error("Success Route Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
module.exports = router;
