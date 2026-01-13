const { getDatabase } = require('../config/firebase');
const { getCurrentDate, getCurrentWeekDates, isValidDate } = require('../utils/date.utils');
const { calculateCompletionPercentage, calculateStreak } = require('../utils/streak.utils');

/**
 * Mark a task as completed
 * POST /completion
 */
const markTaskCompleted = async (req, res) => {
    try {
        const { taskId, routineId, date } = req.body;
        const userId = req.userId;

        // Validate input
        if (!taskId || !routineId) {
            return res.status(400).json({
                success: false,
                message: 'Task ID and routine ID are required'
            });
        }

        const completionDate = date || getCurrentDate();

        // Validate date format
        if (!isValidDate(completionDate)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        const db = getDatabase();

        // Verify task exists
        const taskRef = db.ref(`tasks/${taskId}`);
        const taskSnapshot = await taskRef.once('value');

        if (!taskSnapshot.exists()) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Verify routine belongs to user
        const routineRef = db.ref(`routines/${routineId}`);
        const routineSnapshot = await routineRef.once('value');

        if (!routineSnapshot.exists()) {
            return res.status(404).json({
                success: false,
                message: 'Routine not found'
            });
        }

        const routine = routineSnapshot.val();
        if (routine.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to complete this task'
            });
        }

        // Mark task as completed
        const completionRef = db.ref(`completions/${completionDate}/${userId}/${taskId}`);
        await completionRef.set(true);

        res.status(200).json({
            success: true,
            message: 'Task marked as completed',
            data: {
                taskId,
                routineId,
                date: completionDate,
                completed: true
            }
        });
    } catch (error) {
        console.error('Mark task completed error:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking task as completed',
            error: error.message
        });
    }
};

/**
 * Get daily statistics
 * GET /stats/daily?date=YYYY-MM-DD
 */
const getDailyStats = async (req, res) => {
    try {
        const { date } = req.query;
        const userId = req.userId;
        const targetDate = date || getCurrentDate();

        // Validate date format
        if (!isValidDate(targetDate)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        const db = getDatabase();

        // Get all user's routines
        const routinesRef = db.ref('routines');
        const routinesSnapshot = await routinesRef.orderByChild('userId').equalTo(userId).once('value');

        if (!routinesSnapshot.exists()) {
            return res.status(200).json({
                success: true,
                message: 'No routines found',
                data: {
                    date: targetDate,
                    totalTasks: 0,
                    completedTasks: 0,
                    completionPercentage: 0,
                    tasks: []
                }
            });
        }

        // Get all tasks for user's routines
        const routineIds = [];
        routinesSnapshot.forEach((childSnapshot) => {
            routineIds.push(childSnapshot.key);
        });

        const tasksRef = db.ref('tasks');
        const allTasks = [];

        for (const routineId of routineIds) {
            const tasksSnapshot = await tasksRef.orderByChild('routineId').equalTo(routineId).once('value');
            if (tasksSnapshot.exists()) {
                tasksSnapshot.forEach((childSnapshot) => {
                    allTasks.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
            }
        }

        // Get completions for this date
        const completionsRef = db.ref(`completions/${targetDate}/${userId}`);
        const completionsSnapshot = await completionsRef.once('value');
        const completions = completionsSnapshot.val() || {};

        // Calculate stats
        const totalTasks = allTasks.length;
        const completedTasks = Object.keys(completions).length;
        const completionPercentage = calculateCompletionPercentage(completedTasks, totalTasks);

        // Build task details
        const taskDetails = allTasks.map(task => ({
            id: task.id,
            name: task.name,
            routineId: task.routineId,
            completed: completions[task.id] === true
        }));

        res.status(200).json({
            success: true,
            message: 'Daily stats retrieved successfully',
            data: {
                date: targetDate,
                totalTasks,
                completedTasks,
                completionPercentage,
                tasks: taskDetails
            }
        });
    } catch (error) {
        console.error('Get daily stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving daily stats',
            error: error.message
        });
    }
};

/**
 * Get weekly statistics
 * GET /stats/weekly
 */
const getWeeklyStats = async (req, res) => {
    try {
        const userId = req.userId;
        const weekDates = getCurrentWeekDates();

        const db = getDatabase();

        // Get all user's routines
        const routinesRef = db.ref('routines');
        const routinesSnapshot = await routinesRef.orderByChild('userId').equalTo(userId).once('value');

        if (!routinesSnapshot.exists()) {
            return res.status(200).json({
                success: true,
                message: 'No routines found',
                data: {
                    weekDates,
                    dailyStats: [],
                    routineStreaks: []
                }
            });
        }

        const routines = [];
        routinesSnapshot.forEach((childSnapshot) => {
            routines.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });

        // Get daily stats for each day of the week
        const dailyStats = [];

        for (const date of weekDates) {
            // Get all tasks for this user
            const tasksRef = db.ref('tasks');
            const allTasks = [];

            for (const routine of routines) {
                const tasksSnapshot = await tasksRef.orderByChild('routineId').equalTo(routine.id).once('value');
                if (tasksSnapshot.exists()) {
                    tasksSnapshot.forEach((childSnapshot) => {
                        allTasks.push({
                            id: childSnapshot.key,
                            ...childSnapshot.val()
                        });
                    });
                }
            }

            // Get completions for this date
            const completionsRef = db.ref(`completions/${date}/${userId}`);
            const completionsSnapshot = await completionsRef.once('value');
            const completions = completionsSnapshot.val() || {};

            const totalTasks = allTasks.length;
            const completedTasks = Object.keys(completions).length;
            const completionPercentage = calculateCompletionPercentage(completedTasks, totalTasks);

            dailyStats.push({
                date,
                totalTasks,
                completedTasks,
                completionPercentage
            });
        }

        // Calculate streaks for each routine
        const routineStreaks = [];
        const completionsRef = db.ref('completions');
        const allCompletionsSnapshot = await completionsRef.once('value');
        const allCompletions = allCompletionsSnapshot.val() || {};

        for (const routine of routines) {
            // Get all tasks for this routine
            const tasksRef = db.ref('tasks');
            const tasksSnapshot = await tasksRef.orderByChild('routineId').equalTo(routine.id).once('value');

            const routineTasks = [];
            if (tasksSnapshot.exists()) {
                tasksSnapshot.forEach((childSnapshot) => {
                    routineTasks.push(childSnapshot.key);
                });
            }

            // Build completion history for this routine
            const completionHistory = {};

            Object.keys(allCompletions).forEach(date => {
                if (allCompletions[date][userId]) {
                    const userCompletions = allCompletions[date][userId];
                    const completedTasksForRoutine = routineTasks.filter(taskId => userCompletions[taskId] === true);

                    // Routine is considered complete if all its tasks are completed
                    if (completedTasksForRoutine.length === routineTasks.length && routineTasks.length > 0) {
                        completionHistory[date] = true;
                    }
                }
            });

            const streak = calculateStreak(routine.frequency, completionHistory);

            routineStreaks.push({
                routineId: routine.id,
                routineName: routine.name,
                frequency: routine.frequency,
                currentStreak: streak
            });
        }

        res.status(200).json({
            success: true,
            message: 'Weekly stats retrieved successfully',
            data: {
                weekDates,
                dailyStats,
                routineStreaks
            }
        });
    } catch (error) {
        console.error('Get weekly stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving weekly stats',
            error: error.message
        });
    }
};

module.exports = {
    markTaskCompleted,
    getDailyStats,
    getWeeklyStats
};
