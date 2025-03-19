// Validate Name (Only alphabets and spaces, 3 to 50 characters)
export const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]{3,50}$/;
    return nameRegex.test(name) ? "" : "Name should contain only alphabets and spaces (3-50 characters).";
};

// Validate Email
export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email.trim().match(emailRegex) ? "" : "Invalid email format.";
};


// Validate Password (Min 6 characters, at least 1 letter and 1 number)
export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password) 
        ? "" 
        : "Password must be at least 6 characters long and include at least 1 letter and 1 number.";
};

// Validate Confirm Password
export const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword ? "" : "Passwords do not match.";
};

// Validate Message (Min 10 characters, max 1000 characters)
export const validateMessage = (message) => {
    return message.trim().length >= 10 && message.trim().length <= 1000 
        ? "" 
        : "Message must be between 10 and 1000 characters.";
};