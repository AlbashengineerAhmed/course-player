import React from 'react';
import PDFViewer from '../PDFViewer';
import ContentTabs from '../ContentTabs';
import { showInfoToast } from '../ToastManager';

/**
 * PDFContent component for rendering PDF lessons
 * @param {Object} props - Component props
 * @param {Object} props.selectedContent - The selected PDF content
 * @param {Function} props.handlePdfCompleted - Function to handle PDF completion
 * @param {Object} props.completedContent - Object tracking completed content
 * @param {Function} props.findNextLesson - Function to find the next lesson
 * @param {Function} props.handleLessonSelect - Function to handle lesson selection
 * @param {Object} props.autoplayTimer - Timer for autoplay
 * @param {Function} props.cancelAutoplayTimer - Function to cancel autoplay timer
 * @param {string} props.nextLessonId - ID of the next lesson for autoplay
 * @returns {JSX.Element} The rendered component
 */
const PDFContent = ({
  selectedContent,
  handlePdfCompleted,
  completedContent,
  findNextLesson,
  handleLessonSelect,
  autoplayTimer,
  cancelAutoplayTimer,
  nextLessonId,
}) => {
  // Calculate remaining time for autoplay
  const calculateRemainingTime = () => {
    return Math.ceil(
      (autoplayTimer?._idleStart + autoplayTimer?._idleTimeout - Date.now()) / 1000 || 5
    );
  };

  return (
    <>
      <PDFViewer
        pdfUrl={selectedContent.url}
        title={selectedContent.title}
        fileSize={selectedContent.fileSize}
        pages={selectedContent.pages}
        onComplete={handlePdfCompleted}
      />
      <ContentTabs />
      
      {/* Add an additional complete button here for immediate completion */}
      {!completedContent[selectedContent.id] && (
        <button
          className="mark-completed-button"
          onClick={handlePdfCompleted}
        >
          Mark as completed
        </button>
      )}

      {/* Show next lesson button if this lesson is completed */}
      {completedContent[selectedContent.id] && findNextLesson && (
        <div className="next-lesson-container">
          {nextLessonId ? (
            <div className="autoplay-info">
              <span>
                Next lesson in{" "}
                <span className="countdown">
                  {calculateRemainingTime()}
                </span>{" "}
                seconds
              </span>
              <button
                className="cancel-autoplay-btn"
                onClick={cancelAutoplayTimer}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="next-lesson-button"
              onClick={() => handleLessonSelect(findNextLesson())}
            >
              Next Lesson: {findNextLesson().title}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default PDFContent;
