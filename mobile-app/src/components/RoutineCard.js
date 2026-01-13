import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import ProgressBar from './ProgressBar';

const RoutineCard = ({ routine, tasks = [], completedTasks = [], onPress }) => {
    const [expanded, setExpanded] = useState(false);

    const totalTasks = tasks.length;
    const completed = completedTasks.length;
    const progress = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.routineName}>{routine.name}</Text>
                    <Text style={styles.frequency}>
                        {routine.frequency.map(d => d.toUpperCase()).join(', ')}
                    </Text>
                </View>
                <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
                    <Ionicons
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color={colors.textSecondary}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.progressSection}>
                <ProgressBar progress={progress} />
                <Text style={styles.progressText}>
                    {completed}/{totalTasks} tasks completed
                </Text>
            </View>

            {expanded && tasks.length > 0 && (
                <View style={styles.tasksContainer}>
                    {tasks.map((task) => (
                        <View key={task.id} style={styles.taskRow}>
                            <View
                                style={[
                                    styles.taskDot,
                                    completedTasks.includes(task.id) && styles.taskDotCompleted,
                                ]}
                            />
                            <Text
                                style={[
                                    styles.taskText,
                                    completedTasks.includes(task.id) && styles.taskTextCompleted,
                                ]}
                            >
                                {task.name}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    headerLeft: {
        flex: 1,
    },
    routineName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    frequency: {
        fontSize: 12,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    expandButton: {
        padding: 4,
    },
    progressSection: {
        marginTop: 8,
    },
    progressText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 6,
    },
    tasksContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    taskDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.border,
        marginRight: 12,
    },
    taskDotCompleted: {
        backgroundColor: colors.accent,
    },
    taskText: {
        fontSize: 14,
        color: colors.text,
    },
    taskTextCompleted: {
        color: colors.textSecondary,
        textDecorationLine: 'line-through',
    },
});

export default RoutineCard;
