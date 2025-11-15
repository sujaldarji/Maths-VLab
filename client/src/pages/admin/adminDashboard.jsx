// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import '../../styles/admin.css';

export default function AdminDashboard() {
  const nav = useNavigate();
  const [stats, setStats] = useState({
    totalTeachers: 0,
    pendingRequests: 0,
    activeTopics: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/admin/dashboard-stats');
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: "Total Teachers", 
      value: stats.totalTeachers,
      icon: "👨‍🏫",
      description: "Approved teachers"
    },
    { 
      label: "Pending Requests", 
      value: stats.pendingRequests,
      icon: "⏳",
      description: "Awaiting approval"
    },
    { 
      label: "Active Topics", 
      value: stats.activeTopics,
      icon: "📚",
      description: "Learning materials"
    },
    { 
      label: "Total Students", 
      value: stats.totalStudents,
      icon: "🎓",
      description: "Registered students"
    },
    
  ];

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          Loading dashboard statistics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
        <button onClick={fetchDashboardStats} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage users, approvals, and system content</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
              <span className="stat-description">{stat.description}</span>
            </div>
            <div className="stat-icon">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="cards-grid">
          <div className="feature-card" onClick={() => nav('/admin/teachers')}>
            <div className="card-icon">👨‍🏫</div>
            <div className="card-content">
              <h3>Manage Teachers</h3>
              <p>View approved teachers and pending requests</p>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="feature-card" onClick={() => nav('/admin/teachers?tab=pending')}>
            <div className="card-icon">⏳</div>
            <div className="card-content">
              <h3>Pending Approvals</h3>
              <p>Review and approve teacher registration requests</p>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="feature-card" onClick={() => nav('/dashboard')}>
            <div className="card-icon">📚</div>
            <div className="card-content">
              <h3>Content Management</h3>
              <p>Manage learning topics and educational content</p>
            </div>
            <div className="card-arrow">→</div>
          </div>
        </div>
      </div>
    </div>
  );
}