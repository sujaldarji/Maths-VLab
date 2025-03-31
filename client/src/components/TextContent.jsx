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
          setContent(res.data.content); // Assuming content has math equations in LaTeX format
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

  // Load MathJax if not already loaded
  useEffect(() => {
    const loadMathJax = () => {
      if (!window.MathJax) {
        const script = document.createElement("script");
        script.src = "https://polyfill.io/v3/polyfill.min.js?features=es6";
        script.async = true;
        document.head.appendChild(script);

        const script2 = document.createElement("script");
        script2.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
        script2.async = true;
        script2.onload = () => {
          window.MathJax.typesetPromise();
        };
        document.head.appendChild(script2);
      } else {
        window.MathJax.typesetPromise();
      }
    };

    loadMathJax();
  }, []);

  // Reprocess MathJax when content updates
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [content]);

  if (loading) {
    return <div className="text-content">Loading text content...</div>;
  }

  if (error) {
    return (
      <div className="video-content">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="text-content-container">
      <h2 className="text-content-title">📖 Topic: Algebra</h2>
      <div
        className="text-content-body"
        dangerouslySetInnerHTML={{ __html: content || "<p>No content available.</p>" }}
      ></div>
    </div>
  );
};

export default TextContent;
