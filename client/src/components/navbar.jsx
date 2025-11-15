import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaHome, FaInfoCircle, FaEnvelope, FaUserShield, FaChalkboardTeacher } from "react-icons/fa";
import logo from "../assets/Logo2.png";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState({
    isAuthenticated: false,
    username: "",
    role: "",
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

  // Simplified authentication check using localStorage
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (!token || !userData.role) {
        setUser({ isAuthenticated: false, username: "", role: "", isLoading: false });
        return;
      }

      // Use localStorage data directly (faster)
      setUser({
        isAuthenticated: true,
        username: userData.name || userData.email?.split("@")[0] || "User",
        role: userData.role,
        isLoading: false
      });

      // Optional: Verify with backend in background
      try {
        await axiosInstance.get("/api/userRoutes/verify-token");
      } catch (error) {
        console.log("Token verification failed, using cached data");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser({ isAuthenticated: false, username: "", role: "", isLoading: false });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [location.pathname, checkAuth]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/tokenRoutes/logout", {}, { 
        withCredentials: true
      });
    } catch (error) {
      console.log("Logout API call failed, clearing local data anyway");
    } finally {
      // Always clear local data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      setUser({ isAuthenticated: false, username: "", role: "", isLoading: false });
      navigate("/", { replace: true });
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

  // Role-based navigation items
  const getNavItems = () => {
    const baseItems = [
      { path: "/", label: "Home", icon: <FaHome />, show: true },
      { path: "/about", label: "About", icon: <FaInfoCircle />, show: true },
      { path: "/contact", label: "Contact", icon: <FaEnvelope />, show: true },
    ];

    // Role-specific dashboard links
    const dashboardItems = [
      { 
        path: "/dashboard", 
        label: "Dashboard", 
        icon: <FaChalkboardTeacher />, 
        show: user.isAuthenticated && ["student", "teacher"].includes(user.role),
        title: "Learning Dashboard"
      },
      { 
        path: "/admin", 
        label: "Admin", 
        icon: <FaUserShield />, 
        show: user.isAuthenticated && user.role === "admin",
        title: "Admin Dashboard"
      }
    ];

    return [...baseItems, ...dashboardItems].filter(item => item.show);
  };

  const navItems = getNavItems();

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`} ref={menuRef}>
      <div className="navbar-container container">
        <Link to="/" className="logo" aria-label="Maths VLab Home">
          <img src={logo} alt="Maths VLab Logo" width="40" height="40" />
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
                  title={item.title || item.label}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="auth-section">
            {user.isAuthenticated ? (
              <div className="user-menu">
                <span className="welcome-msg">
                  <FaUser className="user-icon" aria-hidden="true" />
                  <span className="user-info">
                    {user.username}
                    <span className="user-role">{user.role}</span>
                  </span>
                </span>
                <button
                  className="logout-btn"
                  onClick={handleLogout}
                  disabled={user.isLoading}
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