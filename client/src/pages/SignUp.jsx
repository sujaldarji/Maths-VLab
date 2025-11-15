import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SignUpImage from "../assets/signupimage.jpg";
import "../styles/signup.css";
import Logo from "../assets/Logo2.png";
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from "../utils/validate.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";

function SignUp() {
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student" // Default role
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle role selection
    const handleRoleChange = (role) => {
        setFormData({ ...formData, role });
    };

    // Handle Form Submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccessMessage("");
        setErrors({});
        setLoading(true);

        // Sanitize inputs before validation
        const sanitizedData = {
            name: sanitizeInput(formData.name.trim()),
            email: sanitizeInput(formData.email.trim()),
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            role: formData.role
        };

        // Perform validation
        const newErrors = {
            name: validateName(sanitizedData.name),
            email: validateEmail(sanitizedData.email),
            password: validatePassword(sanitizedData.password),
            confirmPassword: validateConfirmPassword(sanitizedData.password, sanitizedData.confirmPassword),
        };

        if (Object.values(newErrors).some((error) => error !== "")) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/api/authRoutes/register`, {
                name: sanitizedData.name,
                email: sanitizedData.email,
                password: sanitizedData.password,
                role: sanitizedData.role
            });

            if (sanitizedData.role === "teacher") {
                setSuccessMessage("✅ Sign-up successful! Your account is pending admin approval. Redirecting...");
            } else {
                setSuccessMessage("✅ Sign-up successful! Redirecting...");
            }
            
            setTimeout(() => navigate("/signin"), 3000);
        } catch (error) {
            setErrors({
                form: error.response?.data?.message || "⚠️ Server error! Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                {/* Left Panel with Image */}
                <div className="signup-left-panel">
                    <img src={SignUpImage} alt="Illustration" />
                </div>

                {/* Right Panel with Sign-up Form */}
                <div className="signup-right-panel">
                    <img src={Logo} alt="Project Logo" className="signup-logo" />
                    <h2>Create an Account</h2>

                    {errors.form && <p className="error-message">{errors.form}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}

                    {/* Sign-up Form */}
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Full Name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                        {errors.name && <p className="error-message">{errors.name}</p>}

                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}

                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>}

                        <input 
                            type="password" 
                            name="confirmPassword" 
                            placeholder="Confirm Password" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            required 
                        />
                        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

                        {/* Role Selection */}
                        <div className="role-selection">
                            <label className="role-label">I am a:</label>
                            <div className="role-options">
                                <button
                                    type="button"
                                    className={`role-btn ${formData.role === 'student' ? 'active' : ''}`}
                                    onClick={() => handleRoleChange('student')}
                                >
                                    <span className="role-icon">🎓</span>
                                    Student
                                </button>
                                <button
                                    type="button"
                                    className={`role-btn ${formData.role === 'teacher' ? 'active' : ''}`}
                                    onClick={() => handleRoleChange('teacher')}
                                >
                                    <span className="role-icon">👨‍🏫</span>
                                    Teacher
                                </button>
                            </div>
                        </div>

                        {formData.role === 'teacher' && (
                            <div className="teacher-note">
                                <p>📝 Teacher accounts require admin approval before you can access all features.</p>
                            </div>
                        )}

                        <button type="submit" className="signup-btn" disabled={loading}>
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>

                    <p className="back-to-login">
                        Already have an account? <Link to="/signin" className="link">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;