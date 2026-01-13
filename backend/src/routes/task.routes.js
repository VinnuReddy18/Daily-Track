const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} = require('../controllers/task.controller');

/**
 * @route   POST /tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/', authenticate, createTask);

/**
 * @route   GET /tasks?routineId=xxx
 * @desc    Get all tasks for a routine
 * @access  Private
 */
router.get('/', authenticate, getTasks);

/**
 * @route   PUT /tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put('/:id', authenticate, updateTask);

/**
 * @route   DELETE /tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id', authenticate, deleteTask);

module.exports = router;
