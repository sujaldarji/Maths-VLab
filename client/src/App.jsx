import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css"; 

import SignUp from './SignUp';
import ContactUs from './ContactUs';
import SignIn from './SignIn';
import ForgetPassword from './ForgetPassword';
import LandingPage from './LandingPage';
import Success from './success';
import About from './AboutUs';
import Navbar from "./components/navbar";

function App() {
    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration in milliseconds
            once: true, // Ensures animation runs only once per scroll
            easing: "ease-in-out", // Smooth animation
        });
    }, []);

    return (
        <BrowserRouter>
        
        <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/resetpassword" element={<ForgetPassword />} />
                <Route path="/success" element={<Success />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<ContactUs />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
