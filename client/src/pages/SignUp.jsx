import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SignUpImage from "../assets/SignUp.jpg";
import "../styles/Auth.css";
import Logo from "../assets/Logo1.png";
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from "../utils/validate.js";
import { sanitizeInput } from "../utils/sanitizeInput.js"; // Import sanitization function

function SignUp() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // * Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ! Handle Form Submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccessMessage("");
        setErrors({});
        setLoading(true);

        // * Sanitize inputs before validation
        const sanitizedData = {
            name: sanitizeInput(formData.name.trim()),
            email: sanitizeInput(formData.email.trim()),
            password: formData.password, // No sanitization for passwords
            confirmPassword: formData.confirmPassword,
        };

        // * Perform validation
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
            await axios.post("http://localhost:3001/api/authRoutes/register", {
                name: sanitizedData.name,
                email: sanitizedData.email,
                password: sanitizedData.password,
            });

            setSuccessMessage("✅ Sign-up successful! Redirecting...");
            setTimeout(() => navigate("/signin"), 2000);
        } catch (error) {
            setErrors({
                form: error.response?.data?.message || "⚠️ Server error! Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container"  data-aos="fade-up" data-aos-duration="1000">
            <div className="auth-box">
                {/* Left Panel with Image */}
                <div className="left-panel">
                    <img src={SignUpImage} alt="Illustration" />
                </div>

                {/* Right Panel with Sign-up Form */}
                <div className="right-panel">
                    <img src={Logo} alt="Project Logo" className="logo" />
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

                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? <span className="spinner"></span> : "Sign Up"}
                        </button>
                    </form>

                    <p>Already have an account? <Link to="/signin" className="link">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
