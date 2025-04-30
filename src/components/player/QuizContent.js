import React from 'react';
import ContentTabs from '../ContentTabs';

/**
 * QuizContent component for rendering quiz previews
 * @param {Object} props - Component props
 * @param {Object} props.selectedContent - The selected quiz content
 * @param {Function} props.setActiveQuiz - Function to set the active quiz
 * @param {Function} props.setIsQuizModalOpen - Function to open the quiz modal
 * @param {Object} props.completedContent - Object tracking completed content
 * @returns {JSX.Element} The rendered component
 */
const QuizContent = ({
  selectedContent,
  setActiveQuiz,
  setIsQuizModalOpen,
  completedContent,
}) => {
  return (
    <>
      <div className="quiz-preview">
        <div className="quiz-preview-info">
          <p className="content-description">
            {selectedContent.description}
          </p>
          <p className="content-duration">
            Duration: {selectedContent.duration}
          </p>
          <p className="quiz-questions-count">
            Questions: {selectedContent.quiz.questions.length}
          </p>
          <button
            className="start-quiz-button"
            onClick={() => {
              setActiveQuiz(selectedContent.quiz);
              setIsQuizModalOpen(true);
            }}
          >
            Start Quiz
          </button>
        </div>
        <p className="content-status">
          Status:{" "}
          {completedContent[selectedContent.id]
            ? "Completed"
            : "Incomplete"}
        </p>
      </div>
      <ContentTabs />
    </>
  );
};

export default QuizContent;
