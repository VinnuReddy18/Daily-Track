import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import TabNavigator from './src/navigation/TabNavigator';
import LoadingIndicator from './src/components/LoadingIndicator';

const AppContent = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <NavigationContainer>
            <StatusBar style="auto" />
            {isAuthenticated ? <TabNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
