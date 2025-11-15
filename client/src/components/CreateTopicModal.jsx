import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import './Modal.css';

const CreateTopicModal = ({ onClose, onSuccess }) => {
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
      // Generate a unique topicId
      const topicId = Date.now().toString();
      
      // Create content array matching your schema
      const content = [
        {
          type: "text",
          data: {
            text: formData.description
          }
        },
        {
          type: "video",
          data: {
            youtubeUrl: ""
          }
        },
        {
          type: "quiz",
          data: []
        }
      ];

      // Prepare data matching your backend schema
      const topicData = {
        topicId,
        title: formData.title,
        description: formData.description,
        content: content
      };

      console.log('🚀 Sending topic data:', JSON.stringify(topicData, null, 2));

      // Call backend API
      const response = await axiosInstance.post('/api/topicRoutes/add', topicData);
      
      console.log('✅ Backend response:', response.data);

      // FIX: Check for success OR message in response
      if (response.data.success || response.data.message) {
        console.log('🎉 Topic created successfully!');
        onSuccess();
      } else {
        throw new Error(response.data.error || 'Failed to create topic');
      }
    } catch (err) {
      console.error('❌ Create topic error details:', err);
      console.error('❌ Error response:', err.response);
      
      let errorMessage = 'Failed to create topic';
      
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

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Topic</h2>
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
            <p><strong>Note:</strong> Video URL and quiz questions can be added later when editing the topic.</p>
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
              {loading ? 'Creating...' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTopicModal;