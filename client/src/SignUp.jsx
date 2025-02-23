import React, { useState } from "react";
import { Link } from 'react-router-dom';
import SignUpImage from './assets/signUp.jpg';
import './styles/Auth.css';
import axios from 'axios';
import Logo from './assets/logo2.png';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(""); // State to store feedback messages
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post('http://localhost:3001/register', { name, email, password });
        
            // Success case
            setMessage("✅ Registered successfully! Redirecting...");
            setTimeout(() => navigate('/signin'), 2000);
        } catch (error) {
            if (error.response && error.response.data.message) {
                // If backend sent a meaningful error message
                setMessage(`⚠️ ${error.response.data.message}`);
            } else {
                // Generic error message
                setMessage("❌ An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
        
    };

    return (
        <div className="auth-container">
        <div className="auth-box">
            <div className="left-panel">
                <img src={SignUpImage} alt="Illustration" />
            </div>
            <div className="right-panel">
                <img src={Logo} alt="Project Logo" className="logo" />
                <h2>Create an Account</h2>
                
                {message && <p className="message">{message}</p>} {/* Display feedback message */}

                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Full Name" 
                        onChange={(e) => setName(e.target.value)}
                        required 
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="Confirm Password" 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required 
                    />

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                <p>Already have an account? <Link to="/signin" className="link">Sign In</Link></p>
            </div>
        </div>
        </div>
    );
}

export default SignUp;
