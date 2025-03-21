import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import SignInImage from "../assets/loginimg.jpg";
import "../styles/signin.css";
import Logo from "../assets/Logo2.png";
import { validateEmail, validatePassword } from "../utils/validate.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        const sanitizedEmail = sanitizeInput(e.target.value.trim());
        setEmail(sanitizedEmail);
        setErrors((prev) => ({ ...prev, email: validateEmail(sanitizedEmail) }));
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value.trim());
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setLoading(true);

        const newErrors = {
            email: validateEmail(email),
            password: validatePassword(password),
        };

        if (Object.values(newErrors).some((error) => error !== "")) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post(
                "/api/authRoutes/signin",
                { email, password },
                { withCredentials: true }
            );

            const { accessToken } = response.data;
            if (accessToken) {
                localStorage.setItem("accessToken", accessToken);
            }

            setSuccessMessage("✅ Login successful! Redirecting...");
            setTimeout(() => navigate("/success"), 2000);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "⚠️ Server error! Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-box">
                <div className="signin-image-container">
                    <img src={SignInImage} alt="Illustration" />
                </div>

                <div className="signin-form">
                    <img src={Logo} alt="Project Logo" className="signin-logo" />
                    <h2>Welcome Back!</h2>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}

                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                        {errors.email && <p className="error-text">{errors.email}</p>}

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        {errors.password && <p className="error-text">{errors.password}</p>}

                        <button type="submit" className="signin-btn" disabled={loading}>
                            {loading ? <span className="spinner"></span> : "Login"}
                        </button>
                    </form>

                    <p className="back-to-login">
                        Don't have an account? <Link to="/register" className="link">Sign Up</Link>
                    </p>
                    <p >
                        <Link to="/resetpassword" className="link">Forgot Password?</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
