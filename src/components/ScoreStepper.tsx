import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../constants/theme';
import { triggerHaptic } from '../utils/haptics';

interface ScoreStepperProps {
  score: number;
  min?: number;
  max?: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  accentColor?: string;
  label?: string;
}

export const ScoreStepper: React.FC<ScoreStepperProps> = ({
  score,
  min = 0,
  max = 32,
  onIncrement,
  onDecrement,
  disabled = false,
  accentColor,
  label,
}) => {
  const { colors, isDark } = useTheme();
  const effectiveAccent = accentColor || colors.primary;

  const canDecrement = score > min && !disabled;
  const canIncrement = score < max && !disabled;

  const handleDecrement = () => {
    if (!canDecrement) {
      triggerHaptic('warning');
      return;
    }
    triggerHaptic('medium');
    onDecrement();
  };

  const handleIncrement = () => {
    if (!canIncrement) {
      triggerHaptic('warning');
      return;
    }
    triggerHaptic('medium');
    onIncrement();
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
      <View
        style={[
          styles.stepperRow,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.surfaceBorder,
          },
        ]}
      >
        {/* Decrement Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Decrease score"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => [
            styles.stepperButton,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.surfaceBorderHighlight,
            },
            !canDecrement && styles.buttonDisabled,
            pressed && canDecrement && styles.buttonPressed,
          ]}
          onPress={handleDecrement}
          disabled={!canDecrement}
        >
          <Ionicons
            name="remove"
            size={32}
            color={canDecrement ? colors.text : colors.textMuted}
          />
        </Pressable>

        {/* Score Number Display */}
        <View style={styles.scoreContainer}>
          <Text
            style={[
              styles.scoreText,
              { color: effectiveAccent },
              isDark && score >= 20 && styles.scoreTextHighlight,
            ]}
          >
            {score}
          </Text>
          <Text style={[styles.ptsUnit, { color: colors.textMuted }]}>POINTS</Text>
        </View>

        {/* Increment Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Increase score"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => [
            styles.stepperButton,
            styles.stepperButtonInc,
            { backgroundColor: effectiveAccent },
            !canIncrement && styles.buttonDisabled,
            pressed && canIncrement && styles.buttonPressed,
          ]}
          onPress={handleIncrement}
          disabled={!canIncrement}
        >
          <Ionicons
            name="add"
            size={34}
            color={colors.buttonText}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  stepperRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 22,
    padding: 8,
    borderWidth: 1.5,
  },
  stepperButton: {
    width: 64,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  stepperButtonInc: {
    borderColor: 'transparent',
  },
  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },
  buttonDisabled: {
    opacity: 0.25,
    borderColor: 'transparent',
  },
  scoreContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
    lineHeight: 52,
  },
  scoreTextHighlight: {
    textShadowColor: 'rgba(204, 255, 0, 0.25)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  ptsUnit: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginTop: -2,
  },
});
