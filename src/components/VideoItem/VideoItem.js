import React from "react";
import "./VideoItem.css";

const VideoItem = ({ video, onVideoSelect, isWatched, isSelected }) => {
  // Get content type icon
  const getContentTypeIcon = (contentType) => {
    switch (contentType) {
      case "video":
        return "🎬";
      case "pdf":
        return "📄";
      case "quiz":
        return "❓";
      default:
        return "📝";
    }
  };

  // Get content duration or size
  const getContentMeta = (content) => {
    if (content.contentType === "video") {
      return content.duration;
    } else if (content.contentType === "pdf") {
      return `${content.pages} pages • ${content.fileSize}`;
    } else if (content.contentType === "quiz") {
      return content.duration;
    }
    return "";
  };

  return (
    <div
      className={`content-item ${isSelected ? "selected" : ""} ${
        isWatched ? "completed" : ""
      } ${video.contentType}`}
      onClick={() => onVideoSelect(video)}
    >
      <div className="content-item-content">
        <div className="content-type-icon">
          {getContentTypeIcon(video.contentType)}
        </div>
        <div className="content-item-info">
          <h4 className="content-item-title">
            {video.title}
            {isWatched && <span className="completed-indicator">✓</span>}
          </h4>
          <div className="content-item-details">
            <span className="content-item-type">{video.type}</span>
            <span className="content-item-duration">
              {getContentMeta(video)}
            </span>
            {video.hasQuiz && <span className="content-item-quiz">Quiz</span>}
            {video.optional && (
              <span className="content-item-optional">Optional</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
