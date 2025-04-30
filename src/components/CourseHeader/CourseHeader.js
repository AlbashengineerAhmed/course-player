import React from "react";
import "./CourseHeader.css";

const CourseHeader = ({ title }) => {
  return (
    <div className="course-header">
      <h1 className="course-title">{title}</h1>
    </div>
  );
};

export default CourseHeader;
