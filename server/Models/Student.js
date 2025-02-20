const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

/* 
 * ! Pre-save Hook: Hash password before storing in the database
 * --------------------------------------------------------------
 * * Runs before saving a student document
 * * Hashes the password using bcrypt (salt rounds: 10)
 * * Skips hashing if password is not modified
 */
StudentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

/* 
 * ! Compare Password Method
 * ---------------------------
 * * Compares user-entered password with the stored hashed password
 * * Returns true if passwords match, otherwise false
 * 
 * ? @param {string} enteredPassword - Password entered by the user during login
 * ? @returns {Promise<boolean>} - True if password is correct, otherwise false
 */
StudentSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

/* 
 * ! Student Model
 * ----------------
 * * Collection Name: students
 * * Exports model for use in other parts of the application
 */
const StudentModel = mongoose.model('students', StudentSchema);

module.exports = StudentModel;
