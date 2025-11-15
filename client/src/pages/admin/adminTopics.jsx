// src/pages/admin/AdminTopics.jsx
import React, { useEffect, useState } from 'react';
import { apiGet, apiDelete, apiPut } from '../../utils/api';
import '../../styles/admin.css';

export default function AdminTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchTopics();
  }, []);

  async function fetchTopics() {
    setLoading(true);
    try {
      // Expect backend to support GET /api/topicRoutes (returns array)
      const res = await apiGet('/topicRoutes');
      setTopics(Array.isArray(res) ? res : (res.topics || res));
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to load topics');
    } finally {
      setLoading(false);
    }
  }

  async function deleteTopic(topicId) {
    if (!window.confirm('Delete this topic? This cannot be undone.')) return;
    try {
      await apiDelete(`/topicRoutes/delete/${encodeURIComponent(topicId)}`);
      setTopics(prev => prev.filter(t => t.topicId !== topicId));
      alert('Topic deleted');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Delete failed');
    }
  }

  function startEdit(t) {
    setEditingId(t.topicId);
    setEditData({ title: t.title, description: t.description });
  }

  async function saveEdit(topicId) {
    try {
      const body = { title: editData.title, description: editData.description };
      const res = await apiPut(`/topicRoutes/update/${encodeURIComponent(topicId)}`, body);
      // update local list
      setTopics(prev => prev.map(t => t.topicId === topicId ? { ...t, ...res.topic } : t));
      setEditingId(null);
      alert('Saved');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Save failed');
    }
  }

  if (loading) return <div className="admin-container"><h2>Loading topics...</h2></div>;

  return (
    <div className="admin-container">
      <h1 className="page-title">Topics</h1>

      <div className="list">
        {topics.length === 0 ? <div className="empty">No topics</div> :
          topics.map(t => (
            <div key={t.topicId} className="list-row">
              <div style={{flex:1}}>
                {editingId === t.topicId ? (
                  <>
                    <input className="input" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} />
                    <textarea className="textarea" value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} />
                  </>
                ) : (
                  <>
                    <div className="row-title">{t.title}</div>
                    <div className="row-sub">{t.topicId}</div>
                    <div className="muted">{t.description}</div>
                  </>
                )}
              </div>

              <div className="row-actions">
                {editingId === t.topicId ? (
                  <>
                    <button className="btn" onClick={() => saveEdit(t.topicId)}>Save</button>
                    <button className="btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn" onClick={() => startEdit(t)}>Edit</button>
                    <button className="btn danger" onClick={() => deleteTopic(t.topicId)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
