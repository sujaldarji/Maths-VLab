import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; // Use axiosInstance
import "../styles/Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/Logo1.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Function to check authentication status
  const checkAuth = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/user/auth-status"); // Changed to correct endpoint
      if (response.data.authenticated) {
        setIsAuthenticated(true);
        setUsername(response.data.user.name);
      } else {
        setIsAuthenticated(false);
        setUsername("");
      }
    } catch (error) {
      console.warn("Auth check failed:", error.response?.data || error.message);
      setIsAuthenticated(false);
      setUsername("");
    }
  }, []);

  // Run authentication check when route changes
  useEffect(() => {
    checkAuth();
  }, [location, checkAuth]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout", {}, { withCredentials: true }); // Ensure cookies are cleared

      // Clear authentication state
      setIsAuthenticated(false);
      setUsername("");
      localStorage.removeItem("accessToken");

      // Navigate to Sign In page
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src={logo} alt="Maths VLab Logo" />
        </Link>

        {/* Mobile Menu Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={toggleMenu} className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={toggleMenu} className={location.pathname === "/about" ? "active" : ""}>
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={toggleMenu} className={location.pathname === "/contact" ? "active" : ""}>
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Authentication Section */}
        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <span className="username">Hi, {username}!</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/signin" className="login-btn">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
