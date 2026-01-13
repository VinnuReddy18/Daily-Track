import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import { routineAPI, taskAPI } from '../services/api';

const DAYS = [
    { key: 'mon', label: 'Mon' },
    { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' },
    { key: 'sat', label: 'Sat' },
    { key: 'sun', label: 'Sun' },
];

const CreateRoutineScreen = ({ navigation }) => {
    const { colors } = useSettings();
    const [routineName, setRoutineName] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [tasks, setTasks] = useState(['']);
    const [loading, setLoading] = useState(false);

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const addTask = () => {
        setTasks([...tasks, '']);
    };

    const removeTask = (index) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks.length > 0 ? newTasks : ['']);
    };

    const updateTask = (index, value) => {
        const newTasks = [...tasks];
        newTasks[index] = value;
        setTasks(newTasks);
    };

    const handleSave = async () => {
        if (!routineName.trim()) {
            Alert.alert('Error', 'Please enter a routine name');
            return;
        }

        if (selectedDays.length === 0) {
            Alert.alert('Error', 'Please select at least one day');
            return;
        }

        const validTasks = tasks.filter(t => t.trim());
        if (validTasks.length === 0) {
            Alert.alert('Error', 'Please add at least one task');
            return;
        }

        setLoading(true);

        try {
            // Create routine
            const routineResponse = await routineAPI.create({
                name: routineName,
                frequency: selectedDays,
            });

            const routineId = routineResponse.data.data.id;

            // Create tasks
            const taskPromises = validTasks.map((taskName, index) =>
                taskAPI.create({
                    routineId,
                    name: taskName,
                    order: index,
                })
            );

            await Promise.all(taskPromises);

            Alert.alert('Success', 'Routine created successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to create routine. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>New Routine</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.text }]}>Routine Name</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                        placeholder="e.g., Morning Routine"
                        value={routineName}
                        onChangeText={setRoutineName}
                        placeholderTextColor={colors.textLight}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.text }]}>Frequency</Text>
                    <View style={styles.daysContainer}>
                        {DAYS.map(day => (
                            <TouchableOpacity
                                key={day.key}
                                style={[
                                    styles.dayButton,
                                    { borderColor: colors.border, backgroundColor: colors.surface },
                                    selectedDays.includes(day.key) && { backgroundColor: colors.primary, borderColor: colors.primary },
                                ]}
                                onPress={() => toggleDay(day.key)}
                            >
                                <Text
                                    style={[
                                        styles.dayButtonText,
                                        { color: colors.text },
                                        selectedDays.includes(day.key) && { color: colors.surface },
                                    ]}
                                >
                                    {day.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.labelRow}>
                        <Text style={[styles.label, { color: colors.text }]}>Tasks</Text>
                        <TouchableOpacity onPress={addTask} style={styles.addButton}>
                            <Ionicons name="add-circle" size={24} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {tasks.map((task, index) => (
                        <View key={index} style={styles.taskInputContainer}>
                            <TextInput
                                style={[styles.taskInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                placeholder={`Task ${index + 1}`}
                                value={task}
                                onChangeText={(value) => updateTask(index, value)}
                                placeholderTextColor={colors.textLight}
                            />
                            {tasks.length > 1 && (
                                <TouchableOpacity onPress={() => removeTask(index)}>
                                    <Ionicons name="close-circle" size={24} color={colors.error} />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.borderLight }]}>
                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: colors.primary }, loading && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.surface} />
                    ) : (
                        <Text style={[styles.saveButtonText, { color: colors.surface }]}>Create Routine</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 32,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    input: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        borderWidth: 1,
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    dayButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
    },
    dayButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    addButton: {
        padding: 4,
    },
    taskInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    taskInput: {
        flex: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        borderWidth: 1,
        marginRight: 8,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
    },
    saveButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CreateRoutineScreen;
