import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Modal,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import { authAPI } from '../services/api';

const ChangePasswordModal = ({ visible, onClose }) => {
    const { colors } = useSettings();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const validateForm = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'All fields are required');
            return false;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters long');
            return false;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return false;
        }

        if (currentPassword === newPassword) {
            Alert.alert('Error', 'New password must be different from current password');
            return false;
        }

        return true;
    };

    const handleChangePassword = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            console.log('Attempting to change password...');
            const response = await authAPI.changePassword({
                currentPassword,
                newPassword,
            });
            console.log('Password change response:', response);

            Alert.alert(
                'Success',
                'Password changed successfully',
                [
                    {
                        text: 'OK',
                        onPress: handleClose,
                    },
                ]
            );
        } catch (error) {
            console.error('Change password error:', error);
            console.error('Error response:', error.response);
            const errorMessage = error.response?.data?.message || 'Failed to change password. Please try again.';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: colors.surface }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Change Password</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Current Password */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>
                                Current Password
                            </Text>
                            <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    placeholder="Enter current password"
                                    placeholderTextColor={colors.textLight}
                                    secureTextEntry={!showCurrentPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showCurrentPassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color={colors.textLight}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* New Password */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>
                                New Password
                            </Text>
                            <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    placeholder="Enter new password"
                                    placeholderTextColor={colors.textLight}
                                    secureTextEntry={!showNewPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showNewPassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color={colors.textLight}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.hint, { color: colors.textLight }]}>
                                Must be at least 6 characters
                            </Text>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>
                                Confirm New Password
                            </Text>
                            <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="Confirm new password"
                                    placeholderTextColor={colors.textLight}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color={colors.textLight}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                            onPress={handleClose}
                            disabled={loading}
                        >
                            <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.submitButton, { backgroundColor: colors.primary }]}
                            onPress={handleChangePassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={colors.surface} />
                            ) : (
                                <Text style={styles.submitButtonText}>Change Password</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    form: {
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 8,
    },
    hint: {
        fontSize: 12,
        marginTop: 4,
    },
    buttons: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        borderWidth: 1,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    submitButton: {
        minHeight: 48,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ChangePasswordModal;
