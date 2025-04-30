import React, { useState, useEffect } from 'react';
import './AskQuestionModal.css';

const AskQuestionModal = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [savedQuestion, setSavedQuestion] = useState('');
  
  // Load saved question from sessionStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedData = sessionStorage.getItem('savedQuestion');
      if (savedData) {
        setQuestion(savedData);
        setSavedQuestion(savedData);
      }
    }
  }, [isOpen]);
  
  // Save question to sessionStorage when typing
  useEffect(() => {
    if (question !== savedQuestion) {
      sessionStorage.setItem('savedQuestion', question);
      setSavedQuestion(question);
    }
  }, [question, savedQuestion]);
  
  // Clear saved question when submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    // Here you would typically send the question to a backend
    console.log('Question submitted:', question);
    
    // Clear the saved question
    sessionStorage.removeItem('savedQuestion');
    setQuestion('');
    setSavedQuestion('');
    
    // Close the modal
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Ask a Question</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="question-form">
          <textarea
            className="question-input"
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={5}
          ></textarea>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={!question.trim()}
            >
              Submit Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestionModal;
