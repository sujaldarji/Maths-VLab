import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ResetPassword.css"; 
import resetVector from "../assets/resetVector.jpg";  // 🎨 Add an illustration

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setMessage("❌ Invalid or expired reset link.");
            return;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password)) {
            setMessage("⚠️ Password must be at least 6 characters long and include at least one letter and one number.");
            return;
        }
        
        if (password !== confirmPassword) {
            setMessage("❌ Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3001/api/reset-password", { token, password });

            if (response.status === 200) {
                setMessage("✅ Password reset successfully! Redirecting...");
                setTimeout(() => navigate("/signin", { replace: true }), 2000);
            }
        } catch (error) {
            setMessage("❌ Failed to reset password. Try again.");
            console.error("Reset Password Error:", error);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-box">
                {/* 🎨 Add Illustration */}
                <div className="vector-container">
                    <img src={resetVector} alt="Reset Password" />
                </div>

                <h2>🔒 Set Your New Password</h2>
                {message && <p className="message">{message}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="sbutton">Reset Password</button>
                </form>
                
                <p className="back-to-login">
                    <a href="/signin">🔙 Back to Login</a>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
