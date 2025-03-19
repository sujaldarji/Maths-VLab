const express = require("express");
const router = express.Router();
const { sanitizeMiddleware } = require("../middlewares/sanitizeMiddleware");
const { validateContactForm } = require("../middlewares/validateMiddleware");
const Contact = require("../Models/Contact");

// Contact Form Submission Route
router.post("/", sanitizeMiddleware, validateContactForm, async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Save to Database
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        res.status(201).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error("Error saving contact form data:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;
