import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user and token from storage on app start
    useEffect(() => {
        loadStoredAuth();
    }, []);

    const loadStoredAuth = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error loading auth:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token: newToken, user: newUser } = response.data.data;

            // Store in state
            setToken(newToken);
            setUser(newUser);

            // Store in AsyncStorage
            await AsyncStorage.setItem('token', newToken);
            await AsyncStorage.setItem('user', JSON.stringify(newUser));

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            return { success: false, error: message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await authAPI.register({ name, email, password });
            const { token: newToken, user: newUser } = response.data.data;

            // Store in state
            setToken(newToken);
            setUser(newUser);

            // Store in AsyncStorage
            await AsyncStorage.setItem('token', newToken);
            await AsyncStorage.setItem('user', JSON.stringify(newUser));

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            // Clear state
            setToken(null);
            setUser(null);

            // Clear AsyncStorage
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
