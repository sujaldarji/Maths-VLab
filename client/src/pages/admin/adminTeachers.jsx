// src/pages/admin/AdminTeachers.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import '../../styles/adminT.css';

export default function AdminTeachers() {
  const [activeTab, setActiveTab] = useState('all');
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, [activeTab]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError('');

      if (activeTab === 'pending') {
        const response = await axiosInstance.get('/api/admin/teachers/pending');
        if (response.data.success) {
          setPendingTeachers(response.data.pendingTeachers);
        }
      } else {
        const response = await axiosInstance.get('/api/admin/teachers');
        if (response.data.success) {
          setAllTeachers(response.data.teachers);
        }
      }
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      setError(error.response?.data?.message || 'Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const approveTeacher = async (teacherId) => {
    if (!window.confirm('Are you sure you want to approve this teacher?')) return;
    
    try {
      const response = await axiosInstance.put(`/api/admin/teachers/${teacherId}/approve`);
      
      if (response.data.success) {
        // Remove from pending and add to all teachers
        setPendingTeachers(prev => prev.filter(teacher => teacher._id !== teacherId));
        setAllTeachers(prev => [...prev, response.data.teacher]);
        alert('Teacher approved successfully!');
      }
    } catch (error) {
      console.error('Failed to approve teacher:', error);
      alert(error.response?.data?.message || 'Failed to approve teacher');
    }
  };

  const rejectTeacher = async (teacherId) => {
    if (!window.confirm('Are you sure you want to reject this teacher? This action cannot be undone.')) return;
    
    try {
      const response = await axiosInstance.delete(`/api/admin/teachers/${teacherId}/reject`);
      
      if (response.data.success) {
        setPendingTeachers(prev => prev.filter(teacher => teacher._id !== teacherId));
        alert('Teacher rejected successfully!');
      }
    } catch (error) {
      console.error('Failed to reject teacher:', error);
      alert(error.response?.data?.message || 'Failed to reject teacher');
    }
  };

  const revokeAccess = async (teacherId) => {
    if (!window.confirm('Are you sure you want to revoke this teacher\'s access? They will need to be approved again to regain access.')) return;
    
    try {
      const response = await axiosInstance.put(`/api/admin/teachers/${teacherId}/revoke`);
      
      if (response.data.success) {
        setAllTeachers(prev => prev.filter(teacher => teacher._id !== teacherId));
        alert('Teacher access revoked successfully!');
      }
    } catch (error) {
      console.error('Failed to revoke access:', error);
      alert(error.response?.data?.message || 'Failed to revoke access');
    }
  };

  const filteredTeachers = allTeachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPending = pendingTeachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-teachers-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          Loading teachers...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-teachers-container">
      <div className="teachers-header">
        <div className="header-content">
          <h1 className="page-title">Teacher Management</h1>
          <p className="page-subtitle">Manage teacher accounts and registration requests</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <span className="stat-number">{allTeachers.length}</span>
            <span className="stat-label">Total Teachers</span>
          </div>
          <div className="stat-badge">
            <span className="stat-number">{pendingTeachers.length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="teachers-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search teachers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="tab-controls">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Teachers ({allTeachers.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Requests ({pendingTeachers.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
          <button onClick={fetchTeachers} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Content */}
      {activeTab === 'pending' ? (
        <div className="teachers-content">
          <h2 className="content-title">Pending Registration Requests</h2>
          {filteredPending.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⏳</div>
              <h3>No Pending Requests</h3>
              <p>All registration requests have been processed.</p>
            </div>
          ) : (
            <div className="teachers-list">
              {filteredPending.map(teacher => (
                <div key={teacher._id} className="teacher-item pending">
                  <div className="teacher-avatar">
                    {teacher.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="teacher-info">
                    <h3 className="teacher-name">{teacher.name}</h3>
                    <p className="teacher-email">{teacher.email}</p>
                    <p className="teacher-date">Applied: {new Date(teacher.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="teacher-actions">
                    <button 
                      className="btn btn-approve"
                      onClick={() => approveTeacher(teacher._id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn btn-reject"
                      onClick={() => rejectTeacher(teacher._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="teachers-content">
          <h2 className="content-title">All Teachers</h2>
          {filteredTeachers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👨‍🏫</div>
              <h3>No Teachers Found</h3>
              <p>Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="teachers-list">
              {filteredTeachers.map(teacher => (
                <div key={teacher._id} className="teacher-item">
                  <div className="teacher-avatar">
                    {teacher.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="teacher-info">
                    <h3 className="teacher-name">{teacher.name}</h3>
                    <p className="teacher-email">{teacher.email}</p>
                    <p className="teacher-date">Joined: {new Date(teacher.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="teacher-actions">
                    <button 
                      className="btn btn-revoke"
                      onClick={() => revokeAccess(teacher._id)}
                    >
                      Revoke Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}