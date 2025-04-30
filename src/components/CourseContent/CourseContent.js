import React, { useState, useEffect } from "react";
import "./CourseContent.css";

const CourseContent = ({ modules, completedContent, onSelectLesson }) => {
  const [expandedModules, setExpandedModules] = useState({});

  // Initialize all modules as expanded by default
  useEffect(() => {
    const initialExpandedState = {};
    modules.forEach((_, index) => {
      initialExpandedState[index] = true;
    });
    setExpandedModules(initialExpandedState);

    // Force re-render after a short delay to ensure lessons are displayed
    const timer = setTimeout(() => {
      setExpandedModules({ ...initialExpandedState });
    }, 100);

    return () => clearTimeout(timer);
  }, [modules]);

  // Function to toggle module expansion - only affects the clicked module
  const toggleModule = (moduleIndex) => {
    // Get current state
    const isCurrentlyExpanded = expandedModules[moduleIndex];

    // Toggle the module
    setExpandedModules((prev) => ({
      ...prev,
      [moduleIndex]: !isCurrentlyExpanded,
    }));

    // Force a re-render after a short delay if expanding
    if (!isCurrentlyExpanded) {
      setTimeout(() => {
        // Force a refresh of the DOM to ensure proper rendering
        const moduleElement = document.querySelectorAll(".module")[moduleIndex];
        if (moduleElement) {
          moduleElement.style.height = "auto";
          moduleElement.style.overflow = "visible";
        }

        setExpandedModules((prev) => ({
          ...prev,
          [moduleIndex]: true,
        }));
      }, 50);
    }
  };
  // Function to check if a lesson should be unlocked
  const checkLessonUnlocked = (moduleIndex, lessonIndex) => {
    // First lesson of first module is always unlocked
    if (moduleIndex === 0 && lessonIndex === 0) return true;

    // If it's the first lesson of any other module, check if previous module's last lesson is completed
    if (lessonIndex === 0 && moduleIndex > 0) {
      const prevModule = modules[moduleIndex - 1];
      const prevModuleLastLessonId =
        prevModule.lessons[prevModule.lessons.length - 1].id;
      return completedContent[prevModuleLastLessonId] === true;
    }

    // For other lessons, check if the previous lesson is completed
    const prevLessonId = modules[moduleIndex].lessons[lessonIndex - 1].id;
    return completedContent[prevLessonId] === true;
  };

  return (
    <div className="course-content">
      {modules.map((module, moduleIndex) => (
        <div key={moduleIndex} className="module">
          <div
            className="module-header"
            onClick={() => toggleModule(moduleIndex)}
          >
            <div className="module-info">
              <h3 className="module-title">Week {module.weekRange}</h3>
              <p className="module-description">{module.description}</p>
            </div>
            <span
              className={`module-toggle ${
                expandedModules[moduleIndex] ? "expanded" : ""
              }`}
            >
              {expandedModules[moduleIndex] ? "−" : "+"}
            </span>
          </div>
          {/* Always render lessons, but control visibility with CSS */}
          <div
            className={`lessons-list ${
              expandedModules[moduleIndex] ? "visible" : "hidden"
            }`}
          >
            {module.lessons.map((lesson, lessonIndex) => {
              const isUnlocked = checkLessonUnlocked(moduleIndex, lessonIndex);
              const isCompleted = completedContent[lesson.id];

              return (
                <div
                  key={lessonIndex}
                  className={`lesson-item ${
                    isUnlocked ? "unlocked" : "locked"
                  } ${isCompleted ? "completed" : ""}`}
                  onClick={() => {
                    if (isUnlocked) {
                      onSelectLesson(lesson);
                    } else {
                      // Use the imported showWarningToast function
                      window.dispatchEvent(
                        new CustomEvent("showWarningToast", {
                          detail: {
                            message: "Please complete previous lessons first",
                          },
                        })
                      );
                    }
                  }}
                >
                  <div className="lesson-info">
                    <div className="lesson-icon">
                      <i
                        className={`far ${
                          lesson.contentType === "video"
                            ? "fa-file-video"
                            : lesson.contentType === "pdf"
                            ? "fa-file-pdf"
                            : lesson.contentType === "quiz"
                            ? "fa-question-circle"
                            : "fa-file-alt"
                        }`}
                      ></i>
                    </div>
                    <div className="lesson-title">
                      {lesson.title}
                      {lesson.source && (
                        <span className={`lesson-source ${lesson.source}`}>
                          {lesson.source === "youtube" ? (
                            <i className="fab fa-youtube"></i>
                          ) : lesson.source === "local" ? (
                            <i className="fas fa-server"></i>
                          ) : null}
                        </span>
                      )}
                      {isCompleted && (
                        <span className="lesson-completed-icon">
                          <i className="fas fa-check-circle"></i>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="lesson-meta">
                    {lesson.questions > 0 && (
                      <span className="lesson-questions">
                        <i className="fas fa-question-circle"></i>{" "}
                        {lesson.questions}
                      </span>
                    )}

                    {!isUnlocked && (
                      <span className="lesson-lock">
                        <i className="fas fa-lock"></i>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseContent;
