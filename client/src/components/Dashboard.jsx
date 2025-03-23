import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import topicsData from "../data/topicsList";
import Sidebar from "./Sidebar"; // Import Sidebar
import { FaStar, FaRegSadCry } from "react-icons/fa"; // Import icons
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; // Use axiosInstance
const difficultyIcons = {
  Beginner: <FaStar style={{ color: "#27ae60" }} />,
  Intermediate: <FaStar style={{ color: "#f39c12" }} />,
  Advanced: <FaStar style={{ color: "#c0392b" }} />,
};

const Dashboard = () => {


  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
      const fetchProtectedData = async () => {
          try {
              const response = await axiosInstance.get("/api/userRoutes/success"); // Uses interceptor for token refresh
              setMessage(response.data.message);
          } catch (error) {
              console.error("Auth Error:", error.response?.data || error);
              navigate("/signin"); // Redirect if not authenticated
          }
      };

      fetchProtectedData();
  }, [navigate]);



  const [selectedDomain, setSelectedDomain] = useState("Arithmetic");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  // Debounced search input for better performance
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter topics based on search input and difficulty level
  const displayedTopics = (topicsData[selectedDomain] || []).filter((topic) => {
    const matchesSearch = topic.title.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesDifficulty = difficultyFilter === "All" || topic.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar onSelectDomain={setSelectedDomain} />

      <div className="dashboard-content">
        <h2 className="dashboard-title">{selectedDomain} Topics</h2>

        {/* Search Bar & Filters */}
        <div className="dashboard-controls">
          <input
            type="text"
            placeholder="Search topics..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="filter-options">
            {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                className={`filter-btn ${difficultyFilter === level ? "active" : ""}`}
                onClick={() => setDifficultyFilter(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Topics Grid */}
        <div className="topics-grid">
          {displayedTopics.length > 0 ? (
            displayedTopics.map((topic) => (
              <div key={topic.id} className="topic-card">
                <h3 className="topic-title">{topic.title}</h3>
                <p className="topic-description">{topic.description}</p>
                <div className="topic-footer">
                <span className={`difficulty-badge ${topic.difficulty.toLowerCase()}`}>
  {difficultyIcons[topic.difficulty]} {topic.difficulty}
</span>

                  <small className="category-name">{selectedDomain}</small>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
  <FaRegSadCry size={40} style={{ color: "#ccc" }} />
  <p>No topics found. Try a different search or filter.</p>
</div>

          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
