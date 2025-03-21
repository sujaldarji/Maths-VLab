const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
    },
    resetToken: { 
        type: String, 
        default: null // ✅ Stores the password reset token
    },
    resetTokenExpiry: { 
        type: Date, 
        default: null // ✅ Expiration time for reset link
    },
}, { timestamps: true });


const StudentModel = mongoose.model('students', StudentSchema);

module.exports = StudentModel;
