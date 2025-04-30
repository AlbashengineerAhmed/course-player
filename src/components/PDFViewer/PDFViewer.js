import React, { useState, useEffect, useRef } from "react";
import "./PDFViewer.css";

const PDFViewer = ({ pdfUrl, title, fileSize, pages, onComplete }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const iframeRef = useRef(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Track PDF reading progress
  useEffect(() => {
    const handleScroll = () => {
      try {
        const iframe = iframeRef.current;
        if (!iframe || !iframe.contentWindow || !iframe.contentDocument) return;

        const scrollHeight = iframe.contentDocument.body.scrollHeight;
        const scrollTop =
          iframe.contentDocument.documentElement.scrollTop ||
          iframe.contentDocument.body.scrollTop;
        const clientHeight =
          iframe.contentDocument.documentElement.clientHeight;

        // Calculate reading progress - ensure it doesn't exceed 100%
        const progress = Math.min(
          100,
          Math.round(((scrollTop + clientHeight) / scrollHeight) * 100)
        );
        setReadingProgress(progress);
      } catch (error) {
        console.error("Error tracking PDF scroll:", error);
      }
    };

    // Add event listener to iframe after it loads
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.onload = () => {
        try {
          // Initial progress check
          setTimeout(handleScroll, 1000);

          // Add scroll event listener
          iframe.contentWindow.addEventListener("scroll", handleScroll);

          // Also track mouse movements and clicks to detect active reading
          iframe.contentWindow.addEventListener("mousemove", handleScroll);
          iframe.contentWindow.addEventListener("click", handleScroll);
        } catch (error) {
          console.error("Error adding event listeners:", error);
        }
      };
    }

    return () => {
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.removeEventListener("scroll", handleScroll);
          iframe.contentWindow.removeEventListener("mousemove", handleScroll);
          iframe.contentWindow.removeEventListener("click", handleScroll);
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  // Handle complete button click
  const handleCompleteClick = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className={`pdf-viewer ${isFullscreen ? "fullscreen" : ""}`}>
      <div className="pdf-viewer-header">
        <h3>{title}</h3>
        <div className="pdf-status-badge">
          {localStorage.getItem("completedContent") &&
          JSON.parse(localStorage.getItem("completedContent"))[title]
            ? "Completed"
            : "In Progress"}
        </div>
        <div className="pdf-viewer-controls">
          <button className="fullscreen-button" onClick={toggleFullscreen}>
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="download-button"
          >
            Download PDF
          </a>
        </div>
      </div>
      <div className="pdf-viewer-info">
        <span>File Size: {fileSize}</span>
        <span>Pages: {pages}</span>
        <div className="pdf-progress">
          <div className="pdf-progress-bar">
            <div
              className="pdf-progress-fill"
              style={{ width: `${readingProgress}%` }}
            ></div>
          </div>
          <span className="pdf-progress-text">{readingProgress}% read</span>
        </div>
        <button className="pdf-complete-button" onClick={handleCompleteClick}>
          Mark as completed
        </button>
      </div>
      <div className="pdf-container">
        <iframe
          ref={iframeRef}
          src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          title={title}
          width="100%"
          height="100%"
          frameBorder="0"
        />
      </div>
    </div>
  );
};

export default PDFViewer;
