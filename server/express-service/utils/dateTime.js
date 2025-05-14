/**
 * Date and time utility functions for the application
 */

/**
 * Gets the current date and time in MySQL format: YYYY-MM-DD HH:MM:SS
 * @returns {string} Formatted date time string
 */
function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Formats a date string in the format YYYY-MM-DD
 * @param {string} year - The year
 * @param {string} month - The month
 * @param {string} day - The day
 * @returns {string} Formatted date string
 */
function formatDate(year, month, day) {
  if (month.length === 1) {
    month = "0" + month;
  }

  if (day.length === 1) {
    day = "0" + day;
  }

  return `${year}-${month}-${day}`;
}

module.exports = {
  getCurrentDateTime,
  formatDate,
};
