import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

import SignUp from './SignUp';
import SignIn from './SignIn';
import ForgetPassword from './ForgetPassword';
import LandingPage from './LandingPage';
import Success from './success';
import About from './AboutUs';

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
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/resetpassword" element={<ForgetPassword />} />
                <Route path="/success" element={<Success />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
