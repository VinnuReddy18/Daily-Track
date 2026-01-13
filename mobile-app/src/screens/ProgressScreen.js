import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import { statsAPI } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import LoadingIndicator from '../components/LoadingIndicator';

const ProgressScreen = () => {
    const { colors } = useSettings();
    const [dailyStats, setDailyStats] = useState(null);
    const [weeklyStats, setWeeklyStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [dailyResponse, weeklyResponse] = await Promise.all([
                statsAPI.getDaily(),
                statsAPI.getWeekly(),
            ]);

            setDailyStats(dailyResponse.data.data);
            setWeeklyStats(weeklyResponse.data.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load statistics');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadStats();
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    const getDayName = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Progress</Text>
                <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Track your consistency</Text>
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* Today's Progress */}
                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Today's Progress</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.primary }]}>{dailyStats?.completedTasks || 0}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.borderLight }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.primary }]}>{dailyStats?.totalTasks || 0}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.borderLight }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.primary }]}>
                                {dailyStats?.completionPercentage || 0}%
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Complete</Text>
                        </View>
                    </View>
                    <ProgressBar progress={dailyStats?.completionPercentage || 0} height={12} />
                </View>

                {/* Weekly Overview */}
                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>This Week</Text>
                    {weeklyStats?.dailyStats?.map((day, index) => (
                        <View key={index} style={styles.dayRow}>
                            <View style={styles.dayInfo}>
                                <Text style={[styles.dayName, { color: colors.textSecondary }]}>{getDayName(day.date)}</Text>
                                <Text style={[styles.dayDate, { color: colors.text }]}>
                                    {new Date(day.date).getDate()}
                                </Text>
                            </View>
                            <View style={styles.dayProgress}>
                                <ProgressBar progress={day.completionPercentage} height={8} />
                                <Text style={[styles.dayPercentage, { color: colors.textSecondary }]}>
                                    {day.completionPercentage}%
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Streaks */}
                {weeklyStats?.routineStreaks && weeklyStats.routineStreaks.length > 0 && (
                    <View style={[styles.card, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>Streaks</Text>
                        {weeklyStats.routineStreaks.map((streak, index) => (
                            <View key={index} style={styles.streakRow}>
                                <View style={[styles.streakIcon, { backgroundColor: colors.borderLight }]}>
                                    <Ionicons name="flame" size={24} color={colors.warning} />
                                </View>
                                <View style={styles.streakInfo}>
                                    <Text style={[styles.streakName, { color: colors.text }]}>{streak.routineName}</Text>
                                    <Text style={[styles.streakDays, { color: colors.textSecondary }]}>
                                        {streak.frequency.map(d => d.toUpperCase()).join(', ')}
                                    </Text>
                                </View>
                                <View style={styles.streakCount}>
                                    <Text style={[styles.streakNumber, { color: colors.warning }]}>{streak.currentStreak}</Text>
                                    <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>days</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
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
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    card: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
    },
    statDivider: {
        width: 1,
    },
    dayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    dayInfo: {
        width: 60,
        alignItems: 'center',
    },
    dayName: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    dayDate: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dayProgress: {
        flex: 1,
        marginLeft: 16,
    },
    dayPercentage: {
        fontSize: 12,
        marginTop: 4,
    },
    streakRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    streakIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    streakInfo: {
        flex: 1,
        marginLeft: 12,
    },
    streakName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    streakDays: {
        fontSize: 12,
    },
    streakCount: {
        alignItems: 'center',
    },
    streakNumber: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    streakLabel: {
        fontSize: 12,
    },
});

export default ProgressScreen;
