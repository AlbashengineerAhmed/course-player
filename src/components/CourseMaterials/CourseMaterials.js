import React from "react";
import "./CourseMaterials.css";

const CourseMaterials = ({ courseData }) => {
  const {
    price,
    instructor,
    duration,
    lessons,
    enrolled,
    language,
    certificate,
  } = courseData;

  return (
    <div className="course-materials">
      <h2 className="materials-title">Course Includes:</h2>

      <div className="materials-grid">
        <div className="material-item">
          <div className="material-icon">
            <i className="fas fa-tag"></i>
          </div>
          <div className="material-label">Price:</div>
          <div className="material-value price">{price}</div>
        </div>

        <div className="material-item">
          <div className="material-icon">
            <i className="fas fa-user-tie"></i>
          </div>
          <div className="material-label">Instructor:</div>
          <div className="material-value">{instructor}</div>
        </div>

        <div className="material-item">
          <div className="material-icon">
            <i className="far fa-clock"></i>
          </div>
          <div className="material-label">Duration:</div>
          <div className="material-value">{duration}</div>
        </div>

        <div className="material-item">
          <div className="material-icon">
            <i className="fas fa-book"></i>
          </div>
          <div className="material-label">Lessons:</div>
          <div className="material-value">{lessons}</div>
        </div>

        <div className="material-item">
          <div className="material-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="material-label">Enrolled:</div>
          <div className="material-value">{enrolled}</div>
        </div>

        <div className="material-item">
          <div className="material-icon">
            <i className="fas fa-globe"></i>
          </div>
          <div className="material-label">Language:</div>
          <div className="material-value">{language}</div>
        </div>

        <div className="material-item">
          <div className="material-icon">
            <i className="fas fa-certificate"></i>
          </div>
          <div className="material-label">Certificate:</div>
          <div className="material-value">{certificate}</div>
        </div>
      </div>
    </div>
  );
};

export default CourseMaterials;
