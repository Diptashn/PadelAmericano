import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { PlayerStanding } from '../types';
import { useTheme, SHADOWS } from '../constants/theme';
import { formatDiff } from '../utils/shareFormatter';
import { triggerHaptic } from '../utils/haptics';

interface StandingsTableProps {
  standings: PlayerStanding[];
  onSelectPlayer: (playerStanding: PlayerStanding) => void;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  standings,
  onSelectPlayer,
}) => {
  const { colors, isDark } = useTheme();

  if (standings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="trophy-outline" size={54} color={colors.textMuted} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Scores Yet</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Play rounds and record points to generate the live tournament standings.
        </Text>
      </View>
    );
  }

  const firstPlace = standings[0];
  const secondPlace = standings[1];
  const thirdPlace = standings[2];

  const handlePlayerPress = (item: PlayerStanding) => {
    triggerHaptic('light');
    onSelectPlayer(item);
  };

  return (
    <View style={styles.container}>
      {/* Visual Podium for Top 3 */}
      {standings.length >= 3 && (
        <View style={styles.podiumContainer}>
          {/* 2nd Place (Silver) */}
          {secondPlace && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`2nd place ${secondPlace.player.name}`}
              style={({ pressed }) => [
                styles.podiumColumn,
                {
                  borderColor: colors.podiumSilver,
                  backgroundColor: isDark
                    ? 'rgba(148, 163, 184, 0.06)'
                    : 'rgba(148, 163, 184, 0.12)',
                },
                pressed && styles.itemPressed,
              ]}
              onPress={() => handlePlayerPress(secondPlace)}
            >
              <View
                style={[
                  styles.avatarCircle,
                  {
                    borderColor: colors.podiumSilver,
                    backgroundColor: colors.surfaceElevated,
                  },
                ]}
              >
                <Text style={[styles.avatarText, { color: colors.text }]}>
                  {secondPlace.player.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View
                style={[
                  styles.medalPill,
                  { backgroundColor: colors.podiumSilverSurface },
                ]}
              >
                <Text style={styles.medalIcon}>🥈</Text>
                <Text style={[styles.medalRank, { color: colors.podiumSilver }]}>2nd</Text>
              </View>
              <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
                {secondPlace.player.name}
              </Text>
              <Text style={[styles.podiumScore, { color: colors.podiumSilver }]}>
                {secondPlace.pointsWon}{' '}
                <Text style={[styles.podiumPtsUnit, { color: colors.textMuted }]}>pts</Text>
              </Text>
              <Text
                style={[
                  styles.podiumDiff,
                  secondPlace.pointDifferential >= 0
                    ? { color: colors.primary }
                    : { color: colors.danger },
                ]}
              >
                {formatDiff(secondPlace.pointDifferential)} diff
              </Text>
            </Pressable>
          )}

          {/* 1st Place (Gold - Hero Center) */}
          {firstPlace && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Champion 1st place ${firstPlace.player.name}`}
              style={({ pressed }) => [
                styles.podiumColumn,
                styles.podiumGold,
                {
                  borderColor: colors.podiumGold,
                  backgroundColor: isDark
                    ? 'rgba(245, 158, 11, 0.08)'
                    : 'rgba(245, 158, 11, 0.12)',
                },
                pressed && styles.itemPressed,
              ]}
              onPress={() => handlePlayerPress(firstPlace)}
            >
              <View style={styles.crownContainer}>
                <FontAwesome5 name="crown" size={20} color={colors.podiumGold} />
              </View>
              <View
                style={[
                  styles.avatarCircle,
                  styles.avatarGold,
                  {
                    borderColor: colors.podiumGold,
                    backgroundColor: isDark
                      ? 'rgba(245, 158, 11, 0.2)'
                      : 'rgba(245, 158, 11, 0.25)',
                  },
                ]}
              >
                <Text style={[styles.avatarText, { color: colors.podiumGold }]}>
                  {firstPlace.player.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View
                style={[
                  styles.medalPill,
                  { backgroundColor: colors.podiumGoldSurface },
                ]}
              >
                <Text style={styles.medalIcon}>🥇</Text>
                <Text style={[styles.medalRank, { color: colors.podiumGold }]}>CHAMPION</Text>
              </View>
              <Text
                style={[styles.podiumName, styles.podiumNameGold, { color: colors.text }]}
                numberOfLines={1}
              >
                {firstPlace.player.name}
              </Text>
              <Text style={[styles.podiumScore, { color: colors.podiumGold }]}>
                {firstPlace.pointsWon}{' '}
                <Text style={[styles.podiumPtsUnit, { color: colors.textMuted }]}>pts</Text>
              </Text>
              <Text
                style={[
                  styles.podiumDiff,
                  firstPlace.pointDifferential >= 0
                    ? { color: colors.primary }
                    : { color: colors.danger },
                ]}
              >
                {formatDiff(firstPlace.pointDifferential)} diff
              </Text>
            </Pressable>
          )}

          {/* 3rd Place (Bronze) */}
          {thirdPlace && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`3rd place ${thirdPlace.player.name}`}
              style={({ pressed }) => [
                styles.podiumColumn,
                {
                  borderColor: colors.podiumBronze,
                  backgroundColor: isDark
                    ? 'rgba(217, 119, 6, 0.06)'
                    : 'rgba(217, 119, 6, 0.12)',
                },
                pressed && styles.itemPressed,
              ]}
              onPress={() => handlePlayerPress(thirdPlace)}
            >
              <View
                style={[
                  styles.avatarCircle,
                  {
                    borderColor: colors.podiumBronze,
                    backgroundColor: colors.surfaceElevated,
                  },
                ]}
              >
                <Text style={[styles.avatarText, { color: colors.text }]}>
                  {thirdPlace.player.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View
                style={[
                  styles.medalPill,
                  { backgroundColor: colors.podiumBronzeSurface },
                ]}
              >
                <Text style={styles.medalIcon}>🥉</Text>
                <Text style={[styles.medalRank, { color: colors.podiumBronze }]}>3rd</Text>
              </View>
              <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
                {thirdPlace.player.name}
              </Text>
              <Text style={[styles.podiumScore, { color: colors.podiumBronze }]}>
                {thirdPlace.pointsWon}{' '}
                <Text style={[styles.podiumPtsUnit, { color: colors.textMuted }]}>pts</Text>
              </Text>
              <Text
                style={[
                  styles.podiumDiff,
                  thirdPlace.pointDifferential >= 0
                    ? { color: colors.primary }
                    : { color: colors.danger },
                ]}
              >
                {formatDiff(thirdPlace.pointDifferential)} diff
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Complete Rankings Header */}
      <View style={styles.listHeader}>
        <Text style={[styles.listHeaderTitle, { color: colors.textSecondary }]}>
          ALL PLAYERS STANDINGS
        </Text>
        <Text style={[styles.listHeaderHint, { color: colors.textMuted }]}>
          Tap player for match history
        </Text>
      </View>

      {/* Players List Table */}
      <View style={styles.listContainer}>
        {standings.map((item) => {
          const isGold = item.rank === 1;
          const isSilver = item.rank === 2;
          const isBronze = item.rank === 3;

          return (
            <Pressable
              key={item.player.id}
              accessibilityRole="button"
              accessibilityLabel={`Rank ${item.rank} ${item.player.name}, ${item.pointsWon} points`}
              style={({ pressed }) => [
                styles.playerRow,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.surfaceBorder,
                },
                isGold && {
                  borderColor: isDark ? 'rgba(204, 255, 0, 0.4)' : 'rgba(101, 163, 13, 0.35)',
                  backgroundColor: isDark
                    ? 'rgba(204, 255, 0, 0.05)'
                    : 'rgba(101, 163, 13, 0.06)',
                },
                pressed && styles.itemPressed,
              ]}
              onPress={() => handlePlayerPress(item)}
            >
              {/* Rank Badge */}
              <View
                style={[
                  styles.rankBadge,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.surfaceBorderHighlight,
                  },
                  isGold && {
                    backgroundColor: colors.podiumGold,
                    borderColor: '#FDE047',
                  },
                  isSilver && {
                    backgroundColor: colors.podiumSilver,
                    borderColor: '#E2E8F0',
                  },
                  isBronze && {
                    backgroundColor: colors.podiumBronze,
                    borderColor: '#FDBA74',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.rankBadgeText,
                    { color: colors.text },
                    (isGold || isSilver || isBronze) && styles.rankBadgeTextDark,
                  ]}
                >
                  {item.rank}
                </Text>
              </View>

              {/* Player Info */}
              <View style={styles.playerInfo}>
                <Text style={[styles.rowPlayerName, { color: colors.text }]} numberOfLines={1}>
                  {item.player.name}
                </Text>
                <View style={styles.recordRow}>
                  <Text style={[styles.recordText, { color: colors.textMuted }]}>
                    {item.matchesWon}W · {item.matchesDrawn}D · {item.matchesLost}L
                  </Text>
                  <Text style={[styles.recordDot, { color: colors.textMuted }]}>•</Text>
                  <Text
                    style={[
                      styles.diffBadge,
                      { color: colors.textSecondary },
                      item.pointDifferential > 0 && { color: colors.primary },
                      item.pointDifferential < 0 && { color: colors.danger },
                    ]}
                  >
                    Diff: {formatDiff(item.pointDifferential)}
                  </Text>
                </View>
              </View>

              {/* Total Points */}
              <View style={styles.pointsColumn}>
                <Text
                  style={[
                    styles.pointsWonText,
                    { color: colors.text },
                    isGold && { color: colors.primary },
                  ]}
                >
                  {item.pointsWon}
                </Text>
                <Text style={[styles.pointsWonLabel, { color: colors.textMuted }]}>PTS</Text>
              </View>

              {/* Chevron */}
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 54,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 14,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 20,
    paddingTop: 14,
  },
  podiumColumn: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    minHeight: 180,
    ...SHADOWS.card,
  },
  podiumGold: {
    flex: 1.15,
    paddingTop: 16,
    paddingBottom: 18,
    minHeight: 205,
    transform: [{ translateY: -12 }],
  },
  crownContainer: {
    marginBottom: 6,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 6,
  },
  avatarGold: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '900',
  },
  medalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 6,
  },
  medalIcon: {
    fontSize: 12,
  },
  medalRank: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  podiumName: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumNameGold: {
    fontSize: 15,
    fontWeight: '900',
  },
  podiumScore: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  podiumPtsUnit: {
    fontSize: 10,
    fontWeight: '800',
  },
  podiumDiff: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 12,
  },
  listHeaderTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  listHeaderHint: {
    fontSize: 11,
    fontWeight: '600',
  },
  listContainer: {
    gap: 10,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    minHeight: 66,
    ...SHADOWS.card,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1.5,
  },
  rankBadgeText: {
    fontSize: 15,
    fontWeight: '900',
  },
  rankBadgeTextDark: {
    color: '#000000',
  },
  playerInfo: {
    flex: 1,
  },
  rowPlayerName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 3,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recordDot: {
    fontSize: 10,
  },
  diffBadge: {
    fontSize: 12,
    fontWeight: '700',
  },
  pointsColumn: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  pointsWonText: {
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 26,
    fontVariant: ['tabular-nums'],
  },
  pointsWonLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  itemPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
