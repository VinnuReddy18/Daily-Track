import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';

import HomeScreen from '../screens/HomeScreen';
import CreateRoutineScreen from '../screens/CreateRoutineScreen';
import RoutineDetailScreen from '../screens/RoutineDetailScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack Navigator
const HomeStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="HomeMain" component={HomeScreen} />
            <Stack.Screen name="CreateRoutine" component={CreateRoutineScreen} />
            <Stack.Screen name="RoutineDetail" component={RoutineDetailScreen} />
        </Stack.Navigator>
    );
};

// Profile Stack Navigator
const ProfileStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="ProfileMain" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
    );
};

// Main Tab Navigator
const TabNavigator = () => {
    const { colors } = useSettings();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Progress') {
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textLight,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: colors.borderLight,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Progress" component={ProgressScreen} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
