const mongoose = require('mongoose');

/* 
 * ! Student Schema Definition
 * ----------------------------
 * * name: Student's full name (Required)
 * * email: Student's email (Required, Unique, Valid format)
 * * password: Student's hashed password (Required)
 * * timestamps: Automatically adds createdAt & updatedAt fields
 */

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
}, { timestamps: true });


const StudentModel = mongoose.model('students', StudentSchema);

module.exports = StudentModel;
