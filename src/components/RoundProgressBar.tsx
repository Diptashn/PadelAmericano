import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../constants/theme';
import { triggerHaptic } from '../utils/haptics';

interface RoundProgressBarProps {
  currentRoundIndex: number;
  totalRounds: number;
  completedRounds: boolean[];
  onSelectRound: (index: number) => void;
  onOpenStandings: () => void;
}

export const RoundProgressBar: React.FC<RoundProgressBarProps> = ({
  currentRoundIndex,
  totalRounds,
  completedRounds,
  onSelectRound,
  onOpenStandings,
}) => {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.surfaceBorder,
        },
      ]}
    >
      {/* Top row: Round title + Actions (Theme toggle + Standings trigger) */}
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <Text style={[styles.roundLabel, { color: colors.primary }]}>MATCH PLAY</Text>
          <View style={styles.roundNumberRow}>
            <Text style={[styles.roundBigNumber, { color: colors.text }]}>
              Round {currentRoundIndex + 1}
            </Text>
            <Text style={[styles.roundTotalText, { color: colors.textMuted }]}>
              of {totalRounds}
            </Text>
          </View>
        </View>

        <View style={styles.topRightActions}>
          {/* Theme Toggle Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            style={({ pressed }) => [
              styles.themeToggleBtn,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.surfaceBorderHighlight,
              },
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              triggerHaptic('light');
              toggleTheme();
            }}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={18}
              color={isDark ? '#F59E0B' : colors.primary}
            />
          </Pressable>

          {/* Standings Modal Trigger */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View live standings"
            style={({ pressed }) => [
              styles.standingsButton,
              {
                backgroundColor: colors.primarySurface,
                borderColor: colors.primary,
              },
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              triggerHaptic('light');
              onOpenStandings();
            }}
          >
            <Ionicons name="podium" size={18} color={colors.primary} />
            <Text style={[styles.standingsButtonText, { color: colors.primary }]}>
              Standings
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Interactive Round Pills Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsContainer}
      >
        {Array.from({ length: totalRounds }).map((_, idx) => {
          const isCurrent = idx === currentRoundIndex;
          const isDone = completedRounds[idx];

          return (
            <Pressable
              key={idx}
              accessibilityRole="button"
              accessibilityLabel={`Go to round ${idx + 1}`}
              style={({ pressed }) => [
                styles.roundPill,
                {
                  backgroundColor: isCurrent
                    ? colors.primary
                    : isDone
                    ? colors.primarySurface
                    : colors.surfaceElevated,
                  borderColor: isCurrent
                    ? colors.primaryLight
                    : isDone
                    ? colors.primaryDark
                    : colors.surfaceBorderHighlight,
                },
                pressed && styles.buttonPressed,
              ]}
              onPress={() => {
                triggerHaptic('light');
                onSelectRound(idx);
              }}
            >
              {isDone ? (
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={isCurrent ? colors.buttonText : colors.primary}
                />
              ) : (
                <Text
                  style={[
                    styles.roundPillText,
                    {
                      color: isCurrent
                        ? colors.buttonText
                        : isDone
                        ? colors.primary
                        : colors.textMuted,
                    },
                  ]}
                >
                  R{idx + 1}
                </Text>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1.5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleContainer: {
    flexDirection: 'column',
  },
  roundLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  roundNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  roundBigNumber: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  roundTotalText: {
    fontSize: 15,
    fontWeight: '700',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  standingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  standingsButtonText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingRight: 16,
  },
  roundPill: {
    width: 48,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  roundPillText: {
    fontSize: 13,
    fontWeight: '800',
  },
  buttonPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.8,
  },
});
