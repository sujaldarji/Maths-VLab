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
//floating toc
//functio for toc
// useEffect(() => {
//   const tocButton = document.querySelector("#toggle-toc");
//   const tocContent = document.querySelector("#table-of-contents");

//   if (tocButton && tocContent) {
//     tocButton.onclick = () => {
//       tocContent.classList.toggle("active"); // Use class-based toggle
//     };
//   }
// }, [content]); // Runs when content updates
// useEffect(() => {
//   const tocButton = document.querySelector("#toggle-toc");
//   const tocContent = document.querySelector("#table-of-contents");
  

//   if (tocButton && tocContent) {
//     const toggleToC = () => {
//       tocContent.classList.toggle("active");
//     };

//     // Remove existing event listener before adding a new one (to avoid duplication)
//     tocButton.removeEventListener("click", toggleToC);
//     tocButton.addEventListener("click", toggleToC);

//     // Cleanup function to remove the listener when component unmounts or updates
//     return () => {
//       tocButton.removeEventListener("click", toggleToC);
//     };
//   }
// }, [content]); // Runs whenever content updates

useEffect(() => {
  const tocButton = document.querySelector("#toggle-toc");
  const tocContent = document.querySelector("#table-of-contents");
  const closeTocButton = document.getElementById("close-toc");

  if (tocButton && tocContent) {
    const toggleToC = () => {
      tocContent.classList.toggle("active");
    };

    tocButton.removeEventListener("click", toggleToC);
    tocButton.addEventListener("click", toggleToC);

    // Handle closing when clicking the "X" button
    if (closeTocButton) {
      const closeToC = () => {
        tocContent.classList.remove("active"); // Ensures ToC only closes
      };

      closeTocButton.removeEventListener("click", closeToC);
      closeTocButton.addEventListener("click", closeToC);

      return () => {
        tocButton.removeEventListener("click", toggleToC);
        closeTocButton.removeEventListener("click", closeToC);
      };
    }

    return () => {
      tocButton.removeEventListener("click", toggleToC);
    };
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
