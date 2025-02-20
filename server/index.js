const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
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

// Listen for termination signals
process.on("SIGINT", shutdown);  // Ctrl+C
process.on("SIGTERM", shutdown); // Termination from process manager

// ! Register Endpoint (Signup)
app.post('/register', async (req, res) => {
    try {
        console.log("📩 Received Data:", req.body);
        const { name, email, password } = req.body;

        // * Check if user already exists
        const existingUser = await StudentModel.findOne({ email });
        if (existingUser) {
            console.log("User already registered");
            return res.status(400).json({ message: "User already registered" });
        }

        // * Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // * Create new user
        const newUser = await StudentModel.create({ name, email, password: hashedPassword });
        console.log("User registered successfully:", newUser);
        res.status(201).json({ success: true, user: newUser });

    } catch (error) {
        console.error("⚠️ Registration Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // * Check if user exists
        const user = await StudentModel.findOne({ email });
        if (!user) {
            console.log("⚠️ No user found with this email:", email);
            return res.status(404).json({ message: "No user found with this email" });
        }

        console.log("🔍 Entered Password:", password);
        console.log("🔑 Stored Hashed Password:", user.password);

        // * Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔄 Password Match Status:", isMatch);

        if (!isMatch) {
            console.log("❌ Incorrect password entered.");
            return res.status(401).json({ message: "Incorrect password" });
        }

        console.log("✅ Login successful");
        res.status(200).json({ message: "Login successful", user });

    } catch (error) {
        console.error("⚠️ Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

