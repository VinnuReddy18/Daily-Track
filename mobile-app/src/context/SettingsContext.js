import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../theme/colors';

const SettingsContext = createContext({});

const SETTINGS_STORAGE_KEY = '@daily_track_settings';

const DEFAULT_SETTINGS = {
    theme: 'system', // 'light', 'dark', 'system'
    allowTaskUncompletion: false,
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const systemColorScheme = useColorScheme();

    // Load settings from storage on app start
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            const updatedSettings = { ...settings, ...newSettings };
            setSettings(updatedSettings);
            await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    const setTheme = async (theme) => {
        await updateSettings({ theme });
    };

    const setAllowTaskUncompletion = async (allow) => {
        await updateSettings({ allowTaskUncompletion: allow });
    };

    const resetSettings = async () => {
        try {
            setSettings(DEFAULT_SETTINGS);
            await AsyncStorage.removeItem(SETTINGS_STORAGE_KEY);
        } catch (error) {
            console.error('Error resetting settings:', error);
        }
    };

    // Determine active theme based on settings
    const getActiveTheme = () => {
        if (settings.theme === 'system') {
            return systemColorScheme === 'dark' ? darkTheme : lightTheme;
        }
        return settings.theme === 'dark' ? darkTheme : lightTheme;
    };

    const colors = getActiveTheme();

    return (
        <SettingsContext.Provider
            value={{
                settings,
                colors,
                loading,
                setTheme,
                setAllowTaskUncompletion,
                updateSettings,
                resetSettings,
                isDarkMode: colors === darkTheme,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};

export default SettingsContext;
