import React, { useState, useEffect } from "react";
import CourseHeader from "./../CourseHeader/CourseHeader";
import CourseMaterials from "./../CourseMaterials/CourseMaterials";
import Comments from "./../Comments/Comments";
import CourseContent from "./../CourseContent/CourseContent";
import VideoPlayer from "./../VideoPlayer/VideoPlayer";
import PDFViewer from "./../PDFViewer/PDFViewer";
import Quiz from "./../Quiz/Quiz";
import Modal from "../Modal/Modal";
import AskQuestionModal from "./../AskQuestionModal/AskQuestionModal";
import LeaderboardModal from "./../LeaderboardModal/LeaderboardModal";
import ContentTabs from "./../ContentTabs/ContentTabs";
import courseContent from "../../data/videos";
import { showSuccessToast, showInfoToast } from "./../ToastManager/ToastManager";
import "./CoursePlayer.css";

// Constants
const COMPLETION_THRESHOLD = 90; // Percentage threshold to mark content as completed
const STORAGE_KEY = "completedContent"; // Key for localStorage

const NewCoursePlayer = () => {
  // State for the currently selected content item
  const [selectedContent, setSelectedContent] = useState(null);

  // State for tracking watched/completed content
  const [completedContent, setCompletedContent] = useState({});

  // State for modals and player
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isWideMode, setIsWideMode] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [autoplayTimer, setAutoplayTimer] = useState(null);
  const [nextLessonId, setNextLessonId] = useState(null);

  // Define cancelAutoplayTimer with useCallback to avoid dependency issues
  const cancelAutoplayTimer = React.useCallback(() => {
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      setAutoplayTimer(null);
    }
    setNextLessonId(null);
  }, [autoplayTimer]);

  // Load completed content and watch progress from localStorage on component mount
  useEffect(() => {
    // Load completed content
    const savedCompletedContent = localStorage.getItem(STORAGE_KEY);
    if (savedCompletedContent) {
      setCompletedContent(JSON.parse(savedCompletedContent));
    }

    // Load watch progress for videos
    const savedWatchProgress = localStorage.getItem("watchProgress");
    if (savedWatchProgress) {
      // We'll use this in the VideoPlayer component
      window.watchProgress = JSON.parse(savedWatchProgress);
    } else {
      window.watchProgress = {};
    }

    // Set the first content item as selected by default if none is selected
    if (!selectedContent && courseContent.length > 0) {
      setSelectedContent(courseContent[0]);
    }

    // Event listeners for modals and player controls
    const handleOpenQuestionModal = () => setIsQuestionModalOpen(true);
    const handleOpenLeaderboardModal = () => setIsLeaderboardModalOpen(true);
    const handleCancelAutoplay = () => cancelAutoplayTimer();

    // Handle player mode changes (wide mode)
    const handlePlayerModeChange = (e) => {
      const { isWideMode } = e.detail;
      const layoutElement = document.querySelector(".course-player-layout");
      if (layoutElement) {
        if (isWideMode) {
          layoutElement.classList.add("wide-mode");
        } else {
          layoutElement.classList.remove("wide-mode");
        }
      }
    };

    // Handle fullscreen changes
    const handleFullscreenChange = (e) => {
      const { isFullscreen } = e.detail;
      // Additional fullscreen handling if needed
    };

    // Event listener for saving video progress
    const handleSaveProgress = (e) => {
      const { videoId, progress, played } = e.detail;
      if (videoId && progress !== undefined) {
        const currentProgress = window.watchProgress || {};
        window.watchProgress = {
          ...currentProgress,
          [videoId]: progress,
        };
        localStorage.setItem(
          "watchProgress",
          JSON.stringify(window.watchProgress)
        );

        // Also check if we should mark as completed based on played percentage
        if (played >= 0.9) {
          // Find the video in course content
          const video = courseContent.find((item) => item.id === videoId);
          if (video && !completedContent[videoId]) {
            setCompletedContent((prev) => ({
              ...prev,
              [videoId]: true,
            }));

            // Save to localStorage immediately
            const updatedCompletedContent = {
              ...completedContent,
              [videoId]: true,
            };
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(updatedCompletedContent)
            );

            // Show success toast
            showSuccessToast("Lesson marked as completed!");
          }
        }
      }
    };

    window.addEventListener("openQuestionModal", handleOpenQuestionModal);
    window.addEventListener("openLeaderboardModal", handleOpenLeaderboardModal);
    window.addEventListener("cancelAutoplay", handleCancelAutoplay);
    window.addEventListener("saveVideoProgress", handleSaveProgress);
    window.addEventListener("playerModeChange", handlePlayerModeChange);
    window.addEventListener("videoFullscreenChange", handleFullscreenChange);

    return () => {
      window.removeEventListener("openQuestionModal", handleOpenQuestionModal);
      window.removeEventListener(
        "openLeaderboardModal",
        handleOpenLeaderboardModal
      );
      window.removeEventListener("cancelAutoplay", handleCancelAutoplay);
      window.removeEventListener("saveVideoProgress", handleSaveProgress);
      window.removeEventListener("playerModeChange", handlePlayerModeChange);
      window.removeEventListener(
        "videoFullscreenChange",
        handleFullscreenChange
      );

      // Clear any autoplay timer when component unmounts
      if (autoplayTimer) {
        clearTimeout(autoplayTimer);
      }
    };
  }, [selectedContent, autoplayTimer, cancelAutoplayTimer]);

  // Save completed content to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedContent));
  }, [completedContent]);

  /**
   * Calculate the overall course progress percentage
   * @returns {number} Progress percentage (0-100)
   */
  const calculateProgress = () => {
    if (courseContent.length === 0) return 0;

    const completedCount = Object.keys(completedContent).length;
    return Math.round((completedCount / courseContent.length) * 100);
  };

  /**
   * Handle content selection and open quiz modal if needed
   * @param {Object} content - The content item to select
   */
  const handleLessonSelect = React.useCallback((content) => {
    setSelectedContent(content);

    // If the content has a quiz, open the quiz modal
    if (content.contentType === "quiz") {
      setActiveQuiz(content.quiz);
      setIsQuizModalOpen(true);
    }
  }, []);

  /**
   * Find the next lesson in the course that should be unlocked
   * @returns {Object|null} The next lesson object or null if not found
   */
  const findNextLesson = React.useCallback(() => {
    if (!selectedContent) return null;

    // Get all lessons from all modules
    const allLessons = prepareModules().flatMap((module) => module.lessons);

    // Find the current lesson index
    const currentIndex = allLessons.findIndex(
      (lesson) => lesson.id === selectedContent.id
    );

    // If found and not the last lesson, return the next one
    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];

      // Only return the next lesson if the current one is completed
      // This ensures lessons are unlocked in sequence
      if (completedContent[selectedContent.id]) {
        return nextLesson;
      }
    }

    return null;
  }, [selectedContent, completedContent]);

  /**
   * Start autoplay timer to go to next lesson
   */
  const startAutoplayTimer = React.useCallback(() => {
    // Clear any existing timer
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
    }

    // Find the next lesson
    const nextLesson = findNextLesson();
    if (!nextLesson) return;

    // Set the next lesson ID
    setNextLessonId(nextLesson.id);

    // Start a 5-second timer
    const timer = setTimeout(() => {
      handleLessonSelect(nextLesson);
      setNextLessonId(null);
    }, 5000);

    setAutoplayTimer(timer);
  }, [autoplayTimer, findNextLesson, handleLessonSelect]);

  // cancelAutoplayTimer is defined above with useCallback

  /**
   * Handle video progress and mark as completed when threshold is reached
   * @param {Object} state - The player state with playback information
   */
  const handleVideoProgress = (state) => {
    const { playedSeconds, loadedSeconds, played } = state;

    if (selectedContent && loadedSeconds > 0) {
      // For YouTube videos, we need a different approach since loadedSeconds might be the full video duration
      // and playedSeconds might not accurately reflect progress for streaming videos

      // If it's a YouTube video or if we have duration info, use played percentage
      if (selectedContent.source === "youtube" || selectedContent.duration) {
        // Mark as watched if played percentage is above threshold
        if (played >= 0.9 && !completedContent[selectedContent.id]) {
          setCompletedContent((prev) => ({
            ...prev,
            [selectedContent.id]: true,
          }));

          // Save to localStorage immediately to ensure persistence
          const updatedCompletedContent = {
            ...completedContent,
            [selectedContent.id]: true,
          };
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedCompletedContent)
          );

          // Show success toast when content is marked as completed
          showSuccessToast("Lesson marked as completed!");

          // If autoplay is enabled and video is almost complete, start timer for next lesson
          if (autoplayEnabled && played > 0.95) {
            startAutoplayTimer();
          }
        }
      } else {
        // For non-YouTube videos, use the original calculation
        const percentagePlayed = (playedSeconds / loadedSeconds) * 100;

        // Mark as watched if threshold percentage or more has been viewed
        if (
          percentagePlayed >= COMPLETION_THRESHOLD &&
          !completedContent[selectedContent.id]
        ) {
          setCompletedContent((prev) => ({
            ...prev,
            [selectedContent.id]: true,
          }));

          // Save to localStorage immediately to ensure persistence
          const updatedCompletedContent = {
            ...completedContent,
            [selectedContent.id]: true,
          };
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedCompletedContent)
          );

          // Show success toast when content is marked as completed
          showSuccessToast("Lesson marked as completed!");

          // If autoplay is enabled and video is almost complete, start timer for next lesson
          if (autoplayEnabled && played > 0.95) {
            startAutoplayTimer();
          }
        }
      }
    }
  };

  /**
   * Handle quiz completion and mark content as completed
   * @param {Object} results - The quiz results
   */
  const handleQuizComplete = React.useCallback(
    (results) => {
      if (results.completed) {
        setCompletedContent((prev) => ({
          ...prev,
          [selectedContent?.id]: true,
        }));

        // Close the quiz modal after a short delay
        setTimeout(() => {
          setIsQuizModalOpen(false);

          // If autoplay is enabled, start timer for next lesson
          if (autoplayEnabled) {
            startAutoplayTimer();
            showInfoToast("Next lesson will start in 5 seconds");
          }
        }, 3000);
      }
    },
    [selectedContent, autoplayEnabled, startAutoplayTimer]
  );

  /**
   * Handle PDF view completion and mark as completed
   */
  const handlePdfCompleted = () => {
    setCompletedContent((prev) => ({
      ...prev,
      [selectedContent.id]: true,
    }));

    // Show success toast when PDF is marked as completed
    showSuccessToast("PDF lesson completed!");

    // If autoplay is enabled, start timer for next lesson
    if (autoplayEnabled) {
      startAutoplayTimer();
      showInfoToast("Next lesson will start in 5 seconds");
    }
  };

  /**
   * Render the appropriate content based on content type
   * @returns {JSX.Element} The rendered content component
   */
  const renderContent = () => {
    if (!selectedContent)
      return (
        <div className="select-content-message">
          Select a content item to begin
        </div>
      );

    switch (selectedContent.contentType) {
      case "video":
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
            {completedContent[selectedContent.id] && findNextLesson() && (
              <div className="next-lesson-container">
                {nextLessonId ? (
                  <div className="autoplay-info">
                    <span>
                      Next lesson in{" "}
                      <span className="countdown">
                        {Math.ceil(
                          (autoplayTimer?._idleStart +
                            autoplayTimer?._idleTimeout -
                            Date.now()) /
                            1000 || 5
                        )}
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

      case "pdf":
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
            {completedContent[selectedContent.id] && findNextLesson() && (
              <div className="next-lesson-container">
                {nextLessonId ? (
                  <div className="autoplay-info">
                    <span>
                      Next lesson in{" "}
                      <span className="countdown">
                        {Math.ceil(
                          (autoplayTimer?._idleStart +
                            autoplayTimer?._idleTimeout -
                            Date.now()) /
                            1000 || 5
                        )}
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

      case "quiz":
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

      default:
        return <div>Unsupported content type</div>;
    }
  };

  // Prepare course data for materials section
  const courseData = {
    price: "$70.00",
    instructor: "Edward Norton",
    duration: "3 weeks",
    lessons: "8",
    enrolled: "65 students",
    language: "English",
    certificate: "Yes",
  };

  // Prepare modules for course content
  const prepareModules = () => {
    const modules = [
      {
        weekRange: "1-4",
        description:
          "Introduction to Web Development: HTML, CSS, and JavaScript Basics",
        lessons: [
          {
            id: "lesson1",
            title: "Course Introduction",
            type: "video",
            questions: 0,
            duration: 8,
            contentType: "video",
            url: "https://www.youtube.com/watch?v=3JluqTojuME",
            description: "Introduction to the course and its objectives",
            source: "youtube",
          },
          {
            id: "lesson2",
            title: "HTML Fundamentals",
            type: "document",
            questions: 0,
            duration: 0,
            contentType: "pdf",
            url: "https://www.africau.edu/images/default/sample.pdf",
            fileSize: "1.2 MB",
            pages: 5,
            description: "Learn the basics of HTML structure and elements",
          },
          {
            id: "lesson3",
            title: "CSS Styling Basics",
            type: "video",
            questions: 0,
            duration: 12,
            contentType: "video",
            url: "assets/videos/over.mp4", // Local video example
            description: "Introduction to CSS styling and selectors",
            source: "local",
          },
          {
            id: "lesson4",
            title: "JavaScript Introduction",
            type: "document",
            questions: 0,
            duration: 0,
            contentType: "pdf",
            url: "https://www.africau.edu/images/default/sample.pdf",
            fileSize: "2.4 MB",
            pages: 10,
            description: "Introduction to JavaScript programming",
          },
          {
            id: "lesson5",
            title: "Setting Up Your Development Environment",
            type: "document",
            questions: 0,
            duration: 0,
            contentType: "pdf",
            url: "https://www.africau.edu/images/default/sample.pdf",
            fileSize: "1.5 MB",
            pages: 7,
            description: "Instructions for setting up your coding environment",
          },
          {
            id: "lesson6",
            title: "HTML Forms and Inputs",
            type: "video",
            questions: 0,
            duration: 15,
            contentType: "video",
            url: "https://www.youtube.com/watch?v=fNcJuPIZ2WE",
            description: "Learn how to create and style HTML forms",
            source: "youtube",
          },
          {
            id: "lesson7",
            title: "Week 1-4 Quiz",
            type: "quiz",
            questions: 3,
            duration: 10,
            contentType: "quiz",
            description:
              "Test your knowledge of HTML, CSS, and JavaScript basics",
            quiz: {
              timeLimit: 600,
              questions: [
                {
                  id: 1,
                  question: "Which HTML tag is used to create a hyperlink?",
                  options: [
                    { id: "a", text: "<link>" },
                    { id: "b", text: "<a>" },
                    { id: "c", text: "<href>" },
                    { id: "d", text: "<url>" },
                  ],
                  correctAnswer: "b",
                },
                {
                  id: 2,
                  question:
                    "Which CSS property is used to change the text color?",
                  options: [
                    { id: "a", text: "text-color" },
                    { id: "b", text: "font-color" },
                    { id: "c", text: "color" },
                    { id: "d", text: "text-style" },
                  ],
                  correctAnswer: "c",
                },
                {
                  id: 3,
                  question:
                    "Which JavaScript function is used to select an HTML element by its ID?",
                  options: [
                    { id: "a", text: "document.query()" },
                    { id: "b", text: "document.getElementById()" },
                    { id: "c", text: "document.findElement()" },
                    { id: "d", text: "document.selectElement()" },
                  ],
                  correctAnswer: "b",
                },
              ],
            },
          },
        ],
      },
      {
        weekRange: "5-8",
        description:
          "Advanced Web Development: Responsive Design, APIs, and Frameworks",
        lessons: [
          {
            id: "lesson8",
            title: "Responsive Web Design",
            type: "video",
            questions: 0,
            duration: 18,
            contentType: "video",
            url: "assets/videos/next.mp4", // Local video example
            description: "Learn how to create responsive websites",
            source: "local",
          },
          {
            id: "lesson9",
            title: "CSS Frameworks Overview",
            type: "document",
            questions: 0,
            duration: 0,
            contentType: "pdf",
            url: "https://www.africau.edu/images/default/sample.pdf",
            fileSize: "0.9 MB",
            pages: 4,
            description: "Introduction to popular CSS frameworks",
          },
          {
            id: "lesson10",
            title: "Working with APIs",
            type: "video",
            questions: 0,
            duration: 20,
            contentType: "video",
            url: "https://www.youtube.com/watch?v=GZvSYJDk-us",
            description: "Learn how to work with RESTful APIs",
            source: "youtube",
          },
          {
            id: "lesson11",
            title: "JavaScript Frameworks Introduction",
            type: "document",
            questions: 0,
            duration: 0,
            contentType: "pdf",
            url: "https://www.africau.edu/images/default/sample.pdf",
            fileSize: "1.0 MB",
            pages: 5,
            description: "Overview of popular JavaScript frameworks",
          },
          {
            id: "lesson12",
            title: "Building a Simple Web Application",
            type: "video",
            questions: 0,
            duration: 25,
            contentType: "video",
            url: "assets/videos/demo.mp4", // Local video example
            description: "Step-by-step guide to building a web application",
            source: "local",
          },
          {
            id: "lesson13",
            title: "Web Performance Optimization",
            type: "document",
            questions: 0,
            duration: 0,
            contentType: "pdf",
            url: "https://www.africau.edu/images/default/sample.pdf",
            fileSize: "0.7 MB",
            pages: 3,
            description: "Techniques for optimizing web performance",
          },
          {
            id: "lesson14",
            title: "Final Course Quiz",
            type: "quiz",
            questions: 4,
            duration: 15,
            contentType: "quiz",
            description:
              "Test your knowledge of advanced web development concepts",
            quiz: {
              timeLimit: 900,
              questions: [
                {
                  id: 1,
                  question:
                    "Which CSS property is used to create a responsive grid layout?",
                  options: [
                    { id: "a", text: "display: grid" },
                    { id: "b", text: "display: flex" },
                    { id: "c", text: "display: responsive" },
                    { id: "d", text: "display: layout" },
                  ],
                  correctAnswer: "a",
                },
                {
                  id: 2,
                  question: "What does API stand for?",
                  options: [
                    { id: "a", text: "Application Programming Interface" },
                    { id: "b", text: "Advanced Programming Integration" },
                    { id: "c", text: "Application Process Integration" },
                    { id: "d", text: "Automated Programming Interface" },
                  ],
                  correctAnswer: "a",
                },
                {
                  id: 3,
                  question:
                    "Which of the following is NOT a JavaScript framework?",
                  options: [
                    { id: "a", text: "React" },
                    { id: "b", text: "Angular" },
                    { id: "c", text: "Vue" },
                    { id: "d", text: "Bootstrap" },
                  ],
                  correctAnswer: "d",
                },
                {
                  id: 4,
                  question:
                    "Which HTTP method is typically used to update an existing resource?",
                  options: [
                    { id: "a", text: "GET" },
                    { id: "b", text: "POST" },
                    { id: "c", text: "PUT" },
                    { id: "d", text: "DELETE" },
                  ],
                  correctAnswer: "c",
                },
              ],
            },
          },
        ],
      },
      {
        weekRange: "9-12",
        description:
          "Backend Development and Deployment: Node.js, Databases, and Cloud Hosting",
        lessons: [
          {
            id: "lesson15",
            title: "Introduction to Backend Development",
            type: "video",
            questions: 0,
            duration: 15,
            contentType: "video",
            url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
            description: "Overview of backend development concepts",
            source: "youtube",
          },
          {
            id: "lesson16",
            title: "Node.js Fundamentals",
            type: "document",
            questions: 0,
            duration: 0,
            contentType: "pdf",
            url: "https://www.africau.edu/images/default/sample.pdf",
            fileSize: "1.3 MB",
            pages: 8,
            description: "Introduction to Node.js and its core concepts",
          },
          {
            id: "lesson17",
            title: "Database Basics: SQL vs NoSQL",
            type: "video",
            questions: 0,
            duration: 22,
            contentType: "video",
            url: "/videos/database-basics.mp4", // Local video example
            description: "Understanding different database types",
            source: "local",
          },
          {
            id: "lesson18",
            title: "RESTful API Development",
            type: "document",
            questions: 0,
            duration: 0,
            contentType: "pdf",
            url: "https://www.africau.edu/images/default/sample.pdf",
            fileSize: "1.1 MB",
            pages: 6,
            description: "Guide to building RESTful APIs",
          },
          {
            id: "lesson19",
            title: "Cloud Deployment Strategies",
            type: "video",
            questions: 0,
            duration: 18,
            contentType: "video",
            url: "https://www.youtube.com/watch?v=Xs0g_ZEv2bw",
            description: "Learn how to deploy applications to the cloud",
            source: "youtube",
          },
          {
            id: "lesson20",
            title: "Final Project Quiz",
            type: "quiz",
            questions: 5,
            duration: 20,
            contentType: "quiz",
            description: "Test your knowledge of backend development",
            quiz: {
              timeLimit: 1200,
              questions: [
                {
                  id: 1,
                  question: "What is Node.js?",
                  options: [
                    { id: "a", text: "A JavaScript framework" },
                    { id: "b", text: "A JavaScript runtime environment" },
                    { id: "c", text: "A database system" },
                    { id: "d", text: "A programming language" },
                  ],
                  correctAnswer: "b",
                },
                {
                  id: 2,
                  question: "Which of the following is a NoSQL database?",
                  options: [
                    { id: "a", text: "MySQL" },
                    { id: "b", text: "PostgreSQL" },
                    { id: "c", text: "MongoDB" },
                    { id: "d", text: "Oracle" },
                  ],
                  correctAnswer: "c",
                },
                {
                  id: 3,
                  question: "What does REST stand for in RESTful API?",
                  options: [
                    { id: "a", text: "Representational State Transfer" },
                    { id: "b", text: "Remote Endpoint Service Technology" },
                    { id: "c", text: "Resource Entity Service Transfer" },
                    { id: "d", text: "Remote Entity State Technology" },
                  ],
                  correctAnswer: "a",
                },
                {
                  id: 4,
                  question: "Which cloud provider offers AWS Lambda?",
                  options: [
                    { id: "a", text: "Google" },
                    { id: "b", text: "Microsoft" },
                    { id: "c", text: "Amazon" },
                    { id: "d", text: "IBM" },
                  ],
                  correctAnswer: "c",
                },
                {
                  id: 5,
                  question:
                    "What is the main advantage of serverless architecture?",
                  options: [
                    { id: "a", text: "Lower cost due to pay-per-use model" },
                    { id: "b", text: "More control over server hardware" },
                    { id: "c", text: "Simpler database management" },
                    { id: "d", text: "Better security by default" },
                  ],
                  correctAnswer: "a",
                },
              ],
            },
          },
        ],
      },
    ];

    return modules;
  };

  // Sample comments data
  const sampleComments = [
    {
      id: 1,
      name: "John Smith",
      date: "Oct 10, 2021",
      text: "This course has been very helpful. The content is well-structured and easy to follow.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      date: "Oct 15, 2021",
      text: "I really enjoyed the practical examples. They helped me understand the concepts better.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Michael Brown",
      date: "Oct 19, 2021",
      text: "The instructor explains everything clearly. I would recommend this course to beginners.",
      avatar: "https://randomuser.me/api/portraits/men/68.jpg",
    },
  ];

  return (
    <div className="new-course-player">
      <CourseHeader title="Topics for This Course" />

      <div className="course-player-layout">
        {/* Video Player - Always at top on mobile */}
        <div id="player-section" className="content-player-section">
          {renderContent()}
        </div>

        {/* Course Content - Second on mobile */}
        <div className="course-content-sidebar">
          {/* Course Progress Bar */}
          <div className="course-progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <div className="progress-text">{calculateProgress()}% Complete</div>
          </div>

          <CourseContent
            modules={prepareModules()}
            completedContent={completedContent}
            onSelectLesson={handleLessonSelect}
          />
        </div>

        {/* Materials and Comments - Last on mobile */}
        <div className="course-player-main">
          <div id="curriculum-section" className="content-materials-section">
            <CourseMaterials courseData={courseData} />
          </div>

          <div id="comments-section" className="content-comments-section">
            <Comments comments={sampleComments} />
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <Modal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        title="Quiz"
      >
        {activeQuiz && (
          <Quiz quiz={activeQuiz} onComplete={handleQuizComplete} />
        )}
      </Modal>

      {/* Ask Question Modal */}
      <AskQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardModalOpen}
        onClose={() => setIsLeaderboardModalOpen(false)}
      />
    </div>
  );
};

export default NewCoursePlayer;
