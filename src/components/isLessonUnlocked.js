/**
 * Check if a lesson is unlocked based on completion of previous lessons
 * @param {Array} modules - The course modules
 * @param {Object} completedContent - Object tracking completed content
 * @param {Number} moduleIndex - The module index
 * @param {Number} lessonIndex - The lesson index
 * @returns {Boolean} Whether the lesson is unlocked
 */
const isLessonUnlocked = (modules, completedContent, moduleIndex, lessonIndex) => {
  // First lesson is always unlocked
  if (moduleIndex === 0 && lessonIndex === 0) return true;

  // Get all lessons from all modules
  const allLessons = modules.flatMap((module) => module.lessons);
  
  // Find the current lesson in the flattened array
  let currentLessonFlatIndex = 0;
  
  for (let m = 0; m < moduleIndex; m++) {
    currentLessonFlatIndex += modules[m].lessons.length;
  }
  currentLessonFlatIndex += lessonIndex;
  
  // Previous lesson must be completed to unlock this one
  const previousLessonIndex = currentLessonFlatIndex - 1;
  if (previousLessonIndex >= 0) {
    return completedContent[allLessons[previousLessonIndex].id] === true;
  }
  
  return true;
};

export default isLessonUnlocked;
