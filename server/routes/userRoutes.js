const express = require("express");
const authenticateUser = require("../middlewares/authMiddleware.js");
const UserModel = require("../Models/Users.js");

const router = express.Router();

// 🔹 Check Authentication Status (Returns authenticated user info)
router.get("/auth-status", authenticateUser, async (req, res) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({ success: false, authenticated: false, message: "Unauthorized" });
        }

        const user = await UserModel.findById(req.user.userId).select("name role isApproved");
        if (!user) {
            return res.status(404).json({ success: false, authenticated: false, message: "User not found" });
        }

        if (user.role === "teacher" && !user.isApproved) {
            return res.status(403).json({
                success: false,
                authenticated: true,
                message: "Teacher account pending admin approval",
                user: { name: user.name, role: user.role, isApproved: user.isApproved },
            });
        }
        
        res.json({ 
            success: true, 
            authenticated: true, 
            user: { 
                name: user.name, 
                role: user.role,
                isApproved: user.isApproved 
            } 
        });
    } catch (error) {
        console.error("Auth Status Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// 🔹 Token Verification Route (Ensures Token is Valid)
router.get("/verify-token", authenticateUser, async (req, res) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await UserModel.findById(req.user.userId).select("name role isApproved");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
          success: true,
          message: "Token is valid",
          user: { name: user.name, role: user.role, isApproved: user.isApproved }, 
        });
  } catch (error) {
        console.error("Token Verification Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;