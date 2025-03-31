  import React, { useState, useEffect } from "react";
  import axiosInstance from "../api/axiosInstance";
  import "../styles/TextContent.css";

  const TextContent = ({ refId }) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      if (refId) {
        setLoading(true);
        axiosInstance
          .get(`/api/textContent/${refId}`)
          .then((res) => {
            // Assuming the API response returns an object with a 'content' field
            setContent(res.data.content);
          })
          .catch((err) => {
            console.error("Error fetching text content:", err);
            setError("No content available.");
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setError("No reference ID provided.");
      }
    }, [refId]);

    if (loading) {
      return <div className="text-content">Loading text content...</div>;
    }

    if (error) {
      return <div className="video-content">
        <div className="error">{error}</div>
      </div>;
    }

    // return (
    //   <div className="text-content">
    //     <h2>Text Content</h2>
    //     {content ? <p>{content}</p> : <p>No content available.</p>}
    //   </div>
    // );
    return (
      <div className="text-content-container">
        <h2 className="text-content-title">📖 Topic:Algebra</h2>
        <div
          className="text-content-body"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
    );
  };

  export default TextContent;
