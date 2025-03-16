const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authenticateUser = require("../middlewares/auth.js"); // Import middleware
const StudentModel = require("../Models/Student.js"); // Adjust path if needed

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


router.post("/logout", (req, res) => {
  res.cookie("token", "", { 
    httpOnly: true, 
    sameSite: "Lax", 
    expires: new Date(0) // Expire immediately
  });
  res.status(200).json({ message: "Logged out successfully" });
});



module.exports = router;
