const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const {
    markTaskCompleted,
    unmarkTaskCompleted,
    getDailyStats,
    getWeeklyStats
} = require('../controllers/stats.controller');

/**
 * @route   POST /completion
 * @desc    Mark a task as completed
 * @access  Private
 */
router.post('/completion', authenticate, markTaskCompleted);

/**
 * @route   DELETE /completion/:taskId
 * @desc    Unmark a task as completed
 * @access  Private
 */
router.delete('/completion/:taskId', authenticate, unmarkTaskCompleted);

/**
 * @route   GET /stats/daily?date=YYYY-MM-DD
 * @desc    Get daily statistics
 * @access  Private
 */
router.get('/daily', authenticate, getDailyStats);

/**
 * @route   GET /stats/weekly
 * @desc    Get weekly statistics
 * @access  Private
 */
router.get('/weekly', authenticate, getWeeklyStats);

module.exports = router;
