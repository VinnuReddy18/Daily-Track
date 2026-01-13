const express = require('express');
const router = express.Router();
const { register, login, changePassword, deleteAccount } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   PUT /auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', authenticate, changePassword);

/**
 * @route   DELETE /auth/account
 * @desc    Delete user account and all data
 * @access  Private
 */
router.delete('/account', authenticate, deleteAccount);

module.exports = router;
