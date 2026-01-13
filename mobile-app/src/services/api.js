import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - Change this to your computer's IP address if testing on physical device
// Example: http://192.168.1.100:3000
const BASE_URL = 'http://192.168.1.36:3000';

// Create axios instance
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        console.log('API Request:', config.url);
        console.log('Token retrieved:', token ? 'Yes' : 'No');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Authorization header set');
        } else {
            console.log('No token found in AsyncStorage');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear storage
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            // You can emit an event here to trigger logout in AuthContext
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    changePassword: (data) => api.put('/auth/change-password', data),
    deleteAccount: () => api.delete('/auth/account'),
};

// Routine APIs
export const routineAPI = {
    getAll: () => api.get('/routines'),
    create: (data) => api.post('/routines', data),
    update: (id, data) => api.put(`/routines/${id}`, data),
    delete: (id) => api.delete(`/routines/${id}`),
};

// Task APIs
export const taskAPI = {
    getByRoutine: (routineId) => api.get(`/tasks?routineId=${routineId}`),
    create: (data) => api.post('/tasks', data),
    update: (id, data) => api.put(`/tasks/${id}`, data),
    delete: (id) => api.delete(`/tasks/${id}`),
};

// Stats APIs
export const statsAPI = {
    markCompleted: (data) => api.post('/stats/completion', data),
    unmarkCompleted: (taskId, date) => api.delete(`/stats/completion/${taskId}${date ? `?date=${date}` : ''}`),
    getDaily: (date) => api.get(`/stats/daily${date ? `?date=${date}` : ''}`),
    getWeekly: () => api.get('/stats/weekly'),
};

export default api;
