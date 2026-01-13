# Daily Track Mobile App

A production-ready React Native mobile application built with Expo for managing daily routines, tracking task completion, and viewing progress statistics.

## 📱 Features

- **User Authentication** - Secure login and registration with JWT
- **Routine Management** - Create, view, edit, and delete daily routines
- **Task Tracking** - Add tasks to routines and mark them as completed
- **Progress Analytics** - View daily and weekly completion statistics
- **Streak Tracking** - Monitor consistency with routine streaks
- **Modern UI** - Clean, minimal design with smooth animations

## 🚀 Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **Axios** - HTTP client for API calls
- **Context API** - State management
- **AsyncStorage** - Local data persistence
- **Expo Linear Gradient** - Gradient backgrounds
- **Expo Vector Icons** - Icon library

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)
- Backend server running (see backend README)

## 🛠️ Installation

1. **Navigate to the mobile app directory**

```bash
cd mobile-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure API URL**

Open `src/services/api.js` and update the `BASE_URL`:

```javascript
// For iOS simulator
const BASE_URL = 'http://localhost:3000';

// For Android emulator
const BASE_URL = 'http://10.0.2.2:3000';

// For physical device (replace with your computer's IP)
const BASE_URL = 'http://192.168.1.XXX:3000';
```

To find your computer's IP address:
- **Windows**: Run `ipconfig` in Command Prompt
- **Mac/Linux**: Run `ifconfig` in Terminal

4. **Start the development server**

```bash
npm start
```

or

```bash
npx expo start
```

5. **Run on device/simulator**

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: Scan the QR code with Expo Go app

## 📱 App Structure

```
mobile-app/
├── src/
│   ├── screens/           # All app screens
│   │   ├── WelcomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── SignupScreen.js
│   │   ├── HomeScreen.js
│   │   ├── CreateRoutineScreen.js
│   │   ├── RoutineDetailScreen.js
│   │   ├── ProgressScreen.js
│   │   └── ProfileScreen.js
│   │
│   ├── navigation/        # Navigation configuration
│   │   ├── AuthNavigator.js
│   │   └── TabNavigator.js
│   │
│   ├── context/           # Global state management
│   │   └── AuthContext.js
│   │
│   ├── services/          # API integration
│   │   └── api.js
│   │
│   ├── components/        # Reusable components
│   │   ├── RoutineCard.js
│   │   ├── TaskItem.js
│   │   ├── ProgressBar.js
│   │   └── LoadingIndicator.js
│   │
│   └── theme/             # Design system
│       └── colors.js
│
├── App.js                 # Main app entry point
├── app.json               # Expo configuration
├── package.json           # Dependencies
└── README.md
```

## 🎨 Screens Overview

### Authentication Flow

1. **Welcome Screen** - Landing page with login/signup options
2. **Login Screen** - Email and password login
3. **Signup Screen** - User registration

### Main App (Bottom Tabs)

1. **Home Tab**
   - View today's routines
   - Mark tasks as completed
   - Create new routines
   - View routine details

2. **Progress Tab**
   - Daily completion statistics
   - Weekly overview
   - Routine streaks

3. **Profile Tab**
   - User information
   - App settings
   - Logout

## 🔌 API Integration

The app communicates with the backend via REST APIs:

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Routines
- `GET /routines` - Get all routines
- `POST /routines` - Create routine
- `PUT /routines/:id` - Update routine
- `DELETE /routines/:id` - Delete routine

### Tasks
- `GET /tasks?routineId=xxx` - Get tasks for routine
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Statistics
- `POST /stats/completion` - Mark task completed
- `GET /stats/daily?date=YYYY-MM-DD` - Get daily stats
- `GET /stats/weekly` - Get weekly stats

## 🔒 Authentication

The app uses JWT (JSON Web Tokens) for authentication:

1. User logs in or registers
2. Backend returns JWT token
3. Token is stored in AsyncStorage
4. Token is attached to all API requests via Axios interceptor
5. Token persists across app restarts

## 🎯 Key Features Explained

### Routine Creation
- Enter routine name
- Select frequency (days of week)
- Add multiple tasks
- Tasks are ordered automatically

### Task Completion
- Tap checkbox to mark task complete
- Completion is stored per date
- Progress bars update in real-time
- Pull to refresh to sync data

### Progress Tracking
- View today's completion percentage
- See weekly completion trends
- Track routine streaks
- Visual progress indicators


### API URL

Update `BASE_URL` in `src/services/api.js` for different environments.

## 👨‍💻 Development

This app is built as part of a full-stack academic project demonstrating:
- Modern React Native development
- RESTful API integration
- State management with Context API
- Clean UI/UX design
- Production-ready code structure

---

**Note**: This app requires the backend server to be running. See the backend README for setup instructions.
