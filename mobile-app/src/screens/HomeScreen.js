import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { routineAPI, taskAPI, statsAPI } from '../services/api';
import RoutineCard from '../components/RoutineCard';
import LoadingIndicator from '../components/LoadingIndicator';
import TaskItem from '../components/TaskItem';

const HomeScreen = ({ navigation }) => {
    const [routines, setRoutines] = useState([]);
    const [routineTasks, setRoutineTasks] = useState({});
    const [completedTasks, setCompletedTasks] = useState({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            await fetchRoutines();
        } catch (error) {
            Alert.alert('Error', 'Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoutines = async () => {
        try {
            const response = await routineAPI.getAll();
            const routinesData = response.data.data;
            setRoutines(routinesData);

            // Fetch tasks for each routine
            const tasksPromises = routinesData.map(routine =>
                taskAPI.getByRoutine(routine.id)
            );
            const tasksResponses = await Promise.all(tasksPromises);

            const tasksMap = {};
            routinesData.forEach((routine, index) => {
                tasksMap[routine.id] = tasksResponses[index].data.data;
            });
            setRoutineTasks(tasksMap);

            // Fetch today's completions
            await fetchCompletions();
        } catch (error) {
            console.error('Error fetching routines:', error);
            throw error;
        }
    };

    const fetchCompletions = async () => {
        try {
            const response = await statsAPI.getDaily();
            const tasks = response.data.data.tasks || [];
            const completed = tasks.filter(t => t.completed).map(t => t.id);

            const completedMap = {};
            completed.forEach(taskId => {
                completedMap[taskId] = true;
            });
            setCompletedTasks(completedMap);
        } catch (error) {
            console.error('Error fetching completions:', error);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, []);

    const handleTaskToggle = async (task, routineId) => {
        const isCompleted = completedTasks[task.id];

        if (isCompleted) {
            // Already completed, don't allow un-completion for now
            return;
        }

        try {
            // Optimistic update
            setCompletedTasks(prev => ({ ...prev, [task.id]: true }));

            await statsAPI.markCompleted({
                taskId: task.id,
                routineId: routineId,
            });

            // Refresh to get updated stats
            await fetchCompletions();
        } catch (error) {
            // Revert on error
            setCompletedTasks(prev => {
                const newState = { ...prev };
                delete newState[task.id];
                return newState;
            });
            Alert.alert('Error', 'Failed to mark task as completed');
        }
    };

    const renderRoutine = ({ item: routine }) => {
        const tasks = routineTasks[routine.id] || [];
        const completed = tasks.filter(t => completedTasks[t.id]).map(t => t.id);

        return (
            <View>
                <RoutineCard
                    routine={routine}
                    tasks={tasks}
                    completedTasks={completed}
                    onPress={() => navigation.navigate('RoutineDetail', { routine })}
                />

                {/* Task completion section */}
                {tasks.length > 0 && (
                    <View style={styles.tasksSection}>
                        {tasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                completed={completedTasks[task.id]}
                                onToggle={() => handleTaskToggle(task, routine.id)}
                            />
                        ))}
                    </View>
                )}
            </View>
        );
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Today's Routines</Text>
                <Text style={styles.headerSubtitle}>
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                    })}
                </Text>
            </View>

            <FlatList
                data={routines}
                renderItem={renderRoutine}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-outline" size={64} color={colors.textLight} />
                        <Text style={styles.emptyText}>No routines yet</Text>
                        <Text style={styles.emptySubtext}>
                            Tap the + button to create your first routine
                        </Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateRoutine')}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={28} color={colors.surface} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: colors.surface,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    tasksSection: {
        marginTop: -8,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textSecondary,
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textLight,
        marginTop: 8,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});

export default HomeScreen;
