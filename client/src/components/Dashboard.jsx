import React, { useState, useEffect, useMemo, useCallback } from "react";
import "../styles/dashboard.css";
import topicsData from "../data/topicsList";
import Sidebar from "./Sidebar";
import { FaStar, FaRegSadCry, FaSearch, FaFilter, FaSyncAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import useDebounce from "./useDebounce";

const difficultyIcons = {
  Beginner: <FaStar className="beginner-icon" />,
  Intermediate: <FaStar className="intermediate-icon" />,
  Advanced: <FaStar className="advanced-icon" />,
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [selectedDomain, setSelectedDomain] = useState("Arithmetic");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Set initial domain from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const domain = params.get("domain");
    if (domain && topicsData[domain]) {
      setSelectedDomain(domain);
    }
  }, [location.search]);

  // Auth verification with error handling
  const verifyAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await axiosInstance.get("/api/userRoutes/auth-status");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
      navigate("/signin");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();
    verifyAuth();
    return () => controller.abort();
  }, [verifyAuth]);

  // Memoized filtered topics
  const displayedTopics = useMemo(() => {
    return (topicsData[selectedDomain] || []).filter(topic => {
      const matchesSearch = topic.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesDifficulty = difficultyFilter === "All" || topic.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  }, [selectedDomain, debouncedSearch, difficultyFilter]);

  const handleTopicClick = useCallback((topicId) => {
    window.open(`/study/${topicId}`, '_blank', 'noopener,noreferrer');
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setDifficultyFilter("All");
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <FaSyncAlt className="loading-icon" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar 
        activeDomain={selectedDomain}
        onSelectDomain={setSelectedDomain}
      />

      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1 className="dashboard-title">
            {selectedDomain} Topics
            <span className="topic-count">{displayedTopics.length} {displayedTopics.length === 1 ? "topic" : "topics"}</span>
          </h1>

          <div className="dashboard-controls">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search topics..."
                className="search-bar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search topics"
              />
            </div>

            <div className="filter-group">
              <span className="filter-label">
                <FaFilter /> Filter by:
              </span>
              <div className="filter-options">
                {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
                  <button
                    key={level}
                    className={`filter-btn ${difficultyFilter === level ? "active" : ""}`}
                    onClick={() => setDifficultyFilter(level)}
                    aria-pressed={difficultyFilter === level}
                  >
                    {difficultyFilter === level && difficultyIcons[level]}
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="topics-grid-container" aria-live="polite">
          {displayedTopics.length > 0 ? (
            <div className="topics-grid">
              {displayedTopics.map((topic) => (
                <article
                  key={topic.id}
                  className="topic-card"
                  onClick={() => handleTopicClick(topic.id)}
                  onKeyDown={(e) => e.key === "Enter" && handleTopicClick(topic.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Learn ${topic.title}`}
                >
                  <div className="topic-content">
                    <h2 className="topic-title">{topic.title}</h2>
                    <p className="topic-description">{topic.description}</p>
                  </div>
                  <footer className="topic-footer">
                    <span className={`difficulty-badge ${topic.difficulty.toLowerCase()}`}>
                      {difficultyIcons[topic.difficulty]} {topic.difficulty}
                    </span>
                    <span className="category-name">{selectedDomain}</span>
                  </footer>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <FaRegSadCry className="sad-icon" />
              <p>No topics found matching your criteria</p>
              <button onClick={resetFilters} className="reset-filters">
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default React.memo(Dashboard);