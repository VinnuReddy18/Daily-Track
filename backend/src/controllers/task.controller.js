const { getDatabase } = require('../config/firebase');

/**
 * Create a new task
 * POST /tasks
 */
const createTask = async (req, res) => {
    try {
        const { routineId, name, order } = req.body;
        const userId = req.userId;

        // Validate input
        if (!routineId || !name) {
            return res.status(400).json({
                success: false,
                message: 'Routine ID and task name are required'
            });
        }

        const db = getDatabase();

        // Verify routine exists and belongs to user
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
                message: 'You do not have permission to add tasks to this routine'
            });
        }

        // Create new task
        const tasksRef = db.ref('tasks');
        const newTaskRef = tasksRef.push();
        const taskId = newTaskRef.key;

        const taskData = {
            routineId,
            name,
            order: order || 0
        };

        await newTaskRef.set(taskData);

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: {
                id: taskId,
                ...taskData
            }
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating task',
            error: error.message
        });
    }
};

/**
 * Get all tasks for a routine
 * GET /tasks?routineId=xxx
 */
const getTasks = async (req, res) => {
    try {
        const { routineId } = req.query;
        const userId = req.userId;

        if (!routineId) {
            return res.status(400).json({
                success: false,
                message: 'Routine ID is required'
            });
        }

        const db = getDatabase();

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
                message: 'You do not have permission to view tasks for this routine'
            });
        }

        // Get tasks for this routine
        const tasksRef = db.ref('tasks');
        const snapshot = await tasksRef.orderByChild('routineId').equalTo(routineId).once('value');

        if (!snapshot.exists()) {
            return res.status(200).json({
                success: true,
                message: 'No tasks found',
                data: []
            });
        }

        const tasks = [];
        snapshot.forEach((childSnapshot) => {
            tasks.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });

        // Sort by order
        tasks.sort((a, b) => a.order - b.order);

        res.status(200).json({
            success: true,
            message: 'Tasks retrieved successfully',
            data: tasks
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving tasks',
            error: error.message
        });
    }
};

/**
 * Update a task
 * PUT /tasks/:id
 */
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, order } = req.body;
        const userId = req.userId;

        const db = getDatabase();
        const taskRef = db.ref(`tasks/${id}`);

        // Check if task exists
        const snapshot = await taskRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const task = snapshot.val();

        // Verify routine belongs to user
        const routineRef = db.ref(`routines/${task.routineId}`);
        const routineSnapshot = await routineRef.once('value');

        if (!routineSnapshot.exists()) {
            return res.status(404).json({
                success: false,
                message: 'Associated routine not found'
            });
        }

        const routine = routineSnapshot.val();
        if (routine.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this task'
            });
        }

        // Update task
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (order !== undefined) updates.order = order;

        await taskRef.update(updates);

        // Get updated task
        const updatedSnapshot = await taskRef.once('value');

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: {
                id,
                ...updatedSnapshot.val()
            }
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating task',
            error: error.message
        });
    }
};

/**
 * Delete a task
 * DELETE /tasks/:id
 */
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const db = getDatabase();
        const taskRef = db.ref(`tasks/${id}`);

        // Check if task exists
        const snapshot = await taskRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const task = snapshot.val();

        // Verify routine belongs to user
        const routineRef = db.ref(`routines/${task.routineId}`);
        const routineSnapshot = await routineRef.once('value');

        if (!routineSnapshot.exists()) {
            return res.status(404).json({
                success: false,
                message: 'Associated routine not found'
            });
        }

        const routine = routineSnapshot.val();
        if (routine.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this task'
            });
        }

        // Delete task
        await taskRef.remove();

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting task',
            error: error.message
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};
