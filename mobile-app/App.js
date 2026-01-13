import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import TabNavigator from './src/navigation/TabNavigator';
import LoadingIndicator from './src/components/LoadingIndicator';

const AppContent = () => {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { loading: settingsLoading, isDarkMode } = useSettings();

    if (authLoading || settingsLoading) {
        return <LoadingIndicator />;
    }

    return (
        <NavigationContainer>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            {isAuthenticated ? <TabNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default function App() {
    return (
        <SettingsProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </SettingsProvider>
    );
}
