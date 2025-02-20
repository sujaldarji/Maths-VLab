import React from "react";
import { Link } from 'react-router-dom';
import SignInImage from './assets/signIn.jpg'
import './SignIn.css'

function SignIn() {

    return (
        <div className="container">
            <div className="left-panel">
                <img src={SignInImage} alt="Illustration" />
            </div>
            <div className="right-panel">
                <img src="" alt="Project Logo" className="logo" />
                <h2>Welcome Back!</h2>
                <form action="login" method="get">
                    <input 
                        type="text" 
                        name="email" 
                        placeholder="Email" 
                        required />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        required />                        
                    <button type="submit" className="btn">Login</button>
                </form>
                <p>Don't have an account yet? <Link to="/register" className="link">Sign Up</Link></p>
                <p><Link to="/resetpassword" className="link">Forgot Password?</Link></p>
            </div>
        </div>

    )    
}

export default SignIn;