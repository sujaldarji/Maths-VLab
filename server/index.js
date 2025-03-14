const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const StudentModel = require('./Models/Student');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

// ! Connect to MongoDB with Error Handling
mongoose.connect("mongodb://127.0.0.1:27017/student_details")
    .then(() => {
        console.log("✅ Connected to MongoDB");

        // Start the server only after DB connection
        server = app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
        });
    })
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

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

// ! Register Endpoint (Signup) with Validation
app.post('/register',
    [
        // Validation rules
        body("name")
            .trim()
            .isLength({ min: 3, max: 50 })
            .withMessage("Name should be 3 to 50 characters long.")
            .matches(/^[A-Za-z\s]+$/)
            .withMessage("Name should contain only alphabets and spaces."),
        body("email")
            .trim()
            .isEmail()
            .withMessage("Invalid email format."),
        body("password")
            .trim()
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long.")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, password } = req.body;

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
    }
);

// ! Sign In Endpoint with Validation
app.post('/signin',
    [
        body("email").trim().isEmail().withMessage("Invalid email format."),
        body("password").trim().notEmpty().withMessage("Password cannot be empty.")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;

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
    }
);
