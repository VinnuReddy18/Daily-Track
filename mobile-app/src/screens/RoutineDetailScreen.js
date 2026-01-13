import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { routineAPI, taskAPI } from '../services/api';
import LoadingIndicator from '../components/LoadingIndicator';

const RoutineDetailScreen = ({ route, navigation }) => {
    const { routine } = route.params;
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await taskAPI.getByRoutine(routine.id);
            setTasks(response.data.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Routine',
            `Are you sure you want to delete "${routine.name}"? This will also delete all associated tasks.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: confirmDelete,
                },
            ]
        );
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await routineAPI.delete(routine.id);
            Alert.alert('Success', 'Routine deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to delete routine');
            setDeleting(false);
        }
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Routine Details</Text>
                <TouchableOpacity onPress={handleDelete} disabled={deleting}>
                    {deleting ? (
                        <ActivityIndicator size="small" color={colors.error} />
                    ) : (
                        <Ionicons name="trash-outline" size={24} color={colors.error} />
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.routineName}>{routine.name}</Text>

                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                        <Text style={styles.infoText}>
                            {routine.frequency.map(d => d.toUpperCase()).join(', ')}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
                        <Text style={styles.infoText}>
                            Created {new Date(routine.createdAt).toLocaleDateString()}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons
                            name={routine.active ? 'checkmark-circle' : 'close-circle'}
                            size={20}
                            color={routine.active ? colors.success : colors.error}
                        />
                        <Text style={styles.infoText}>
                            {routine.active ? 'Active' : 'Inactive'}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tasks ({tasks.length})</Text>
                    {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <View key={task.id} style={styles.taskItem}>
                                <View style={styles.taskNumber}>
                                    <Text style={styles.taskNumberText}>{index + 1}</Text>
                                </View>
                                <Text style={styles.taskName}>{task.name}</Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyTasks}>
                            <Text style={styles.emptyTasksText}>No tasks added yet</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: colors.surface,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    routineName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 12,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 16,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    taskNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    taskNumberText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.surface,
    },
    taskName: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
    },
    emptyTasks: {
        padding: 40,
        alignItems: 'center',
    },
    emptyTasksText: {
        fontSize: 14,
        color: colors.textLight,
    },
});

export default RoutineDetailScreen;
