import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import './Modal.css';

const EditTopicModal = ({ topic, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: 'Arithmetic',
    difficulty: 'Beginner'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const domains = [
    'Arithmetic', 'Geometry', 'Trigonometry', 'Algebra', 
    'Discrete Mathematics', 'Calculus', 'DSA', 'Aptitude'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  // Pre-fill form when topic prop changes
  useEffect(() => {
    if (topic) {
      setFormData({
        title: topic.title || '',
        description: topic.description || '',
        domain: topic.domain || 'Arithmetic',
        difficulty: topic.difficulty || 'Beginner'
      });
    }
  }, [topic]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare update data
      const updateData = {
        title: formData.title,
        description: formData.description,
        // Note: We're only updating basic info for now
        // Content (text, video, quiz) will be updated separately
      };

      console.log('🚀 Updating topic:', topic.topicId, 'with data:', updateData);

      // Call backend API to update topic
      const response = await axiosInstance.put(`/api/topicRoutes/update/${topic.topicId}`, updateData);
      
      console.log('✅ Update response:', response.data);

      if (response.data.success || response.data.message) {
        console.log('🎉 Topic updated successfully!');
        onSuccess();
      } else {
        throw new Error(response.data.error || 'Failed to update topic');
      }
    } catch (err) {
      console.error('❌ Update topic error:', err);
      
      let errorMessage = 'Failed to update topic';
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!topic) {
    return null; // Don't render if no topic is selected
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Topic</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="topic-form">
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="title">Topic Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter topic title"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Enter topic description"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="domain">Domain *</label>
              <select
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                required
                disabled={loading}
              >
                {domains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty *</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
                disabled={loading}
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-info">
            <p><strong>Note:</strong> To edit video content or quiz questions, use the full topic editor.</p>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="create-button"
              disabled={loading || !formData.title.trim() || !formData.description.trim()}
            >
              {loading ? 'Updating...' : 'Update Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTopicModal;