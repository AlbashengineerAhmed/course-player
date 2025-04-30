/**
 * Utility functions for handling localStorage operations
 */

// Storage key for completed content
export const STORAGE_KEY = "completedContent";

/**
 * Load completed content from localStorage
 * @returns {Object} The completed content object or empty object if not found
 */
export const loadCompletedContent = () => {
  const savedContent = localStorage.getItem(STORAGE_KEY);
  return savedContent ? JSON.parse(savedContent) : {};
};

/**
 * Save completed content to localStorage
 * @param {Object} completedContent - The completed content object to save
 */
export const saveCompletedContent = (completedContent) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completedContent));
};

/**
 * Mark a content item as completed
 * @param {Object} completedContent - Current completed content state
 * @param {string} contentId - ID of the content to mark as completed
 * @returns {Object} Updated completed content object
 */
export const markContentAsCompleted = (completedContent, contentId) => {
  const updatedContent = {
    ...completedContent,
    [contentId]: true,
  };
  saveCompletedContent(updatedContent);
  return updatedContent;
};

/**
 * Load watch progress from localStorage
 * @returns {Object} The watch progress object or empty object if not found
 */
export const loadWatchProgress = () => {
  const savedProgress = localStorage.getItem("watchProgress");
  return savedProgress ? JSON.parse(savedProgress) : {};
};

/**
 * Save watch progress to localStorage
 * @param {Object} watchProgress - The watch progress object to save
 */
export const saveWatchProgress = (watchProgress) => {
  localStorage.setItem("watchProgress", JSON.stringify(watchProgress));
};

/**
 * Update watch progress for a specific video
 * @param {Object} watchProgress - Current watch progress state
 * @param {string} videoId - ID of the video to update progress for
 * @param {number} progress - Current playback position in seconds
 * @returns {Object} Updated watch progress object
 */
export const updateWatchProgress = (watchProgress, videoId, progress) => {
  const updatedProgress = {
    ...watchProgress,
    [videoId]: progress,
  };
  saveWatchProgress(updatedProgress);
  return updatedProgress;
};
