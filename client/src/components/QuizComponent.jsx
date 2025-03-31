import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "../styles/QuizComponent.css";

const QuizComponent = ({ refId }) => {
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!refId) {
      setError("No reference ID provided.");
      return;
    }

    setLoading(true);
    setError(""); // Reset error when fetching new data

    axiosInstance
      .get(`/api/quiz/${refId}`)
      .then((res) => {
        if (res.data && res.data.questions && res.data.questions.length > 0) {
          setQuizData(res.data);
        } else {
          setError("No valid quiz content found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching quiz content:", err);
        setError("Failed to load quiz content.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refId]);

  const handleSelectAnswer = (questionIdx, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: option,
    }));
  };

  if (loading) return <div className="quiz-content">Loading quiz content...</div>;
  if (error) return <div className="quiz-content error">{error}</div>;

  return (
    <div className="quiz-content">
      <h2>Quiz</h2>
      {quizData && quizData.questions.length > 0 ? (
        <div className="quiz-questions">
          {quizData.questions.map((question, idx) => (
            <div key={idx} className="quiz-question">
              <p>
                <strong>{question.question}</strong>
              </p>
              <ul>
                {question.options.map((option, i) => (
                  <li
                    key={i}
                    className={selectedAnswers[idx] === option ? "selected" : ""}
                    onClick={() => handleSelectAnswer(idx, option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
              {selectedAnswers[idx] && (
                <p className={selectedAnswers[idx] === question.correctAnswer ? "correct" : "incorrect"}>
                  {selectedAnswers[idx] === question.correctAnswer
                    ? "✅ Correct!"
                    : `❌ Incorrect. The correct answer is: ${question.correctAnswer}`}
                </p>
              )}
              {selectedAnswers[idx] && question.explanation && (
                <p className="explanation">Explanation: {question.explanation}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No quiz content available.</p>
      )}
    </div>
  );
};

export default QuizComponent;
