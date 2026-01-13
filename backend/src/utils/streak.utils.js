const { getDayOfWeek, formatDate } = require('./date.utils');

/**
 * Calculate streak for a routine based on completion history
 * @param {Array<string>} frequency - Days routine should be completed (e.g., ['mon', 'tue', 'wed'])
 * @param {Object} completionHistory - Object with dates as keys and completion status
 * @returns {number} Current streak count
 */
const calculateStreak = (frequency, completionHistory) => {
    let streak = 0;
    const today = new Date();

    // Go backwards from today
    for (let i = 0; i < 365; i++) { // Max 365 days lookback
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateString = formatDate(checkDate);
        const dayOfWeek = getDayOfWeek(dateString);

        // Check if this day is in the routine's frequency
        if (frequency.includes(dayOfWeek)) {
            if (completionHistory[dateString]) {
                streak++;
            } else {
                // Streak broken
                break;
            }
        }
    }

    return streak;
};

/**
 * Calculate completion percentage
 * @param {number} completed - Number of completed tasks
 * @param {number} total - Total number of tasks
 * @returns {number} Percentage (0-100)
 */
const calculateCompletionPercentage = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
};

module.exports = {
    calculateStreak,
    calculateCompletionPercentage
};
