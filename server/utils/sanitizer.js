/**
 * Input sanitization utility functions for the application
 */

const xss = require("xss");
const natural = require("natural");

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - The input to sanitize
 * @returns {string} The sanitized input
 */
function sanitize(input) {
  if (input === null || input === undefined) {
    return "";
  }
  return xss(input);
}

/**
 * Checks if two strings are similar using Jaro-Winkler distance
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @param {number} threshold - Similarity threshold (default: 0.8)
 * @returns {boolean} True if strings are similar, false otherwise
 */

function areStringsSimilar(str1, str2, threshold = 0.8) {
  const similarity = natural.JaroWinklerDistance(
    str1.toLowerCase(),
    str2.toLowerCase()
  );
  return similarity > threshold;
}

module.exports = {
  sanitize,
  areStringsSimilar,
};
