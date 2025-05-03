import React, { useState, useEffect } from "react";
import "../styles/sidebar.css"; // Import CSS
import { FaBars, FaTimes, FaRulerCombined, FaSuperscript } from "react-icons/fa";
import { GiCalculator } from "react-icons/gi";
import { MdAutoGraph } from "react-icons/md";
import { TbMathFunction, TbMathIntegral } from "react-icons/tb";
import { FaChalkboardTeacher } from "react-icons/fa";

const categories = [
  { title: "Arithmetic", icon: <GiCalculator /> },
  { title: "Geometry", icon: <FaRulerCombined /> },
  { title: "Trigonometry", icon: <FaSuperscript /> },
  { title: "Algebra", icon: <TbMathFunction /> },
  { title: "Discrete Mathematics", icon: <MdAutoGraph /> },
  { title: "Calculus", icon: <TbMathIntegral /> },
  { title: "DSA", icon: <MdAutoGraph /> },     
  { title: "Aptitude", icon: <GiCalculator /> }, 
];

const Sidebar = ({ onSelectDomain }) => {
  const [active, setActive] = useState(null);
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);  // Ensure it's closed when resizing to mobile
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelect = (title) => {
    setActive(title);
    onSelectDomain(title);
    if (window.innerWidth <= 768) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="menu-icon" 
        onClick={() => setIsOpen(!isOpen)} 
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <nav className={`sidebar ${isOpen ? "open" : "closed"}`} aria-label="Main navigation">
        <h2 className="sidebar-title"><FaChalkboardTeacher/> Maths VLab</h2>
        <ul className="sidebar-menu">
          {categories.map(({ title, icon }) => (
            <li
              key={title}
              className={`sidebar-item ${active === title ? "active" : ""}`}
              onClick={() => handleSelect(title)}
              role="button"
              tabIndex={0}
              aria-label={`Select ${title}`}
            >
              <span className="icon">{icon}</span>
              <span className="category-title">{title}</span>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
