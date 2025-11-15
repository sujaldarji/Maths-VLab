import React, { useState, useEffect, useMemo, useCallback } from "react";
import "../styles/dashboard.css";
import topicsData from "../data/topicsList";
import Sidebar from "./Sidebar";
import { FaStar, FaRegSadCry, FaSearch, FaFilter, FaSyncAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import useDebounce from "./useDebounce";
import CreateTopicModal from "./CreateTopicModal"; // Add this import
import EditTopicModal from './EditTopicModal'; // Add this import

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

  // Role-based access control
  const [userRole, setUserRole] = useState('student');
  const canEdit = ['teacher', 'admin'].includes(userRole);
  const canCreate = ['teacher', 'admin'].includes(userRole);
  const canDelete = userRole === 'admin';

  // Modal states - ADD THESE
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Set initial domain from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const domain = params.get("domain");
    if (domain && topicsData[domain]) {
      setSelectedDomain(domain);
    }
  }, [location.search]);

  const handleTopicUpdated = useCallback(() => {
  setIsEditModalOpen(false);
  setSelectedTopic(null);
  console.log('Topic updated successfully!');
  // You can add logic to refresh the topics list here
}, []);

  // Auth verification with error handling
  const verifyAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // First check localStorage for user role
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.role) {
        setUserRole(userData.role);
      }

      // Then verify auth with backend
      const response = await axiosInstance.get("/api/userRoutes/auth-status");
      
      // Update role from backend response if available
      if (response.data.user?.role) {
        setUserRole(response.data.user.role);
      }
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

  // Handle successful topic creation - ADD THIS FUNCTION
  const handleTopicCreated = useCallback(() => {
    setIsCreateModalOpen(false);
    // You can add logic here to refresh topics or show success message
    console.log('Topic created successfully!');
    // Optionally refresh the topics list if you're fetching from backend
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
          <div className="header-top-row">
            <h1 className="dashboard-title">
              {selectedDomain} Topics
              <span className="topic-count">{displayedTopics.length} {displayedTopics.length === 1 ? "topic" : "topics"}</span>
            </h1>
            
            {/* Create New Topic Button - UPDATED */}
            {canCreate && (
              <button 
                className="create-topic-btn"
                onClick={() => setIsCreateModalOpen(true)}
              >
                + Create New Topic
              </button>
            )}
          </div>

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
                    
                    {/* Edit & Delete Buttons - UPDATED */}
                    {(canEdit || canDelete) && (
                      <div className="topic-actions">
                        {canEdit && (
                          <button 
                            className="edit-topic-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTopic(topic);
                              setIsEditModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button 
                            className="delete-topic-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTopic(topic);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
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

      {/* Modal Render - ADD THIS SECTION */}
      {isCreateModalOpen && (
        <CreateTopicModal 
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleTopicCreated}
        />
      )}
      
       {isEditModalOpen && (
        <EditTopicModal 
          topic={selectedTopic}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleTopicUpdated}
        />
      )}
{/*       
      {isDeleteModalOpen && (
        <DeleteConfirmationModal 
          topic={selectedTopic}
          onClose={() => setIsDeleteModalOpen(false)}
          onSuccess={handleTopicDeleted}
        />
      )}  */}
      
    </div>
  );
};

export default React.memo(Dashboard);