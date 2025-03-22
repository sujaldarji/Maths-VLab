const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Create Email Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ✅ Function to Send Reset Password Email
const sendResetEmail = async (email, resetToken) => {
    try {
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

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Reset Email sent:", info.response);
        return true;
    } catch (error) {
        console.error("❌ Error sending reset email:", error);
        return false;
    }
};

// ✅ Function to Send Contact Form Email
const sendContactEmail = async (name, email, message) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: "📩 New Contact Form Submission - Maths VLab",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <h2 style="color: #4f46e5; text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">📩 New Contact Form Submission</h2>
                    
                    <p style="font-size: 16px; color: #555;">You have received a new message from a user on <strong>Maths VLab</strong>.</p>
        
                    <div style="padding: 15px; background: #fff; border-radius: 8px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);">
                        <p style="font-size: 16px;"><strong>📛 Name:</strong> ${name}</p>
                        <p style="font-size: 16px;"><strong>✉️ Email:</strong> <a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></p>
                        <p style="font-size: 16px;"><strong>💬 Message:</strong></p>
                        <div style="background: #f3f3f3; padding: 10px; border-radius: 5px; font-size: 14px; color: #333;">
                            ${message}
                        </div>
                    </div>
        
                    <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">
                        📌 This is an automated notification from <strong>Maths VLab</strong>. Please do not reply to this email.
                    </p>
        
                    <div style="text-align: center; margin-top: 10px;">
                        <a href="mailto:${email}" style="background: #4f46e5; color: white; text-decoration: none; padding: 10px 15px; border-radius: 5px; display: inline-block; font-size: 14px;">📩 Reply to ${name}</a>
                    </div>
                </div>
            `,
        };
        

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Contact Email sent:", info.response);
        return true;
    } catch (error) {
        console.error("❌ Error sending contact email:", error);
        return false;
    }
};

// ✅ Export Both Functions Correctly
module.exports = { sendResetEmail, sendContactEmail };
