const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const StudentModel = require('./Models/Student');
const { validateSignUp, validateSignIn } = require('./middlewares/validation.js');
const { sanitizeInput } = require('./middlewares/sanitize.js');
const authenticateUser = require('./middlewares/auth.js');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3001', // Change this to your frontend URL
    credentials: true, // Allow credentials (cookies)
}));
app.use(cookieParser());

const PORT = process.env.PORT || 3001;

// ! Connect to MongoDB with Error Handling
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB");
        server = app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1); // Exit if DB connection fails
    });

// Handle process termination
const shutdown = () => {
    console.log("⚠️ Server shutting down...");
    server.close(() => {
        console.log("✅ Server closed.");
        process.exit(0);
    });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// ! Register Endpoint (Signup) - No JWT Here
app.post('/register', validateSignUp, async (req, res) => {
    try {
        const name = sanitizeInput(req.body.name);
        const email = sanitizeInput(req.body.email);
        const password = req.body.password;

        // * Check if user already exists
        const existingUser = await StudentModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered" });
        }

        // * Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // * Create new user
        const newUser = await StudentModel.create({ name, email, password: hashedPassword });
        res.status(201).json({ success: true, message: "User registered successfully. Please sign in." });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// ! Sign In Endpoint - Generates JWT Token
app.post('/signin', validateSignIn, async (req, res) => {
    try {
        const email = sanitizeInput(req.body.email);
        const password = req.body.password;

        // * Check if user exists
        const user = await StudentModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No user found with this email" });
        }

        // * Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // * Generate JWT Token
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // * Set token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure in production
            sameSite: 'Strict'
        });

        res.status(200).json({ message: "Login successful" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get('/success', authenticateUser, (req, res) => {
    res.json({ message: `Welcome, user ${req.user.email}` });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Strict'
    });
    res.status(200).json({ message: "Logged out successfully" });
});

