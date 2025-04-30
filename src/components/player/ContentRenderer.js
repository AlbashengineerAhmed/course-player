import React from 'react';
import VideoContent from './VideoContent';
import PDFContent from './PDFContent';
import QuizContent from './QuizContent';

/**
 * ContentRenderer component that renders the appropriate content based on type
 * @param {Object} props - Component props
 * @param {Object} props.selectedContent - The selected content
 * @param {Object} props.contentProps - Additional props for content components
 * @returns {JSX.Element} The rendered component
 */
const ContentRenderer = ({ selectedContent, contentProps }) => {
  if (!selectedContent) {
    return (
      <div className="no-content-selected">
        <p>Please select a lesson from the course content.</p>
      </div>
    );
  }

  // Render based on content type
  switch (selectedContent.contentType) {
    case 'video':
      return <VideoContent selectedContent={selectedContent} {...contentProps} />;
    
    case 'pdf':
      return <PDFContent selectedContent={selectedContent} {...contentProps} />;
    
    case 'quiz':
      return <QuizContent selectedContent={selectedContent} {...contentProps} />;
    
    default:
      return (
        <div className="unsupported-content">
          <p>This content type is not supported.</p>
        </div>
      );
  }
};

export default ContentRenderer;
