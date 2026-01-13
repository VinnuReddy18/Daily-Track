import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import ChangePasswordModal from '../components/ChangePasswordModal';

const SettingsScreen = ({ navigation }) => {
    const { settings, colors, setTheme, setAllowTaskUncompletion } = useSettings();
    const { user, logout } = useAuth();
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);

    const handleThemeChange = (theme) => {
        setTheme(theme);
    };

    const handleTaskUncompletionToggle = (value) => {
        setAllowTaskUncompletion(value);
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await authAPI.deleteAccount();
                            Alert.alert('Success', 'Account deleted successfully');
                            logout();
                        } catch (error) {
                            console.error('Delete account error:', error);
                            Alert.alert('Error', 'Failed to delete account. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    const handleChangePassword = () => {
        setChangePasswordVisible(true);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* App Preferences */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        APP PREFERENCES
                    </Text>
                </View>

                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <View style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="color-palette-outline" size={24} color={colors.text} />
                            <Text style={[styles.menuItemText, { color: colors.text }]}>Theme</Text>
                        </View>
                    </View>

                    <View style={[styles.themeOptions, { borderTopColor: colors.borderLight }]}>
                        <TouchableOpacity
                            style={[
                                styles.themeOption,
                                settings.theme === 'light' && { backgroundColor: colors.primaryLight + '20' },
                            ]}
                            onPress={() => handleThemeChange('light')}
                        >
                            <Ionicons
                                name="sunny"
                                size={20}
                                color={settings.theme === 'light' ? colors.primary : colors.textLight}
                            />
                            <Text
                                style={[
                                    styles.themeOptionText,
                                    { color: settings.theme === 'light' ? colors.primary : colors.text },
                                ]}
                            >
                                Light
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.themeOption,
                                settings.theme === 'dark' && { backgroundColor: colors.primaryLight + '20' },
                            ]}
                            onPress={() => handleThemeChange('dark')}
                        >
                            <Ionicons
                                name="moon"
                                size={20}
                                color={settings.theme === 'dark' ? colors.primary : colors.textLight}
                            />
                            <Text
                                style={[
                                    styles.themeOptionText,
                                    { color: settings.theme === 'dark' ? colors.primary : colors.text },
                                ]}
                            >
                                Dark
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.themeOption,
                                settings.theme === 'system' && { backgroundColor: colors.primaryLight + '20' },
                            ]}
                            onPress={() => handleThemeChange('system')}
                        >
                            <Ionicons
                                name="phone-portrait-outline"
                                size={20}
                                color={settings.theme === 'system' ? colors.primary : colors.textLight}
                            />
                            <Text
                                style={[
                                    styles.themeOptionText,
                                    { color: settings.theme === 'system' ? colors.primary : colors.text },
                                ]}
                            >
                                System
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Task & Routine Settings */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        TASK & ROUTINE SETTINGS
                    </Text>
                </View>

                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <View style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="checkbox-outline" size={24} color={colors.text} />
                            <View style={styles.menuItemTextContainer}>
                                <Text style={[styles.menuItemText, { color: colors.text }]}>
                                    Allow Task Un-completion
                                </Text>
                                <Text style={[styles.menuItemSubtext, { color: colors.textLight }]}>
                                    Toggle tasks on and off freely
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={settings.allowTaskUncompletion}
                            onValueChange={handleTaskUncompletionToggle}
                            trackColor={{ false: colors.borderLight, true: colors.primaryLight }}
                            thumbColor={settings.allowTaskUncompletion ? colors.primary : colors.textLight}
                        />
                    </View>
                </View>

                {/* Account Management */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        ACCOUNT MANAGEMENT
                    </Text>
                </View>

                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <TouchableOpacity
                        style={[styles.menuItem, { borderBottomWidth: 1, borderBottomColor: colors.borderLight }]}
                        onPress={handleChangePassword}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="key-outline" size={24} color={colors.text} />
                            <Text style={[styles.menuItemText, { color: colors.text }]}>Change Password</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="trash-outline" size={24} color={colors.error} />
                            <Text style={[styles.menuItemText, { color: colors.error }]}>Delete Account</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.version, { color: colors.textLight }]}>Daily Track v1.0.0</Text>
                </View>
            </ScrollView>

            {/* Change Password Modal */}
            <ChangePasswordModal
                visible={changePasswordVisible}
                onClose={() => setChangePasswordVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    sectionHeader: {
        marginTop: 24,
        marginBottom: 8,
        paddingHorizontal: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    section: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuItemTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    menuItemText: {
        fontSize: 16,
        marginLeft: 12,
    },
    menuItemSubtext: {
        fontSize: 12,
        marginTop: 2,
    },
    themeOptions: {
        flexDirection: 'row',
        padding: 12,
        gap: 8,
        borderTopWidth: 1,
    },
    themeOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 6,
    },
    themeOptionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    version: {
        fontSize: 12,
    },
});

export default SettingsScreen;
