import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Handle timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !isQuizCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isQuizCompleted) {
      handleQuizComplete();
    }
  }, [timeRemaining, isQuizCompleted]);
  
  // Get current question
  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  // Handle option selection
  const handleOptionSelect = (questionId, optionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionId
    });
  };
  
  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Navigate to specific question
  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
  };
  
  // Handle quiz submission
  const handleQuizComplete = () => {
    setIsQuizCompleted(true);
    
    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    // Call the onComplete callback with the results
    if (onComplete) {
      onComplete({
        completed: true,
        score,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        timeSpent: quiz.timeLimit - timeRemaining
      });
    }
    
    setShowResults(true);
  };
  
  // Render results screen
  const renderResults = () => {
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const timeSpent = quiz.timeLimit - timeRemaining;
    
    return (
      <div className="quiz-results">
        <h2>Quiz Results</h2>
        <div className="results-summary">
          <div className="result-item">
            <span className="result-label">Score:</span>
            <span className="result-value">{score}%</span>
          </div>
          <div className="result-item">
            <span className="result-label">Correct Answers:</span>
            <span className="result-value">{correctAnswers} of {quiz.questions.length}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Time Spent:</span>
            <span className="result-value">{formatTime(timeSpent)}</span>
          </div>
        </div>
        
        <div className="results-details">
          <h3>Question Review</h3>
          {quiz.questions.map((question, index) => (
            <div 
              key={question.id} 
              className={`result-question ${selectedAnswers[question.id] === question.correctAnswer ? 'correct' : 'incorrect'}`}
            >
              <div className="result-question-header">
                <span className="question-number">Question {index + 1}</span>
                <span className="question-status">
                  {selectedAnswers[question.id] === question.correctAnswer ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              <p className="question-text">{question.question}</p>
              <div className="question-options">
                {question.options.map(option => (
                  <div 
                    key={option.id} 
                    className={`result-option ${selectedAnswers[question.id] === option.id ? 'selected' : ''} ${option.id === question.correctAnswer ? 'correct' : ''}`}
                  >
                    {option.text}
                    {option.id === question.correctAnswer && <span className="correct-indicator">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render quiz questions
  const renderQuiz = () => {
    return (
      <>
        <div className="quiz-header">
          <div className="timer">{formatTime(timeRemaining)}</div>
          <div className="question-navigation">
            {quiz.questions.map((question, index) => (
              <button
                key={question.id}
                className={`nav-button ${index === currentQuestionIndex ? 'active' : ''} ${selectedAnswers[question.id] ? 'answered' : ''}`}
                onClick={() => handleQuestionNavigation(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        
        <div className="quiz-content">
          <div className="question-number">
            {currentQuestionIndex + 1}.
          </div>
          <div className="question-text">
            {currentQuestion.question}
          </div>
          
          <div className="options-container">
            {currentQuestion.options.map(option => (
              <div 
                key={option.id}
                className={`option ${selectedAnswers[currentQuestion.id] === option.id ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
              >
                <div className="option-checkbox">
                  {selectedAnswers[currentQuestion.id] === option.id ? '✓' : ''}
                </div>
                <div className="option-text">{option.text}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="quiz-footer">
          <button 
            className="nav-button prev"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button 
              className="nav-button submit"
              onClick={handleQuizComplete}
              disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
            >
              Submit Quiz
            </button>
          ) : (
            <button 
              className="nav-button next"
              onClick={handleNextQuestion}
            >
              Next
            </button>
          )}
        </div>
      </>
    );
  };
  
  return (
    <div className="quiz-container">
      {showResults ? renderResults() : renderQuiz()}
    </div>
  );
};

export default Quiz;
