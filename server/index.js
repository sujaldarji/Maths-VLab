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
<<<<<<< HEAD
const { sendResetEmail } = require("./config/sendMail");

const app = express();

// Ensure required environment variables exist
=======
const topicRoutes = require("./routes/topicRoutes"); // Topic routes
const { sendResetEmail } = require("./config/sendMail");

// Require new route files
const textContentRoutes = require("./routes/textContentRoutes");
const videoContentRoutes = require("./routes/videoContentRoutes");
const simulationRoutes = require("./routes/simulationRoutes");
const quizRoutes = require("./routes/quizRoutes");
const progressRoutes = require("./routes/progressRoutes");
const gameContentRoutes = require("./routes/gameContentRoutes");

// Ensure required environment variables exist before initializing the app
>>>>>>> 59d7a14 (sample content for algebra topic)
if (!process.env.PORT || !process.env.MONGO_URI) {
    console.error("❌ Missing required environment variables. Check .env file.");
    process.exit(1);
}

const PORT = process.env.PORT;

<<<<<<< HEAD
// Middleware
=======
// Initialize the app BEFORE using it.
const app = express();

// Middleware setup (only once)
>>>>>>> 59d7a14 (sample content for algebra topic)
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Adjust for production
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(cookieParser());

<<<<<<< HEAD
=======
// Mount the routes (only once)
app.use("/api/authRoutes", authRoutes);
app.use("/api/userRoutes", userRoutes);
app.use("/api/tokenRoutes", tokenRoutes);
app.use("/api/contactRoutes", contactRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/textContent", textContentRoutes);
//app.use("/api/videoContent", videoContentRoutes);
app.use("/api/simulationContent", simulationRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/gameContent", gameContentRoutes);

>>>>>>> 59d7a14 (sample content for algebra topic)
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

<<<<<<< HEAD
// Use Routes
app.use("/api/authRoutes", authRoutes);
app.use("/api/userRoutes", userRoutes);
app.use("/api/tokenRoutes", tokenRoutes);
app.use("/api/contactRoutes", contactRoutes);

=======
>>>>>>> 59d7a14 (sample content for algebra topic)
// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

<<<<<<< HEAD
//reset password codes

// Store reset tokens (in-memory for now, better to store in DB)
const resetTokens = new Map();

// Forgot Password Endpoint
app.post('/api/send-reset-link', async (req, res) => {
    const { email } = req.body;

    // try {
    //     // Check if the user exists
    //     const user = await StudentModel.findOne({ email });
    //     if (!user) {
    //         return res.status(404).json({ message: "No user found with this email" });
    //     }

    //     // Generate reset token
    //     const resetToken = crypto.randomBytes(32).toString("hex");
    //     resetTokens.set(resetToken, email); // Store token in memory

    //     // Send email with reset link
    //     const resetLink = `http://localhost:5173/reset-password/token=${resetToken}`;
    //     await sendResetEmail(email, resetLink);

    //     res.status(200).json({ message: "Reset link sent successfully" });

    // } catch (error) {
    //     console.error("Error sending reset link:", error);
    //     res.status(500).json({ message: "Internal server error" });
    // }
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
=======
// Reset Password Routes
app.post('/api/send-reset-link', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await StudentModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No user found with this email" });
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 15 * 60 * 1000;
>>>>>>> 59d7a14 (sample content for algebra topic)
        await StudentModel.updateOne(
            { email },
            { $set: { resetToken, resetTokenExpiry } }
        );
<<<<<<< HEAD

        // ✅ Send Reset Email (Modify `sendResetEmail` function accordingly)
        sendResetEmail(user.email, resetToken);

        res.status(200).json({ message: "Reset link sent to your email!" });

=======
        sendResetEmail(user.email, resetToken);
        res.status(200).json({ message: "Reset link sent to your email!" });
>>>>>>> 59d7a14 (sample content for algebra topic)
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

<<<<<<< HEAD
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

=======
app.post("/api/reset-password", async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await StudentModel.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();
        res.status(200).json({ message: "Password reset successful" });
>>>>>>> 59d7a14 (sample content for algebra topic)
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
