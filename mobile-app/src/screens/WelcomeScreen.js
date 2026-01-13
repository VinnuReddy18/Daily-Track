import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const WelcomeScreen = ({ navigation }) => {
    return (
        <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark-circle" size={80} color={colors.surface} />
                </View>

                <Text style={styles.title}>Daily Track</Text>
                <Text style={styles.subtitle}>
                    Build better habits, one day at a time
                </Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('Signup')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.secondaryButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    iconContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.surface,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.surface,
        opacity: 0.9,
        textAlign: 'center',
        marginBottom: 48,
    },
    buttonContainer: {
        width: '100%',
    },
    primaryButton: {
        backgroundColor: colors.surface,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.surface,
    },
    secondaryButtonText: {
        color: colors.surface,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default WelcomeScreen;
