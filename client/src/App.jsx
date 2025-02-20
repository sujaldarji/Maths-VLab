import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';
import ForgetPassword from './ForgetPassword';
import LandingPage from './LandingPage';
import Success from './success';


function App() {
  
    return (
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<LandingPage/>} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/resetpassword" element={<ForgetPassword />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        
        </BrowserRouter> 
        
            
    );
}

export default App;
