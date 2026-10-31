import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlayerStanding, Tournament } from '../types';
import { useTheme, SHADOWS } from '../constants/theme';
import { getPlayerMatchHistory } from '../utils/tournamentEngine';
import { formatDiff } from '../utils/shareFormatter';

interface PlayerBreakdownModalProps {
  visible: boolean;
  playerStanding: PlayerStanding | null;
  tournament: Tournament | null;
  onClose: () => void;
}

export const PlayerBreakdownModal: React.FC<PlayerBreakdownModalProps> = ({
  visible,
  playerStanding,
  tournament,
  onClose,
}) => {
  const { colors } = useTheme();

  if (!playerStanding || !tournament) return null;

  const history = getPlayerMatchHistory(tournament, playerStanding.player.id);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.safeContainer}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.surface,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            {/* Modal Header */}
            <View
              style={[
                styles.header,
                { borderBottomColor: colors.surfaceBorder },
              ]}
            >
              <View style={styles.playerHeaderInfo}>
                <View
                  style={[
                    styles.rankPill,
                    {
                      backgroundColor: colors.primarySurface,
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  <Text style={[styles.rankPillText, { color: colors.primary }]}>
                    #{playerStanding.rank}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.playerName, { color: colors.text }]} numberOfLines={1}>
                    {playerStanding.player.name}
                  </Text>
                  <Text style={[styles.playerSubtitle, { color: colors.textSecondary }]}>
                    {playerStanding.pointsWon} pts · {formatDiff(playerStanding.pointDifferential)} diff ·{' '}
                    {playerStanding.matchesWon}W {playerStanding.matchesDrawn}D {playerStanding.matchesLost}L
                  </Text>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close player breakdown"
                style={({ pressed }) => [
                  styles.closeButton,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.surfaceBorderHighlight,
                  },
                  pressed && styles.buttonPressed,
                ]}
                onPress={onClose}
              >
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>

            {/* Rounds History */}
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
              MATCH-BY-MATCH BREAKDOWN
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
              {history.length === 0 ? (
                <View style={styles.emptyHistory}>
                  <Ionicons name="time-outline" size={32} color={colors.textMuted} />
                  <Text style={[styles.emptyHistoryText, { color: colors.textSecondary }]}>
                    No completed rounds played yet for this tournament.
                  </Text>
                </View>
              ) : (
                history.map((match, idx) => {
                  const isWin = match.result === 'W';
                  const isLoss = match.result === 'L';
                  const isDraw = match.result === 'D';

                  return (
                    <View
                      key={idx}
                      style={[
                        styles.matchCard,
                        {
                          backgroundColor: colors.surfaceCard,
                          borderColor: colors.surfaceBorder,
                        },
                      ]}
                    >
                      <View style={styles.matchHeader}>
                        <View style={styles.roundPillSmall}>
                          <Text style={[styles.roundPillSmallText, { color: colors.text }]}>
                            ROUND {match.roundNumber}
                          </Text>
                          <Text style={[styles.courtNameText, { color: colors.textMuted }]}>
                            Court {match.courtNumber}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.resultBadge,
                            isWin && {
                              backgroundColor: colors.primarySurface,
                              borderColor: colors.primary,
                            },
                            isLoss && {
                              backgroundColor: colors.dangerSurface,
                              borderColor: colors.danger,
                            },
                            isDraw && {
                              backgroundColor: colors.surfaceElevated,
                              borderColor: colors.surfaceBorderHighlight,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.resultBadgeText,
                              isWin && { color: colors.primary },
                              isLoss && { color: colors.danger },
                              isDraw && { color: colors.textSecondary },
                            ]}
                          >
                            {isWin ? 'WIN' : isLoss ? 'LOSS' : 'DRAW'}
                          </Text>
                        </View>
                      </View>

                      {/* Scoreline */}
                      <View style={styles.scoreRow}>
                        <View style={styles.scoreSide}>
                          <Text style={[styles.teamRoleLabel, { color: colors.textMuted }]}>
                            YOUR TEAM
                          </Text>
                          <Text style={[styles.teamMembersText, { color: colors.text }]}>
                            {playerStanding.player.name} & {match.partner.name}
                          </Text>
                        </View>

                        <View style={styles.scoreCenter}>
                          <Text
                            style={[
                              styles.scoreNumber,
                              { color: colors.text },
                              isWin && { color: colors.primary },
                            ]}
                          >
                            {match.teamScore}
                          </Text>
                          <Text style={[styles.scoreDivider, { color: colors.textMuted }]}>
                            -
                          </Text>
                          <Text
                            style={[
                              styles.scoreNumber,
                              { color: colors.text },
                              isLoss && { color: colors.danger },
                            ]}
                          >
                            {match.opponentScore}
                          </Text>
                        </View>

                        <View style={[styles.scoreSide, { alignItems: 'flex-end' }]}>
                          <Text style={[styles.teamRoleLabel, { color: colors.textMuted }]}>
                            OPPONENTS
                          </Text>
                          <Text
                            style={[
                              styles.teamMembersText,
                              { textAlign: 'right', color: colors.text },
                            ]}
                          >
                            {match.opponents[0].name} & {match.opponents[1].name}
                          </Text>
                        </View>
                      </View>

                      {/* Differential footer */}
                      <View
                        style={[
                          styles.matchFooter,
                          { borderTopColor: colors.surfaceBorder },
                        ]}
                      >
                        <Text style={[styles.diffSummaryText, { color: colors.textSecondary }]}>
                          Round Net Diff:{' '}
                          <Text
                            style={[
                              styles.diffSummaryValue,
                              match.differential > 0 && { color: colors.primary },
                              match.differential < 0 && { color: colors.danger },
                            ]}
                          >
                            {formatDiff(match.differential)} pts
                          </Text>
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  safeContainer: {
    maxHeight: '85%',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1.5,
    padding: 20,
    maxHeight: '100%',
    ...SHADOWS.modal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  playerHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rankPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  rankPillText: {
    fontSize: 16,
    fontWeight: '900',
  },
  playerName: {
    fontSize: 18,
    fontWeight: '800',
  },
  playerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 16,
    marginBottom: 12,
  },
  scrollList: {
    paddingBottom: 20,
    gap: 10,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyHistoryText: {
    fontSize: 13,
    textAlign: 'center',
  },
  matchCard: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roundPillSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roundPillSmallText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  courtNameText: {
    fontSize: 11,
    fontWeight: '600',
  },
  resultBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  resultBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  scoreSide: {
    flex: 1,
  },
  teamRoleLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  teamMembersText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scoreCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  scoreDivider: {
    fontSize: 18,
    fontWeight: '700',
  },
  matchFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },
  diffSummaryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  diffSummaryValue: {
    fontWeight: '900',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
