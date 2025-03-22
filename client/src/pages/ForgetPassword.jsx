import { useState } from "react";
import "../styles/forgetpassword.css";
import Logo from '../assets/logo2.png';
import fvector from '../assets/fpwd.jpg';
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false); // Track submission state
    const [loading, setLoading] = useState(false); // ✅ Track loading state

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            alert("Please enter a valid email.");
            return;
        }

        setLoading(true); // ✅ Start loading
        try {
            const response = await axios.post("http://localhost:3001/api/send-reset-link", { email });

            if (response.status === 200) {
                setIsSubmitted(true); // Hide form & show success message
            } else {
                alert("Failed to send reset link. Try again.");
            }
        } catch (error) {
            console.error("Error sending reset link:", error);
            alert(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false); // ✅ Stop loading
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                {/* Project Logo */}
                <img 
                    src={Logo} 
                    alt="Project Logo" 
                    className="logo"  
                    style={{ width: "40%", height: "10%", maxHeight: "100px", marginTop: "0px" }} 
                />

                <h2>Forgot Your Password?</h2>

                {!isSubmitted ? (
                    <>
                        <p>Enter your email address below and we'll send you a link to reset your password.</p>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                            <button type="submit" disabled={loading} className="sbutton">
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>
                    </>
                ) : (
                    <p className="success-message">✅ Reset link sent! Check your email.</p>
                )}

                {/* Back to Login */}
                <p className="back-to-login">
                    <a href="/signin">Back to Login</a>
                </p>

                {/* Vector Image */}
                <div className="vector-container">
                    <img src={fvector} alt="Secure Login" />
                </div>
            </div>
        </div>
    );
};
export default ForgotPassword;
