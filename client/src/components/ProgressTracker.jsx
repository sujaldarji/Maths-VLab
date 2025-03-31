import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "../styles/ProgressTracker.css";

const ProgressTracker = ({ userId }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("No user ID provided.");
      return;
    }

    setLoading(true);
    setError(""); // reset previous errors

    axiosInstance
      .get(`/api/progress/${userId}`)
      .then((res) => {
        // Expecting res.data to contain a progress document with 'completedTopics' array
        setProgress(res.data);
      })
      .catch((err) => {
        console.error("Error fetching progress:", err);
        setError("Could not load progress data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  if (loading)
    return <div className="progress-content">Loading progress...</div>;
  if (error)
    return <div className="progress-content error">{error}</div>;

  return (
    <div className="progress-content">
      <h2>Progress Tracker</h2>
      {progress && progress.completedTopics && progress.completedTopics.length > 0 ? (
        <div className="progress-list">
          {progress.completedTopics.map((topic, idx) => (
            <div key={idx} className="progress-item">
              <p>
                <strong>{topic.topicId}</strong> - {topic.completedSection ? (
                  <>
                    {topic.completedSection.text ? "Text Completed, " : ""}
                    {topic.completedSection.video ? "Video Completed, " : ""}
                    {topic.completedSection.quizScore !== undefined ? `Quiz: ${topic.completedSection.quizScore}%` : ""}
                  </>
                ) : "Progress not set"} 
              </p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${topic.completedSection && topic.completedSection.completedPercentage ? topic.completedSection.completedPercentage : 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No progress data available.</p>
      )}
    </div>
  );
};

export default ProgressTracker;
