import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaHome, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import logo from "../assets/Logo1.png";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    username: "",
    isLoading: true
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Authentication check with debounce
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setAuthState({ isAuthenticated: false, username: "", isLoading: false });
        return;
      }

      const { data } = await axiosInstance.get("/api/userRoutes/auth-status", {
        withCredentials: true,
        headers: { 'Cache-Control': 'no-cache' }
      });

      setAuthState({
        isAuthenticated: data.authenticated,
        username: data.user?.name.split(" ")[0] || "",
        isLoading: false
      });
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthState({ isAuthenticated: false, username: "", isLoading: false });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    checkAuth();
    return () => controller.abort();
  }, [location.pathname, checkAuth]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/tokenRoutes/logout", {}, { 
        withCredentials: true,
        signal: AbortSignal.timeout(5000)
      });
      localStorage.removeItem("accessToken");
      setAuthState({ isAuthenticated: false, username: "", isLoading: false });
      navigate("/signin", { replace: true });
    } catch (error) {
      if (!error.isCanceled) {
        console.error("Logout error:", error);
      }
    }
  };

  // Close menu when clicking outside or navigating
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation items config
  const navItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/about", label: "About", icon: <FaInfoCircle /> },
    { path: "/contact", label: "Contact", icon: <FaEnvelope /> },
    ...(authState.isAuthenticated ? [{ path: "/dashboard", label: "Dashboard", icon: <FaUser /> }] : [])
  ];

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`} ref={menuRef}>
      <div className="navbar-container container">
        <Link to="/" className="logo" aria-label="Maths VLab Home">
          <img src={logo} alt="" width="40" height="40" />
          <span>Maths VLab</span>
        </Link>

        <button 
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`nav-menu ${menuOpen ? "open" : ""}`}>
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? "active" : ""}
                  onClick={() => setMenuOpen(false)}
                  aria-current={location.pathname === item.path ? "page" : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="auth-section">
            {authState.isAuthenticated ? (
              <div className="user-menu">
                <span className="welcome-msg">
                  <FaUser className="user-icon" aria-hidden="true" />
                  {authState.username}
                </span>
                <button
                  className="logout-btn"
                  onClick={handleLogout}
                  disabled={authState.isLoading}
                  aria-label="Logout"
                >
                  <FaSignOutAlt aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/signin" 
                className="login-btn"
                onClick={() => setMenuOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);