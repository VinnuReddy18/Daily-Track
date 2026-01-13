const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const {
    createRoutine,
    getRoutines,
    updateRoutine,
    deleteRoutine
} = require('../controllers/routine.controller');

/**
 * @route   POST /routines
 * @desc    Create a new routine
 * @access  Private
 */
router.post('/', authenticate, createRoutine);

/**
 * @route   GET /routines
 * @desc    Get all routines for logged-in user
 * @access  Private
 */
router.get('/', authenticate, getRoutines);

/**
 * @route   PUT /routines/:id
 * @desc    Update a routine
 * @access  Private
 */
router.put('/:id', authenticate, updateRoutine);

/**
 * @route   DELETE /routines/:id
 * @desc    Delete a routine
 * @access  Private
 */
router.delete('/:id', authenticate, deleteRoutine);

module.exports = router;
