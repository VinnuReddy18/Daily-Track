/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} Current date
 */
const getCurrentDate = () => {
    const now = new Date();
    return formatDate(now);
};

/**
 * Format date object to YYYY-MM-DD string
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Get day of week from date string
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Day of week (mon, tue, wed, etc.)
 */
const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[date.getDay()];
};

/**
 * Get dates for the current week (Monday to Sunday)
 * @returns {Array<string>} Array of dates in YYYY-MM-DD format
 */
const getCurrentWeekDates = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // Adjust to Monday

    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        weekDates.push(formatDate(date));
    }

    return weekDates;
};

/**
 * Validate date string format (YYYY-MM-DD)
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid, false otherwise
 */
const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

module.exports = {
    getCurrentDate,
    formatDate,
    getDayOfWeek,
    getCurrentWeekDates,
    isValidDate
};
