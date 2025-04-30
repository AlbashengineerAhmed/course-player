import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import "./VideoPlayer.css";

const VideoPlayer = ({ video, onProgress, nextLessonId, autoplayEnabled }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWideMode, setIsWideMode] = useState(false);
  const [startAt, setStartAt] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const playerRef = useRef(null);
  const wrapperRef = useRef(null);

  // Load saved progress when component mounts
  useEffect(() => {
    if (video && video.id) {
      // Check if this video is completed
      const completedContent = JSON.parse(
        localStorage.getItem("completedContent") || "{}"
      );
      setIsCompleted(!!completedContent[video.id]);

      const savedProgress =
        window.watchProgress && window.watchProgress[video.id];
      if (savedProgress && savedProgress > 0) {
        // Start a bit before the saved position (2 seconds)
        const startPosition = Math.max(0, savedProgress - 2);
        setStartAt(startPosition);
      } else {
        setStartAt(0);
      }
    }
  }, [video]);

  // Update completion status whenever it might change
  useEffect(() => {
    // Listen for changes to completedContent in localStorage
    const handleStorageChange = () => {
      if (video && video.id) {
        const completedContent = JSON.parse(
          localStorage.getItem("completedContent") || "{}"
        );
        setIsCompleted(!!completedContent[video.id]);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check periodically
    const checkInterval = setInterval(() => {
      if (video && video.id) {
        const completedContent = JSON.parse(
          localStorage.getItem("completedContent") || "{}"
        );
        setIsCompleted(!!completedContent[video.id]);
      }
    }, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(checkInterval);
    };
  }, [video]);

  // Handle progress updates from ReactPlayer
  const handleProgress = (state) => {
    if (onProgress) {
      onProgress(state);
    }

    // Save progress to localStorage via custom event
    if (video && video.id && state.playedSeconds > 0) {
      window.dispatchEvent(
        new CustomEvent("saveVideoProgress", {
          detail: {
            videoId: video.id,
            progress: state.playedSeconds,
            played: state.played, // Add played percentage for more accurate completion tracking
          },
        })
      );
    }

    // Also check if we should update completion status
    if (video && video.id && state.played > 0.9) {
      const completedContent = JSON.parse(
        localStorage.getItem("completedContent") || "{}"
      );
      if (!completedContent[video.id]) {
        // If not already marked as completed, check again
        const updatedCompletedContent = JSON.parse(
          localStorage.getItem("completedContent") || "{}"
        );
        setIsCompleted(!!updatedCompletedContent[video.id]);
      }
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (wrapperRef.current.requestFullscreen) {
        wrapperRef.current.requestFullscreen();
        setIsFullscreen(true);
        // Notify parent component about fullscreen change
        window.dispatchEvent(
          new CustomEvent("videoFullscreenChange", {
            detail: { isFullscreen: true },
          })
        );
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
        // Notify parent component about fullscreen change
        window.dispatchEvent(
          new CustomEvent("videoFullscreenChange", {
            detail: { isFullscreen: false },
          })
        );
      }
    }
  };

  // Toggle wide mode (desktop only)
  const toggleWideMode = () => {
    setIsWideMode(!isWideMode);

    // Dispatch an event to notify parent components about the mode change
    window.dispatchEvent(
      new CustomEvent("playerModeChange", {
        detail: { isWideMode: !isWideMode },
      })
    );
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      className={`video-player-container ${isWideMode ? "wide-mode" : ""} ${
        isFullscreen ? "fullscreen" : ""
      }`}
      ref={wrapperRef}
    >
      <div className="video-player-wrapper">
        <div
          className={`video-status-badge ${
            isCompleted ? "completed" : "incomplete"
          }`}
        >
          {isCompleted ? "Completed" : "In Progress"}
        </div>
        <ReactPlayer
          ref={playerRef}
          url={video.url}
          className="react-player"
          width="100%"
          height="100%"
          controls={true}
          playing={true}
          onProgress={handleProgress}
          progressInterval={1000} // Check progress every second
          config={{
            youtube: {
              playerVars: {
                showinfo: 1,
                start: Math.floor(startAt),
              },
            },
            file: {
              attributes: {
                controlsList: "nodownload",
              },
              forceVideo: true,
            },
          }}
        />

        {/* Autoplay next lesson countdown */}
        {nextLessonId && autoplayEnabled && (
          <div className="autoplay-countdown">
            <div className="autoplay-message">
              Next lesson starting in <span className="countdown-timer">5</span>{" "}
              seconds
            </div>
            <button
              className="cancel-autoplay"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("cancelAutoplay"))
              }
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="video-player-controls">
        <div className="lesson-title-display">
          {video.title}
          <span
            className={`lesson-status-indicator ${
              isCompleted ? "completed" : "in-progress"
            }`}
          >
            {isCompleted ? "Completed" : "In Progress"}
          </span>
        </div>
        <div className="player-view-controls">
          <button
            className={`view-button ${isWideMode ? "active" : ""}`}
            onClick={toggleWideMode}
            title="Wide Mode"
          >
            <i className="fas fa-arrows-alt-h"></i>
          </button>
          <button
            className={`view-button ${isFullscreen ? "active" : ""}`}
            onClick={toggleFullscreen}
            title="Fullscreen"
          >
            <i className="fas fa-expand"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
