import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SignInImage from "./assets/signIn.jpg";
import "./SignIn.css";

function SignIn() {
    // * State Variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false); // * State for loading spinner
    const navigate = useNavigate();

    // ! Handle Form Submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setLoading(true); // * Show spinner
    
        try {
            const response = await axios.post("http://localhost:3001/signin", { email, password });
    
            setSuccessMessage("✅ Login successful! Redirecting...");
            setTimeout(() => navigate("/success"), 2000);
        } catch (error) {
            if (error.response && error.response.data.message) {
                // If backend sent a meaningful error message
                setErrorMessage(`⚠️ ${error.response.data.message}`);
            } else {
                // Generic error message for unexpected issues
                setErrorMessage("⚠️ Server error! Please try again later.");
            }
        } finally {
            setLoading(false); // * Hide spinner after response
        }
    };
    

    return (
        <div className="container">
            {/* Left Panel with Image */}
            <div className="left-panel">
                <img src={SignInImage} alt="Illustration" />
            </div>

            {/* Right Panel with Sign-in Form */}
            <div className="right-panel">
                <img src="" alt="Project Logo" className="logo" />
                <h2>Welcome Back!</h2>

                {/* Error & Success Messages */}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                {/* Sign-in Form */}
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="email" 
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />                        
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? <span className="spinner"></span> : "Login"}
                    </button>
                </form>

                {/* Links for Sign-up and Reset Password */}
                <p>Don't have an account yet? <Link to="/register" className="link">Sign Up</Link></p>
                <p><Link to="/resetpassword" className="link">Forgot Password?</Link></p>
            </div>
        </div>
    );
}

export default SignIn;
