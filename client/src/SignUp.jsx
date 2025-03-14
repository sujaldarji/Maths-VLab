import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SignUpImage from "./assets/signUp.jpg";
import "./styles/Auth.css";
import Logo from './assets/logo2.png';
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from "./utils/validations.js"; // Import updated validation

function SignUp() {
    // * State Variables
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ! Handle Form Submission (Validation happens here)
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccessMessage("");
        setErrors({});
        setLoading(true);

        // * Perform validation on submit
        const newErrors = {
            name: validateName(name),
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword: validateConfirmPassword(password, confirmPassword),
        };

        // * If there are validation errors, prevent submission
        if (Object.values(newErrors).some((error) => error !== "")) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            await axios.post("http://localhost:3001/signup", { name, email, password });

            setSuccessMessage("✅ Sign-up successful! Redirecting...");
            setTimeout(() => navigate("/success"), 2000);
        } catch (error) {
            setErrors({ form: error.response?.data?.message || "⚠️ Server error! Please try again later." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                
                {/* Left Panel with Image */}
                <div className="left-panel">
                    <img src={SignUpImage} alt="Illustration" />
                </div>

                {/* Right Panel with Sign-up Form */}
                <div className="right-panel">
                    <img src={Logo} alt="Project Logo" className="logo" />
                    <h2>Create an Account</h2>

                    {/* Error & Success Messages */}
                    {errors.form && <p className="error-message">{errors.form}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}

                    {/* Sign-up Form */}
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {errors.name && <p className="error-message">{errors.name}</p>}

                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}

                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>}

                        <input 
                            type="password" 
                            name="confirmPassword" 
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? <span className="spinner"></span> : "Sign Up"}
                        </button>
                    </form>

                    {/* Links for Sign-in */}
                    <p>Already have an account? <Link to="/signin" className="link">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
