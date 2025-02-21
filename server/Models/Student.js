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
        required: [true, 'Name is required'] 
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true, 
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'] 
    }
}, { timestamps: true });


const StudentModel = mongoose.model('students', StudentSchema);

module.exports = StudentModel;
