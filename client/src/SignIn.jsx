import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SignInImage from "./assets/signIn.jpg";
import "./styles/Auth.css";
import Logo from "./assets/logo2.png";
import { validateEmail, validatePassword } from "./utils/validations.js";
import { sanitizeInput } from "./utils/sanitize.js";


function SignIn() {
    // * State Variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "" }); // * Track validation errors
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ! Handle Form Submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setLoading(true);

        // * Perform validation on submit
        const newErrors = {
            email: validateEmail(email),
            password: validatePassword(password),
        };

        // * If there are validation errors, prevent submission
        if (Object.values(newErrors).some((error) => error !== "")) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:3001/signin", { email, password });

            setSuccessMessage("✅ Login successful! Redirecting...");
            setTimeout(() => navigate("/success"), 2000);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "⚠️ Server error! Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container"  data-aos="fade-up" data-aos-duration="1000">
            <div className="auth-box">
                {/* Left Panel with Image */}
                <div className="left-panel">
                    <img src={SignInImage} alt="Illustration" />
                </div>

                {/* Right Panel with Sign-in Form */}
                <div className="right-panel">
                    <img src={Logo} alt="Project Logo" className="logo" />
                    <h2>Welcome Back!</h2>

                    {/* Error & Success Messages */}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}

                    {/* Sign-in Form */}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"  // ✅ Change from "text" to "email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(sanitizeInput(e.target.value.trim()))} // ✅ Sanitize input
                            required
                        />
                        {errors.email && <p className="error-text">{errors.email}</p>} 

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value.trim())} // ✅ Trim unnecessary spaces
                            required
                        />
                        {errors.password && <p className="error-text">{errors.password}</p>} 

                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? <span className="spinner"></span> : "Login"}
                        </button>
                    </form>


                    {/* Links for Sign-up and Reset Password */}
                    <p>
                        Don't have an account yet? <Link to="/register" className="link">Sign Up</Link>
                    </p>
                    <p>
                        <Link to="/resetpassword" className="link">Forgot Password?</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
