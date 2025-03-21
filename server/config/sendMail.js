const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure you are loading environment variables

const sendResetEmail = async (email, resetToken) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS  // Your Gmail app password
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "🔐 Reset Your Password - Maths VLab",
            text: `Hello,
        
        We received a request to reset your password for your Maths VLab account. Click the link below to set a new password:
        
        🔗 Reset Link: http://localhost:5173/reset-password?token=${resetToken}
        ⚠️ This link will expire in 15 minutes for security reasons. If you did not request a password reset, please ignore this email.
        
        Stay secure,
        The Maths VLab Team`,
        };

        // http://localhost:5173/reset-password/${resetToken}
                
        // 🔗 Reset Link: http://localhost:5173/reset-password/${resetToken}
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
        return true;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return false;
    }
};

module.exports = sendResetEmail;
