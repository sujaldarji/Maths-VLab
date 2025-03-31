import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "../styles/VideoContent.css";

const VideoContent = ({ refId }) => {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (refId) {
      setLoading(true);
      axiosInstance
        .get(`/api/videoContent/${refId}`)
        .then((res) => {
          // Assume API returns an object with a 'url' field (and optionally, description, thumbnail, duration)
          setVideoData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching video content:", err);
          setError("No video content available.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("No reference ID provided.");
    }
  }, [refId]);

  if (loading) {
    return <div className="video-content">Loading video content...</div>;
  }
  if (error) {
    return <div className="video-content">
      <div className="error">{error}</div>
    </div>;
  }
  

  return (
    <div className="video-content">
      <h2>Video Player</h2>
      {videoData && videoData.url ? (
        <div className="video-wrapper">
          <video controls>
            <source src={videoData.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {videoData.description && <p>{videoData.description}</p>}
        </div>
      ) : (
        <p>No video available for this topic.</p>
      )}
    </div>
  );
};

export default VideoContent;