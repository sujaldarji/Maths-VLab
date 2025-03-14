const { body, validationResult } = require('express-validator');

// * Validation rules for Sign Up
const validateSignUp = [
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
        .withMessage("Password must be at least 6 characters long."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// * Validation rules for Sign In
const validateSignIn = [
    body("email").trim().isEmail().withMessage("Invalid email format."),
    body("password").trim().notEmpty().withMessage("Password cannot be empty."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateSignUp, validateSignIn };
