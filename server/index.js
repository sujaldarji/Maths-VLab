const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

const StudentModel = require('./Models/Student');
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const contactRoutes = require("./routes/contactRoutes");
const { sendResetEmail } = require("./config/sendMail");
const topicRoutes = require("./routes/topicRoutes");

const app = express();

// Ensure required environment variables exist
if (!process.env.PORT || !process.env.MONGO_URI) {
    console.error("❌ Missing required environment variables. Check .env file.");
    process.exit(1);
}

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
// Middleware
app.use(express.json());
app.use(cors({
    origin: CLIENT_URL, // Adjust for production
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(cookieParser());

// Connect to MongoDB
let server;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB");
        server = app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    });

// Handle process termination
const shutdown = () => {
    console.log("⚠️ Server shutting down...");
    if (server) {
        server.close(() => {
            console.log("✅ Server closed.");
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Use Routes
app.use("/api/authRoutes", authRoutes);
app.use("/api/userRoutes", userRoutes);
app.use("/api/tokenRoutes", tokenRoutes);
app.use("/api/contactRoutes", contactRoutes);
app.use("/api/topicRoutes", topicRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

//reset password codes

// Store reset tokens (in-memory for now, better to store in DB)
const resetTokens = new Map();

// Forgot Password Endpoint
app.post('/api/send-reset-link', async (req, res) => {
    const { email } = req.body;
    try {
        const { email } = req.body;
        const user = await StudentModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No user found with this email" });
        }

        // ✅ Generate Secure Token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // ✅ Set Expiry (15 minutes from now)
        const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

        // ✅ Update User in Database
        await StudentModel.updateOne(
            { email },
            { $set: { resetToken, resetTokenExpiry } }
        );

        // ✅ Send Reset Email (Modify `sendResetEmail` function accordingly)
        sendResetEmail(user.email, resetToken);

        res.status(200).json({ message: "Reset link sent to your email!" });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
app.get('/api/test', (req, res) => {
  res.send('API is working!');
});

// Reset Password Endpoint
app.post("/api/reset-password", async (req, res) => {
    try {
        const { token, password } = req.body;

        // Find user with matching token
        const user = await StudentModel.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = null;  // Remove the token after use
        user.resetTokenExpiry = null;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
