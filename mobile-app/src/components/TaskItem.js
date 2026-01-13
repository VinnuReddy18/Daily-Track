import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const TaskItem = ({ task, completed, onToggle }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onToggle}
            activeOpacity={0.7}
        >
            <View style={[styles.checkbox, completed && styles.checkboxCompleted]}>
                {completed && (
                    <Ionicons name="checkmark" size={16} color={colors.surface} />
                )}
            </View>
            <Text style={[styles.taskName, completed && styles.taskNameCompleted]}>
                {task.name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: colors.surface,
        borderRadius: 8,
        marginBottom: 8,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    checkboxCompleted: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    taskName: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
    },
    taskNameCompleted: {
        color: colors.textSecondary,
        textDecorationLine: 'line-through',
    },
});

export default TaskItem;
