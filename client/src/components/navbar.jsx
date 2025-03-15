import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; // Keep your styles in a separate CSS file

import { FaBars, FaTimes } from "react-icons/fa"; // For mobile menu icons

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle menu for mobile
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          Maths VLab
        </Link>

        {/* Hamburger Menu for Mobile */}
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={toggleMenu}>Home</Link>
          </li>
          <li>
            <Link to="/about" onClick={toggleMenu}>About Us</Link>
          </li>
          <li>
            <Link to="/contact" onClick={toggleMenu}>Contact</Link>
          </li>
          <li>
            <Link to="/register" onClick={toggleMenu}>Sign Up</Link>
          </li>
          <li>
            <Link to="/signin" onClick={toggleMenu}>Sign In</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
