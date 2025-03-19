const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Ensure required environment variables exist
if (!process.env.PORT || !process.env.MONGO_URI) {
    console.error("❌ Missing required environment variables. Check .env file.");
    process.exit(1);
}

const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Adjust for production
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

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});
