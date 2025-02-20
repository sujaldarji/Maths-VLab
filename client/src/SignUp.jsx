import React from "react";
import { Link } from 'react-router-dom';
import SignUpImage from './assets/signUp.jpg'
import './SignUp.css'

function SignUp() {

    return (

        <div className="container">
            <div className="left-panel">
                <img src={SignUpImage} alt="Illustration" />
            </div>
            <div className="right-panel">
                <img src="" alt="Project Logo" className="logo" />
                <h2>Create an Account</h2>
                <form>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Full Name" 
                        required />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        required />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" />
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="Confirm Password" 
                        required />
                    <button type="submit" className="btn">Sign Up</button>
                </form>
                <p>Already have an account?<Link to="/signin" className="link">Sign In</Link></p>
            </div>
        </div>
    )
    
}

export default SignUp;
