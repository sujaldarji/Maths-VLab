const express = require("express");
const router = express.Router();
const { sanitizeMiddleware } = require("../middlewares/sanitizeMiddleware");
const { validateContactForm } = require("../middlewares/validateMiddleware");
const Contact = require("../Models/Contact");
const { sendContactEmail } = require("../config/sendMail"); // ✅ Import function

// Contact Form Submission Route
router.post("/", sanitizeMiddleware, validateContactForm, async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // ✅ Save message to Database
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        // ✅ Send email to Admin
        const emailSent = await sendContactEmail(name, email, message);

        if (emailSent) {
            res.status(201).json({ success: true, message: "Message sent successfully!" });
        } else {
            res.status(500).json({ success: false, message: "Message saved, but email failed to send." });
        }
    } catch (error) {
        console.error("❌ Error processing contact form:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;
