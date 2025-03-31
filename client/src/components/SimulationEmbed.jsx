import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "../styles/SimulationEmbed.css";

const SimulationEmbed = ({ refId }) => {
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!refId) {
      setError("No reference ID provided.");
      return;
    }

    setLoading(true);
    setError(""); // Reset error state when fetching new content

    axiosInstance
      .get(`/api/simulationContent/${refId}`)
      .then((res) => {
        if (res.data && res.data.embedUrl) {
          setSimulationData(res.data);
        } else {
          setError("No valid simulation content found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching simulation content:", err);
        setError("Failed to load simulation content.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refId]);

  if (loading) return <div className="simulation-content">Loading simulation content...</div>;
  if (error) return <div className="simulation-content error">{error}</div>;

  return (
    <div className="simulation-content">
      <h2>Simulation</h2>
      {simulationData && simulationData.embedUrl ? (
        <div className="simulation-embed">
          <iframe
            src={simulationData.embedUrl}
            title="Simulation"
            width="100%"
            height="400px"
            frameBorder="0"
            allowFullScreen
          ></iframe>
          {simulationData.description && <p>{simulationData.description}</p>}
        </div>
      ) : (
        <p>No simulation content available.</p>
      )}
    </div>
  );
};

export default SimulationEmbed;