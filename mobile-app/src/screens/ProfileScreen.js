import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const { colors } = useSettings();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: logout,
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                        <Ionicons name="person" size={48} color={colors.surface} />
                    </View>
                    <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'User'}</Text>
                    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email || ''}</Text>
                </View>

                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <TouchableOpacity
                        style={[styles.menuItem, { borderBottomWidth: 1, borderBottomColor: colors.borderLight }]}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="settings-outline" size={24} color={colors.text} />
                            <Text style={[styles.menuItemText, { color: colors.text }]}>Settings</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="help-circle-outline" size={24} color={colors.text} />
                            <Text style={[styles.menuItemText, { color: colors.text }]}>Help & Support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
                    </TouchableOpacity>
                </View>

                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color={colors.error} />
                        <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.version, { color: colors.textLight }]}>Daily Track v1.0.0</Text>
                    <Text style={[styles.copyright, { color: colors.textLight }]}>© 2024 All rights reserved</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    profileCard: {
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
    },
    section: {
        borderRadius: 16,
        marginBottom: 16,
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
    },
    menuItemText: {
        fontSize: 16,
        marginLeft: 12,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    version: {
        fontSize: 12,
        marginBottom: 4,
    },
    copyright: {
        fontSize: 12,
    },
});

export default ProfileScreen;
