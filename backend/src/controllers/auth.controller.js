const bcrypt = require('bcrypt');
const { getDatabase } = require('../config/firebase');
const { generateToken } = require('../config/jwt');

/**
 * Register a new user
 * POST /auth/register
 */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        const db = getDatabase();
        const usersRef = db.ref('users');

        // Check if user already exists
        const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');
        if (snapshot.exists()) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUserRef = usersRef.push();
        const userId = newUserRef.key;

        const userData = {
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        await newUserRef.set(userData);

        // Generate JWT token
        const token = generateToken(userId);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: {
                    id: userId,
                    name,
                    email,
                    createdAt: userData.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

/**
 * Login user
 * POST /auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const db = getDatabase();
        const usersRef = db.ref('users');

        // Find user by email
        const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');

        if (!snapshot.exists()) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Get user data
        const users = snapshot.val();
        const userId = Object.keys(users)[0];
        const user = users[userId];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = generateToken(userId);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: userId,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

/**
 * Change user password
 * PUT /auth/change-password
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId; // From auth middleware

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        // Validate new password length
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        const db = getDatabase();
        const userRef = db.ref(`users/${userId}`);

        // Get user data
        const snapshot = await userRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = snapshot.val();

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await userRef.update({
            password: hashedPassword,
            updatedAt: new Date().toISOString()
        });

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
};

/**
 * Delete user account and all associated data
 * DELETE /auth/account
 */
const deleteAccount = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware

        const db = getDatabase();

        // Delete all user routines
        const routinesRef = db.ref('routines');
        const routinesSnapshot = await routinesRef.orderByChild('userId').equalTo(userId).once('value');
        if (routinesSnapshot.exists()) {
            const routines = routinesSnapshot.val();
            const deleteRoutinesPromises = Object.keys(routines).map(routineId =>
                db.ref(`routines/${routineId}`).remove()
            );
            await Promise.all(deleteRoutinesPromises);
        }

        // Delete all user tasks
        const tasksRef = db.ref('tasks');
        const tasksSnapshot = await tasksRef.once('value');
        if (tasksSnapshot.exists()) {
            const tasks = tasksSnapshot.val();
            const deleteTasksPromises = [];
            Object.keys(tasks).forEach(taskId => {
                const task = tasks[taskId];
                // Check if task belongs to user's routine
                if (routinesSnapshot.exists()) {
                    const routines = routinesSnapshot.val();
                    if (Object.keys(routines).includes(task.routineId)) {
                        deleteTasksPromises.push(db.ref(`tasks/${taskId}`).remove());
                    }
                }
            });
            await Promise.all(deleteTasksPromises);
        }

        // Delete all user completions
        const completionsRef = db.ref('completions');
        const completionsSnapshot = await completionsRef.once('value');
        if (completionsSnapshot.exists()) {
            const completions = completionsSnapshot.val();
            const deleteCompletionsPromises = [];
            Object.keys(completions).forEach(date => {
                if (completions[date][userId]) {
                    deleteCompletionsPromises.push(
                        db.ref(`completions/${date}/${userId}`).remove()
                    );
                }
            });
            await Promise.all(deleteCompletionsPromises);
        }

        // Delete user account
        await db.ref(`users/${userId}`).remove();

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting account',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    changePassword,
    deleteAccount
};
