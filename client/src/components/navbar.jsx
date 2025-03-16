import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import "../styles/Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/Logo1.png"; // Import your logo image

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation(); // Get the current route

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo on the left */}
        <Link to="/" className="logo">
          <img src={logo} alt="Maths VLab Logo" />
        </Link>

        {/* Hamburger Menu for Mobile */}
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
          <li
            className="dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setTimeout(() => setDropdownOpen(false), 300)}
          >
            <span>Student Corner</span>
            {dropdownOpen && (
              <ul className="dropdown-menu" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                <li><a href="#">Option 1</a></li>
                <li><a href="#">Option 2</a></li>
                <li><a href="#">Option 3</a></li>
                <li><a href="#">Option 4</a></li>
              </ul>
            )}
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

        {/* Login Button on the extreme right */}
        <Link to="/signin" className="login-btn">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
