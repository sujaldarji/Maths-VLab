import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "../styles/GameContent.css";

const GameContent = ({ refId }) => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!refId) {
      setError("No reference ID provided.");
      return;
    }

    setLoading(true);
    setError(""); // Reset error for new fetch

    axiosInstance
      .get(`/api/gameContent/${refId}`)
      .then((res) => {
        if (res.data && res.data.url) {
          setGameData(res.data);
        } else {
          setError("No valid game content found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching game content:", err);
        setError("Failed to load game content.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refId]);

  if (loading)
    return <div className="game-content">Loading game content...</div>;
  if (error) return <div className="game-content error">{error}</div>;

  return (
    <div className="game-content">
      <h2>Game Content</h2>
      {gameData && gameData.url ? (
        <div className="game-wrapper">
          <iframe
            src={gameData.url}
            title="Embedded Game"
            width="100%"
            height="500px"
            frameBorder="0"
            allowFullScreen
          ></iframe>
          {gameData.description && <p>{gameData.description}</p>}
        </div>
      ) : (
        <p>No game available for this topic.</p>
      )}
    </div>
  );
};

export default GameContent;