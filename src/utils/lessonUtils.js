/**
 * Utility functions for handling lessons and course content
 */

/**
 * Check if a lesson is unlocked based on completion of previous lessons
 * @param {Array} modules - The course modules
 * @param {Object} completedContent - Object tracking completed content
 * @param {Number} moduleIndex - The module index
 * @param {Number} lessonIndex - The lesson index
 * @returns {Boolean} Whether the lesson is unlocked
 */
export const isLessonUnlocked = (modules, completedContent, moduleIndex, lessonIndex) => {
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

/**
 * Find the next lesson in the course
 * @param {Array} modules - The course modules
 * @param {Object} selectedContent - Currently selected content
 * @param {Object} completedContent - Object tracking completed content
 * @returns {Object|null} The next lesson object or null if not found
 */
export const findNextLesson = (modules, selectedContent, completedContent) => {
  if (!selectedContent) return null;

  // Get all lessons from all modules
  const allLessons = modules.flatMap((module) => module.lessons);

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
};

/**
 * Calculate the overall course progress percentage
 * @param {Array} courseContent - All course content items
 * @param {Object} completedContent - Object tracking completed content
 * @returns {number} Progress percentage (0-100)
 */
export const calculateProgress = (courseContent, completedContent) => {
  if (!courseContent || courseContent.length === 0) return 0;

  const completedCount = Object.keys(completedContent).length;
  return Math.round((completedCount / courseContent.length) * 100);
};
