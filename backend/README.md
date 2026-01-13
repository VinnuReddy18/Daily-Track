# Daily Track Backend

A complete backend server for a full-stack mobile application that helps users manage daily routines and tasks, track daily completion, and view progress and consistency over time.

## 🚀 Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Firebase Realtime Database** - NoSQL cloud database
- **Firebase Admin SDK** - Server-side Firebase integration
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcrypt** - Password hashing
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing

## 📁 Project Structure

```
backend/
│
├── src/
│   ├── app.js                      # Main Express application
│   │
│   ├── config/
│   │   ├── firebase.js             # Firebase Admin SDK configuration
│   │   └── jwt.js                  # JWT token generation & verification
│   │
│   ├── routes/
│   │   ├── auth.routes.js          # Authentication routes
│   │   ├── routine.routes.js       # Routine management routes
│   │   ├── task.routes.js          # Task management routes
│   │   └── stats.routes.js         # Statistics & completion routes
│   │
│   ├── controllers/
│   │   ├── auth.controller.js      # Authentication logic
│   │   ├── routine.controller.js   # Routine CRUD operations
│   │   ├── task.controller.js      # Task CRUD operations
│   │   └── stats.controller.js     # Statistics & completion tracking
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT authentication middleware
│   │   └── error.middleware.js     # Error handling middleware
│   │
│   └── utils/
│       ├── date.utils.js           # Date formatting & validation
│       └── streak.utils.js         # Streak calculation utilities
│
├── package.json
├── .env.example
└── README.md
```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

### Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Copy the values from the downloaded JSON file to your `.env` file

## 📦 Installation

1. **Clone or navigate to the backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
copy .env.example .env
```

4. **Start the server**

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📚 API Endpoints

### Authentication (Public)

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Vinay",
  "email": "vinay@gmail.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "name": "Vinay",
      "email": "vinay@gmail.com",
      "createdAt": "2026-01-13T00:00:00.000Z"
    }
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "vinay@gmail.com",
  "password": "password123"
}
```

### Routines (Protected)

#### Create Routine
```http
POST /routines
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Morning Routine",
  "frequency": ["mon", "tue", "wed", "thu", "fri"]
}
```

#### Get All Routines
```http
GET /routines
Authorization: Bearer <token>
```

#### Update Routine
```http
PUT /routines/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Morning Routine",
  "frequency": ["mon", "wed", "fri"],
  "active": true
}
```

#### Delete Routine
```http
DELETE /routines/:id
Authorization: Bearer <token>
```

### Tasks (Protected)

#### Create Task
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "routineId": "routine_id",
  "name": "Meditate",
  "order": 1
}
```

#### Get Tasks for Routine
```http
GET /tasks?routineId=routine_id
Authorization: Bearer <token>
```

#### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Meditate for 10 minutes",
  "order": 2
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

### Statistics & Completion (Protected)

#### Mark Task as Completed
```http
POST /stats/completion
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "task_id",
  "routineId": "routine_id",
  "date": "2024-01-15"
}
```

#### Get Daily Statistics
```http
GET /stats/daily?date=2024-01-15
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Daily stats retrieved successfully",
  "data": {
    "date": "2024-01-15",
    "totalTasks": 5,
    "completedTasks": 3,
    "completionPercentage": 60,
    "tasks": [
      {
        "id": "task_id",
        "name": "Meditate",
        "routineId": "routine_id",
        "completed": true
      }
    ]
  }
}
```

#### Get Weekly Statistics
```http
GET /stats/weekly
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Weekly stats retrieved successfully",
  "data": {
    "weekDates": ["2024-01-15", "2024-01-16", ...],
    "dailyStats": [
      {
        "date": "2024-01-15",
        "totalTasks": 5,
        "completedTasks": 3,
        "completionPercentage": 60
      }
    ],
    "routineStreaks": [
      {
        "routineId": "routine_id",
        "routineName": "Morning Routine",
        "frequency": ["mon", "tue", "wed"],
        "currentStreak": 7
      }
    ]
  }
}
```

## 🗄️ Database Structure

Firebase Realtime Database structure:

```json
{
  "users": {
    "userId": {
      "name": "string",
      "email": "string",
      "password": "hashed_string",
      "createdAt": "ISO_date"
    }
  },
  "routines": {
    "routineId": {
      "userId": "string",
      "name": "string",
      "frequency": ["mon", "tue", "wed"],
      "active": true,
      "createdAt": "ISO_date"
    }
  },
  "tasks": {
    "taskId": {
      "routineId": "string",
      "name": "string",
      "order": 1
    }
  },
  "completions": {
    "YYYY-MM-DD": {
      "userId": {
        "taskId": true
      }
    }
  }
}
```

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Authorization Checks**: Users can only access their own data
- **Input Validation**: All inputs are validated before processing
- **Error Handling**: Centralized error handling with appropriate status codes

## 🎯 Business Logic

- **Daily Reset**: Tasks reset every day automatically
- **Completion Tracking**: Completion is stored per date
- **Streak Calculation**: Streaks break if routine not completed fully on a scheduled day
- **Server-Side Logic**: All calculations handled by backend, not frontend

## 📝 Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication errors)
- `403` - Forbidden (authorization errors)
- `404` - Not Found
- `500` - Internal Server Error

