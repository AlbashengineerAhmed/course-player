import React from 'react';
import './ContentTabs.css';

/**
 * ContentTabs component that provides tabs for navigating between different sections
 * @param {Object} props - Component props
 * @returns {JSX.Element} The rendered component
 */
const ContentTabs = () => {
  // Function to scroll to a section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to open a popup
  const openPopup = (popupType) => {
    if (popupType === 'question') {
      window.dispatchEvent(new CustomEvent('openQuestionModal'));
    } else if (popupType === 'leaderboard') {
      window.dispatchEvent(new CustomEvent('openLeaderboardModal'));
    }
  };

  return (
    <div className="content-tabs">
      <button 
        className="content-tab" 
        onClick={() => scrollToSection('curriculum-section')}
      >
        <i className="fas fa-book"></i>
        <span>Curriculum</span>
      </button>
      <button 
        className="content-tab" 
        onClick={() => scrollToSection('comments-section')}
      >
        <i className="fas fa-comments"></i>
        <span>Comments</span>
      </button>
      <button 
        className="content-tab" 
        onClick={() => openPopup('question')}
      >
        <i className="fas fa-question-circle"></i>
        <span>Ask Question</span>
      </button>
      <button 
        className="content-tab" 
        onClick={() => openPopup('leaderboard')}
      >
        <i className="fas fa-trophy"></i>
        <span>Leaderboard</span>
      </button>
    </div>
  );
};

export default ContentTabs;
