const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const StudentModel = require('./Models/Student');
const { validateSignUp, validateSignIn } = require('./middlewares/validation.js'); 
const { sanitizeInput } = require('./middlewares/sanitize.js'); // ✅ Import sanitization function

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

// ! Connect to MongoDB with Error Handling
mongoose.connect("mongodb://127.0.0.1:27017/student_details")
    .then(() => {
        console.log("✅ Connected to MongoDB");
        server = app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1); // Exit the process if DB connection fails
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

// ! Register Endpoint (Signup)
app.post('/register', validateSignUp, async (req, res) => {
    try {
        const name = sanitizeInput(req.body.name); // ✅ Sanitize name
        const email = sanitizeInput(req.body.email); // ✅ Sanitize email
        const password = req.body.password; // Do not sanitize password

        // * Check if user already exists
        const existingUser = await StudentModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered" });
        }

        // * Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // * Create new user
        const newUser = await StudentModel.create({ name, email, password: hashedPassword });
        res.status(201).json({ success: true, user: newUser });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// ! Sign In Endpoint
app.post('/signin', validateSignIn, async (req, res) => {
    try {
        const email = sanitizeInput(req.body.email); // ✅ Sanitize email
        const password = req.body.password; // Do not sanitize password

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

        res.status(200).json({ message: "Login successful", user });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
