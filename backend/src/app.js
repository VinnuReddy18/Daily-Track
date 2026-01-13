const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeFirebase } = require('./config/firebase');
const { errorHandler, notFound } = require('./middleware/error.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const routineRoutes = require('./routes/routine.routes');
const taskRoutes = require('./routes/task.routes');
const statsRoutes = require('./routes/stats.routes');

// Initialize Firebase
initializeFirebase();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Daily Track API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/routines', routineRoutes);
app.use('/tasks', taskRoutes);
app.use('/stats', statsRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API URL: http://localhost:${PORT}`);
    console.log(`\n✨ Available routes:`);
    console.log(`   POST   /auth/register`);
    console.log(`   POST   /auth/login`);
    console.log(`   GET    /routines`);
    console.log(`   POST   /routines`);
    console.log(`   PUT    /routines/:id`);
    console.log(`   DELETE /routines/:id`);
    console.log(`   GET    /tasks?routineId=xxx`);
    console.log(`   POST   /tasks`);
    console.log(`   PUT    /tasks/:id`);
    console.log(`   DELETE /tasks/:id`);
    console.log(`   POST   /stats/completion`);
    console.log(`   GET    /stats/daily?date=YYYY-MM-DD`);
    console.log(`   GET    /stats/weekly\n`);
});

module.exports = app;
