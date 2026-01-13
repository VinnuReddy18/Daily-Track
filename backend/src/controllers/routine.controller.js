const { getDatabase } = require('../config/firebase');

/**
 * Create a new routine
 * POST /routines
 */
const createRoutine = async (req, res) => {
    try {
        const { name, frequency } = req.body;
        const userId = req.userId; // From auth middleware

        // Validate input
        if (!name || !frequency || !Array.isArray(frequency)) {
            return res.status(400).json({
                success: false,
                message: 'Name and frequency (array) are required'
            });
        }

        // Validate frequency values
        const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const isValidFrequency = frequency.every(day => validDays.includes(day));

        if (!isValidFrequency || frequency.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Frequency must contain valid days: mon, tue, wed, thu, fri, sat, sun'
            });
        }

        const db = getDatabase();
        const routinesRef = db.ref('routines');

        // Create new routine
        const newRoutineRef = routinesRef.push();
        const routineId = newRoutineRef.key;

        const routineData = {
            userId,
            name,
            frequency,
            active: true,
            createdAt: new Date().toISOString()
        };

        await newRoutineRef.set(routineData);

        res.status(201).json({
            success: true,
            message: 'Routine created successfully',
            data: {
                id: routineId,
                ...routineData
            }
        });
    } catch (error) {
        console.error('Create routine error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating routine',
            error: error.message
        });
    }
};

/**
 * Get all routines for logged-in user
 * GET /routines
 */
const getRoutines = async (req, res) => {
    try {
        const userId = req.userId;
        const db = getDatabase();
        const routinesRef = db.ref('routines');

        // Get routines for this user
        const snapshot = await routinesRef.orderByChild('userId').equalTo(userId).once('value');

        if (!snapshot.exists()) {
            return res.status(200).json({
                success: true,
                message: 'No routines found',
                data: []
            });
        }

        const routines = [];
        snapshot.forEach((childSnapshot) => {
            routines.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });

        res.status(200).json({
            success: true,
            message: 'Routines retrieved successfully',
            data: routines
        });
    } catch (error) {
        console.error('Get routines error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving routines',
            error: error.message
        });
    }
};

/**
 * Update a routine
 * PUT /routines/:id
 */
const updateRoutine = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, frequency, active } = req.body;
        const userId = req.userId;

        const db = getDatabase();
        const routineRef = db.ref(`routines/${id}`);

        // Check if routine exists and belongs to user
        const snapshot = await routineRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({
                success: false,
                message: 'Routine not found'
            });
        }

        const routine = snapshot.val();
        if (routine.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this routine'
            });
        }

        // Validate frequency if provided
        if (frequency) {
            const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            const isValidFrequency = frequency.every(day => validDays.includes(day));

            if (!isValidFrequency || frequency.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Frequency must contain valid days: mon, tue, wed, thu, fri, sat, sun'
                });
            }
        }

        // Update routine
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (frequency !== undefined) updates.frequency = frequency;
        if (active !== undefined) updates.active = active;

        await routineRef.update(updates);

        // Get updated routine
        const updatedSnapshot = await routineRef.once('value');

        res.status(200).json({
            success: true,
            message: 'Routine updated successfully',
            data: {
                id,
                ...updatedSnapshot.val()
            }
        });
    } catch (error) {
        console.error('Update routine error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating routine',
            error: error.message
        });
    }
};

/**
 * Delete a routine
 * DELETE /routines/:id
 */
const deleteRoutine = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const db = getDatabase();
        const routineRef = db.ref(`routines/${id}`);

        // Check if routine exists and belongs to user
        const snapshot = await routineRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({
                success: false,
                message: 'Routine not found'
            });
        }

        const routine = snapshot.val();
        if (routine.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this routine'
            });
        }

        // Delete associated tasks
        const tasksRef = db.ref('tasks');
        const tasksSnapshot = await tasksRef.orderByChild('routineId').equalTo(id).once('value');

        if (tasksSnapshot.exists()) {
            const deletePromises = [];
            tasksSnapshot.forEach((childSnapshot) => {
                deletePromises.push(db.ref(`tasks/${childSnapshot.key}`).remove());
            });
            await Promise.all(deletePromises);
        }

        // Delete routine
        await routineRef.remove();

        res.status(200).json({
            success: true,
            message: 'Routine and associated tasks deleted successfully'
        });
    } catch (error) {
        console.error('Delete routine error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting routine',
            error: error.message
        });
    }
};

module.exports = {
    createRoutine,
    getRoutines,
    updateRoutine,
    deleteRoutine
};
