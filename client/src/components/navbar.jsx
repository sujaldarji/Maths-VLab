<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "../styles/navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/Logo1.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to check authentication status
  const checkAuth = useCallback(async () => {
    if (isLoggingOut) return; // Prevent auth check during logout
    if (location.pathname === "/signin") return; // Prevent loop if already on signin page

    const storedAccessToken = localStorage.getItem("accessToken");
    if (!storedAccessToken) {
      console.log("❌ No access token, skipping auth check.");
      setIsAuthenticated(false);
      setUsername("");
      return;
    }

    try {
      console.log("🔍 Checking authentication...");
      const response = await axiosInstance.get("/api/userRoutes/auth-status", { withCredentials: true });

      if (response.data.authenticated) {
        console.log("✅ Authenticated:", response.data.user.name);
        setIsAuthenticated(true);
        setUsername(response.data.user.name);
      } else {
        console.log("❌ Not authenticated");
        setIsAuthenticated(false);
        setUsername("");
      }
    } catch (error) {
      console.error("⚠️ Auth check failed:", error.response?.data || error.message);
      setIsAuthenticated(false);
      setUsername("");
    }
  }, [isLoggingOut, location.pathname]);

  // Run authentication check when route changes
  useEffect(() => {
    checkAuth();
  }, [location, checkAuth]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true); // Prevent auth check while logging out

      await axiosInstance.post("/api/tokenRoutes/logout", {}, { withCredentials: true });

      console.log("✅ Logged out successfully");

      // Clear auth state & token
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      setUsername("");

      setTimeout(() => {
        setIsLoggingOut(false);
        navigate("/signin"); // Redirect AFTER updating state
      }, 500);
    } catch (error) {
      console.error("❌ Logout failed:", error.response?.data || error.message);
      setIsLoggingOut(false);
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
=======
import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "../styles/Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/Logo1.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to check authentication status
  const checkAuth = useCallback(async () => {
    if (isLoggingOut) return; // Prevent auth check during logout
    if (location.pathname === "/signin") return; // Prevent loop if already on signin page

    const storedAccessToken = localStorage.getItem("accessToken");
    if (!storedAccessToken) {
      console.log("❌ No access token, skipping auth check.");
      setIsAuthenticated(false);
      setUsername("");
      return;
    }

    try {
      console.log("🔍 Checking authentication...");
      const response = await axiosInstance.get("/api/userRoutes/auth-status", { withCredentials: true });

      if (response.data.authenticated) {
        console.log("✅ Authenticated:", response.data.user.name);
        setIsAuthenticated(true);
        setUsername(response.data.user.name);
      } else {
        console.log("❌ Not authenticated");
        setIsAuthenticated(false);
        setUsername("");
      }
    } catch (error) {
      console.error("⚠️ Auth check failed:", error.response?.data || error.message);
      setIsAuthenticated(false);
      setUsername("");
    }
  }, [isLoggingOut, location.pathname]);

  // Run authentication check when route changes
  useEffect(() => {
    checkAuth();
  }, [location, checkAuth]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true); // Prevent auth check while logging out

      await axiosInstance.post("/api/tokenRoutes/logout", {}, { withCredentials: true });

      console.log("✅ Logged out successfully");

      // Clear auth state & token
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      setUsername("");

      setTimeout(() => {
        setIsLoggingOut(false);
        navigate("/signin"); // Redirect AFTER updating state
      }, 500);
    } catch (error) {
      console.error("❌ Logout failed:", error.response?.data || error.message);
      setIsLoggingOut(false);
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
>>>>>>> 59d7a14 (sample content for algebra topic)
