import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../theme/colors';

const ProgressBar = ({ progress = 0, height = 8 }) => {
    // Ensure progress is between 0 and 100
    const normalizedProgress = Math.min(Math.max(progress, 0), 100);

    // Determine color based on progress
    const getColor = () => {
        if (normalizedProgress >= 80) return colors.success;
        if (normalizedProgress >= 50) return colors.accent;
        if (normalizedProgress >= 30) return colors.warning;
        return colors.error;
    };

    return (
        <View style={[styles.container, { height }]}>
            <View
                style={[
                    styles.fill,
                    {
                        width: `${normalizedProgress}%`,
                        backgroundColor: getColor(),
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.borderLight,
        borderRadius: 100,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 100,
    },
});

export default ProgressBar;
