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
import colors from '../theme/colors';
import { statsAPI } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import LoadingIndicator from '../components/LoadingIndicator';

const ProgressScreen = () => {
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
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Progress</Text>
                <Text style={styles.headerSubtitle}>Track your consistency</Text>
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
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Today's Progress</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{dailyStats?.completedTasks || 0}</Text>
                            <Text style={styles.statLabel}>Completed</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{dailyStats?.totalTasks || 0}</Text>
                            <Text style={styles.statLabel}>Total</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {dailyStats?.completionPercentage || 0}%
                            </Text>
                            <Text style={styles.statLabel}>Complete</Text>
                        </View>
                    </View>
                    <ProgressBar progress={dailyStats?.completionPercentage || 0} height={12} />
                </View>

                {/* Weekly Overview */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>This Week</Text>
                    {weeklyStats?.dailyStats?.map((day, index) => (
                        <View key={index} style={styles.dayRow}>
                            <View style={styles.dayInfo}>
                                <Text style={styles.dayName}>{getDayName(day.date)}</Text>
                                <Text style={styles.dayDate}>
                                    {new Date(day.date).getDate()}
                                </Text>
                            </View>
                            <View style={styles.dayProgress}>
                                <ProgressBar progress={day.completionPercentage} height={8} />
                                <Text style={styles.dayPercentage}>
                                    {day.completionPercentage}%
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Streaks */}
                {weeklyStats?.routineStreaks && weeklyStats.routineStreaks.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Streaks</Text>
                        {weeklyStats.routineStreaks.map((streak, index) => (
                            <View key={index} style={styles.streakRow}>
                                <View style={styles.streakIcon}>
                                    <Ionicons name="flame" size={24} color={colors.warning} />
                                </View>
                                <View style={styles.streakInfo}>
                                    <Text style={styles.streakName}>{streak.routineName}</Text>
                                    <Text style={styles.streakDays}>
                                        {streak.frequency.map(d => d.toUpperCase()).join(', ')}
                                    </Text>
                                </View>
                                <View style={styles.streakCount}>
                                    <Text style={styles.streakNumber}>{streak.currentStreak}</Text>
                                    <Text style={styles.streakLabel}>days</Text>
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
    content: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
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
        color: colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    statDivider: {
        width: 1,
        backgroundColor: colors.borderLight,
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
        color: colors.textSecondary,
        textTransform: 'uppercase',
    },
    dayDate: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    dayProgress: {
        flex: 1,
        marginLeft: 16,
    },
    dayPercentage: {
        fontSize: 12,
        color: colors.textSecondary,
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
        backgroundColor: colors.borderLight,
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
        color: colors.text,
        marginBottom: 2,
    },
    streakDays: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    streakCount: {
        alignItems: 'center',
    },
    streakNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.warning,
    },
    streakLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
});

export default ProgressScreen;
