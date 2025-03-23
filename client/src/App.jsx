import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css"; 

import SignUp from './pages/SignUp';
import ContactUs from './pages/Contact';
import SignIn from './pages/SignIn';
import ForgetPassword from './pages/ForgetPassword';
import LandingPage from './pages/Home';
import Success from './pages/success';
import About from './pages/About';
import Navbar from "./components/navbar";
import ResetPassword from "./pages/ResetPassword"; 

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
                  {/* <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
                <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
