import React, { useState, useEffect } from 'react';
import '../styles/QuizComponent.css';
import { FaCheckCircle, FaTimesCircle, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const QuizComponent = ({ questions }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showResults, quizStarted]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerChange = (selectedOption) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestion] = selectedOption;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    const totalScore = questions.reduce((acc, q, index) => (
      selectedAnswers[index] === q.correctAnswer ? acc + 1 : acc
    ), 0);
    setScore(totalScore);
    setShowResults(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!quizStarted) {
    return (
      <div className="quiz-start-screen">
        <div className="start-screen-content">
          <h2>Knowledge Check Quiz</h2>
          <p>This quiz contains {questions.length} questions.</p>
          <p>You will have 10 minutes to complete it.</p>
          <button onClick={handleStartQuiz} className="start-quiz-button">
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {/* Quiz Header */}
      <div className="quiz-header">
        <h2>Knowledge Check</h2>
        <div className="quiz-meta">
          <span className="timer">⏱️ {formatTime(timeLeft)}</span>
          <span className="progress">Question {currentQuestion + 1} of {questions.length}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div 
          className="progress-bar"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Current Question */}
      <div className="question-card">
        <h3 className="question-text">{questions[currentQuestion].question}</h3>
        
        <div className="options-grid">
          {questions[currentQuestion].options.map((option, index) => (
            <div
              key={index}
              className={`option-card ${selectedAnswers[currentQuestion] === option ? 'selected' : ''}`}
              onClick={() => handleAnswerChange(option)}
            >
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                id={`option-${currentQuestion}-${index}`}
                checked={selectedAnswers[currentQuestion] === option}
                onChange={() => {}}
              />
              <label htmlFor={`option-${currentQuestion}-${index}`}>
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="navigation-controls">
        <button
          onClick={handlePrevQuestion}
          disabled={currentQuestion === 0}
          className="nav-button prev-button"
        >
          <FaArrowLeft /> Previous
        </button>
        
        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswers[currentQuestion] === null}
            className="nav-button next-button"
          >
            Next <FaArrowRight />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswers[currentQuestion] === null}
            className="submit-button"
          >
            Submit Quiz
          </button>
        )}
      </div>

      {/* Results Section */}
      {showResults && (
        <div className="results-section">
          <h3 className="score-header">
            Your Score: {score}/{questions.length}
          </h3>
          
          <div className="answers-review">
            {questions.map((question, index) => (
              <div
                key={index}
                className={`answer-card ${selectedAnswers[index] === question.correctAnswer ? 'correct' : 'incorrect'}`}
              >
                <div className="answer-icon">
                  {selectedAnswers[index] === question.correctAnswer ? (
                    <FaCheckCircle className="correct-icon" />
                  ) : (
                    <FaTimesCircle className="incorrect-icon" />
                  )}
                </div>
                <div className="answer-details">
                  <h4>Question {index + 1}: {question.question}</h4>
                  <p>Your answer: {selectedAnswers[index] || 'Not answered'}</p>
                  {selectedAnswers[index] !== question.correctAnswer && (
                    <p className="correct-answer">Correct answer: {question.correctAnswer}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;