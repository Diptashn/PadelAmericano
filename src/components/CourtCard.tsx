import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Match, TournamentConfig } from '../types';
import { useTheme } from '../constants/theme';
import { ScoreStepper } from './ScoreStepper';
import { triggerHaptic } from '../utils/haptics';

interface CourtCardProps {
  match: Match;
  config: TournamentConfig;
  onUpdateScore: (teamAScore: number) => void;
}

export const CourtCard: React.FC<CourtCardProps> = ({
  match,
  config,
  onUpdateScore,
}) => {
  const { colors, isDark } = useTheme();
  const totalPoints = config.totalPoints;
  const scoreA = match.teamA.score;
  const scoreB = match.teamB.score;

  const handleIncrementA = () => {
    if (scoreA < totalPoints) {
      onUpdateScore(scoreA + 1);
    }
  };

  const handleDecrementA = () => {
    if (scoreA > 0) {
      onUpdateScore(scoreA - 1);
    }
  };

  const handleIncrementB = () => {
    if (scoreA > 0) {
      onUpdateScore(scoreA - 1);
    }
  };

  const handleDecrementB = () => {
    if (scoreA < totalPoints) {
      onUpdateScore(scoreA + 1);
    }
  };

  const setDraw = () => {
    triggerHaptic('medium');
    const half = Math.floor(totalPoints / 2);
    onUpdateScore(half);
  };

  const setTeamAWinPreset = (ptsA: number) => {
    triggerHaptic('medium');
    onUpdateScore(Math.min(totalPoints, Math.max(0, ptsA)));
  };

  const half = Math.floor(totalPoints / 2);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.surfaceBorder,
        },
      ]}
    >
      {/* Court Header */}
      <View style={[styles.header, { borderBottomColor: colors.surfaceBorder }]}>
        <View
          style={[
            styles.courtBadge,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.surfaceBorderHighlight,
            },
          ]}
        >
          <MaterialCommunityIcons name="tennis" size={18} color={colors.primary} />
          <Text style={[styles.courtBadgeText, { color: colors.text }]}>
            {match.courtName.toUpperCase()}
          </Text>
        </View>

        <View
          style={[
            styles.targetBadge,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : colors.surfaceElevated,
              borderColor: colors.surfaceBorder,
            },
          ]}
        >
          <Text style={[styles.targetBadgeText, { color: colors.textSecondary }]}>
            TOTAL: {totalPoints} PTS
          </Text>
        </View>
      </View>

      {/* Team 1 Section */}
      <View
        style={[
          styles.teamSection,
          {
            backgroundColor: colors.surfaceCard,
            borderColor: colors.surfaceBorder,
          },
          scoreA > scoreB && {
            borderColor: colors.primary,
            backgroundColor: colors.primarySurface,
          },
        ]}
      >
        <View style={styles.teamHeaderRow}>
          <View style={[styles.teamTag, { backgroundColor: colors.primarySurface }]}>
            <Text style={[styles.teamTagText, { color: colors.primary }]}>TEAM 1</Text>
          </View>

          {scoreA > scoreB && (
            <View style={styles.winBadge}>
              <Ionicons name="arrow-up-circle" size={15} color={colors.primary} />
              <Text style={[styles.winBadgeText, { color: colors.primary }]}>
                +{scoreA - scoreB} LEAD
              </Text>
            </View>
          )}
        </View>

        {/* Players List */}
        <View
          style={[
            styles.playersRow,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.surfaceBorderHighlight,
            },
          ]}
        >
          <View style={styles.playerItem}>
            <View
              style={[
                styles.playerAvatar,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.primary,
                },
              ]}
            >
              <Text style={[styles.avatarText, { color: colors.text }]}>
                {match.teamA.player1.name.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.playerName, { color: colors.text }]} numberOfLines={1}>
              {match.teamA.player1.name}
            </Text>
          </View>

          <Text style={[styles.playerAmpersand, { color: colors.textMuted }]}>&</Text>

          <View style={styles.playerItem}>
            <View
              style={[
                styles.playerAvatar,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.primary,
                },
              ]}
            >
              <Text style={[styles.avatarText, { color: colors.text }]}>
                {match.teamA.player2.name.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.playerName, { color: colors.text }]} numberOfLines={1}>
              {match.teamA.player2.name}
            </Text>
          </View>
        </View>

        {/* Big Touch Stepper for Team 1 */}
        <ScoreStepper
          score={scoreA}
          min={0}
          max={totalPoints}
          onIncrement={handleIncrementA}
          onDecrement={handleDecrementA}
          accentColor={colors.primary}
        />
      </View>

      {/* Midfield VS Divider */}
      <View style={styles.vsContainer}>
        <View style={[styles.vsLine, { backgroundColor: colors.surfaceBorderHighlight }]} />
        <View
          style={[
            styles.vsPill,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.surfaceBorderHighlight,
            },
          ]}
        >
          <Text style={[styles.vsText, { color: colors.textMuted }]}>VS</Text>
        </View>
        <View style={[styles.vsLine, { backgroundColor: colors.surfaceBorderHighlight }]} />
      </View>

      {/* Team 2 Section */}
      <View
        style={[
          styles.teamSection,
          {
            backgroundColor: colors.surfaceCard,
            borderColor: colors.surfaceBorder,
          },
          scoreB > scoreA && {
            borderColor: colors.accentCyan,
            backgroundColor: colors.accentCyanSurface,
          },
        ]}
      >
        <View style={styles.teamHeaderRow}>
          <View style={[styles.teamTag, { backgroundColor: colors.accentCyanSurface }]}>
            <Text style={[styles.teamTagText, { color: colors.accentCyan }]}>TEAM 2</Text>
          </View>

          {scoreB > scoreA && (
            <View style={styles.winBadge}>
              <Ionicons name="arrow-up-circle" size={15} color={colors.accentCyan} />
              <Text style={[styles.winBadgeText, { color: colors.accentCyan }]}>
                +{scoreB - scoreA} LEAD
              </Text>
            </View>
          )}
        </View>

        {/* Players List */}
        <View
          style={[
            styles.playersRow,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.surfaceBorderHighlight,
            },
          ]}
        >
          <View style={styles.playerItem}>
            <View
              style={[
                styles.playerAvatar,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.accentCyan,
                },
              ]}
            >
              <Text style={[styles.avatarText, { color: colors.text }]}>
                {match.teamB.player1.name.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.playerName, { color: colors.text }]} numberOfLines={1}>
              {match.teamB.player1.name}
            </Text>
          </View>

          <Text style={[styles.playerAmpersand, { color: colors.textMuted }]}>&</Text>

          <View style={styles.playerItem}>
            <View
              style={[
                styles.playerAvatar,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.accentCyan,
                },
              ]}
            >
              <Text style={[styles.avatarText, { color: colors.text }]}>
                {match.teamB.player2.name.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.playerName, { color: colors.text }]} numberOfLines={1}>
              {match.teamB.player2.name}
            </Text>
          </View>
        </View>

        {/* Big Touch Stepper for Team 2 */}
        <ScoreStepper
          score={scoreB}
          min={0}
          max={totalPoints}
          onIncrement={handleIncrementB}
          onDecrement={handleDecrementB}
          accentColor={colors.accentCyan}
        />
      </View>

      {/* Quick Presets Bar */}
      <View style={[styles.presetsRow, { borderTopColor: colors.surfaceBorder }]}>
        <Text style={[styles.presetLabel, { color: colors.textMuted }]}>PRESETS:</Text>

        <Pressable
          style={({ pressed }) => [
            styles.presetButton,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.surfaceBorderHighlight,
            },
            pressed && styles.presetPressed,
          ]}
          onPress={setDraw}
        >
          <Ionicons name="git-compare-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.presetText, { color: colors.textSecondary }]}>
            Draw ({half}-{half})
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.presetButton,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.surfaceBorderHighlight,
            },
            pressed && styles.presetPressed,
          ]}
          onPress={() => setTeamAWinPreset(half + 4)}
        >
          <Text style={[styles.presetText, { color: colors.textSecondary }]}>
            {half + 4} - {half - 4}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.presetButton,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.surfaceBorderHighlight,
            },
            pressed && styles.presetPressed,
          ]}
          onPress={() => setTeamAWinPreset(half - 4)}
        >
          <Text style={[styles.presetText, { color: colors.textSecondary }]}>
            {half - 4} - {half + 4}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1.5,
  },
  courtBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  courtBadgeText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  targetBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  targetBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  teamSection: {
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
  },
  teamHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  teamTag: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  teamTagText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  winBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  winBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  playersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    gap: 8,
  },
  playerItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
  },
  playerName: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  playerAmpersand: {
    fontSize: 14,
    fontWeight: '900',
    paddingHorizontal: 2,
  },
  vsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  vsLine: {
    flex: 1,
    height: 1.5,
  },
  vsPill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    marginHorizontal: 10,
  },
  vsText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  presetsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1.5,
    gap: 8,
    flexWrap: 'wrap',
  },
  presetLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginRight: 4,
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  presetPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  presetText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
