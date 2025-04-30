import React from 'react';
import VideoPlayer from '../VideoPlayer';
import ContentTabs from '../ContentTabs';
import { showInfoToast } from '../ToastManager';

/**
 * VideoContent component for rendering video lessons
 * @param {Object} props - Component props
 * @param {Object} props.selectedContent - The selected video content
 * @param {Function} props.handleVideoProgress - Function to handle video progress
 * @param {string} props.nextLessonId - ID of the next lesson for autoplay
 * @param {boolean} props.autoplayEnabled - Whether autoplay is enabled
 * @param {Object} props.completedContent - Object tracking completed content
 * @param {Object} props.findNextLesson - Function to find the next lesson
 * @param {Function} props.handleLessonSelect - Function to handle lesson selection
 * @param {Object} props.autoplayTimer - Timer for autoplay
 * @param {Function} props.cancelAutoplayTimer - Function to cancel autoplay timer
 * @returns {JSX.Element} The rendered component
 */
const VideoContent = ({
  selectedContent,
  handleVideoProgress,
  nextLessonId,
  autoplayEnabled,
  completedContent,
  findNextLesson,
  handleLessonSelect,
  autoplayTimer,
  cancelAutoplayTimer,
}) => {
  // Calculate remaining time for autoplay
  const calculateRemainingTime = () => {
    return Math.ceil(
      (autoplayTimer?._idleStart + autoplayTimer?._idleTimeout - Date.now()) / 1000 || 5
    );
  };

  return (
    <>
      <VideoPlayer
        video={selectedContent}
        onProgress={handleVideoProgress}
        nextLessonId={nextLessonId}
        autoplayEnabled={autoplayEnabled}
      />
      <ContentTabs />
      
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

export default VideoContent;
