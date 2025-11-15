import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/navbar";
import Dashboard from "./components/Dashboard";
import LandingPage from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgetPassword from "./pages/ForgetPassword";
import About from "./pages/About";
import ContactUs from "./pages/Contact";
import ResetPassword from "./pages/ResetPassword";
import StudyPage from "./pages/StudyPage";
import Graph from "./pages/GraphPageSimulationDemo";
import AdminDashboard from './pages/admin/adminDashboard';
import AdminTeachers from './pages/admin/adminTeachers';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './pages/Unauthorized';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/resetpassword" element={<ForgetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Routes - Any authenticated user */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/study/:topicId" 
          element={
            <ProtectedRoute>
              <StudyPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/graph" 
          element={
            <ProtectedRoute>
              <Graph />
            </ProtectedRoute>
          } 
        />

        {/* Admin Only Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/teachers" 
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminTeachers />
            </ProtectedRoute>
          } 
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;