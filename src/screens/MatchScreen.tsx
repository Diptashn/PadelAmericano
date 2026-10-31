import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTournamentStore } from '../store/tournamentStore';
import { useTheme } from '../constants/theme';
import { RoundProgressBar } from '../components/RoundProgressBar';
import { CourtCard } from '../components/CourtCard';
import { triggerHaptic } from '../utils/haptics';
import { StandingsTable } from '../components/StandingsTable';
import { PlayerBreakdownModal } from '../components/PlayerBreakdownModal';
import { PlayerStanding } from '../types';
import { useTournamentInterstitial } from '../utils/useTournamentInterstitial';

export const MatchScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const {
    activeTournament,
    updateMatchScore,
    nextRound,
    prevRound,
    goToRound,
    setActiveTab,
    getStandings,
  } = useTournamentStore();

  const [showStandingsModal, setShowStandingsModal] = useState(false);
  const [selectedPlayerStanding, setSelectedPlayerStanding] =
    useState<PlayerStanding | null>(null);

  const { showInterstitialAndProceed } = useTournamentInterstitial();

  if (!activeTournament) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons name="tennis" size={68} color={colors.primary} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Active Tournament</Text>
        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
          Set up a new tournament or select players from your roster to begin match play.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go to tournament setup"
          style={({ pressed }) => [
            styles.startSetupButton,
            { backgroundColor: colors.primary },
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setActiveTab('setup')}
        >
          <Text style={[styles.startSetupButtonText, { color: colors.buttonText }]}>
            Go to Setup
          </Text>
        </Pressable>
      </View>
    );
  }

  const currentRoundIndex = activeTournament.currentRoundIndex;
  const currentRound = activeTournament.rounds[currentRoundIndex];
  const totalRounds = activeTournament.rounds.length;
  const isLastRound = currentRoundIndex === totalRounds - 1;

  const completedRounds = activeTournament.rounds.map((r) => r.isCompleted);

  const handleNextOrFinish = () => {
    triggerHaptic('success');
    if (isLastRound) {
      showInterstitialAndProceed(() => {
        nextRound();
      });
    } else {
      nextRound();
    }
  };

  const handlePrev = () => {
    triggerHaptic('light');
    prevRound();
  };

  const standings = getStandings();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Round Progress Header */}
      <RoundProgressBar
        currentRoundIndex={currentRoundIndex}
        totalRounds={totalRounds}
        completedRounds={completedRounds}
        onSelectRound={goToRound}
        onOpenStandings={() => setShowStandingsModal(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {/* Round Navigation Arrows & Theme Toggle */}
        <View style={styles.roundNavigatorRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous round"
            style={({ pressed }) => [
              styles.navArrowButton,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.surfaceBorder,
              },
              currentRoundIndex === 0 && styles.arrowDisabled,
              pressed && currentRoundIndex > 0 && styles.buttonPressed,
            ]}
            onPress={handlePrev}
            disabled={currentRoundIndex === 0}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={currentRoundIndex === 0 ? colors.textMuted : colors.text}
            />
            <Text
              style={[
                styles.navArrowText,
                { color: currentRoundIndex === 0 ? colors.textMuted : colors.text },
              ]}
            >
              Prev Round
            </Text>
          </Pressable>

          <View
            style={[
              styles.roundCenterBadge,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.surfaceBorderHighlight,
              },
            ]}
          >
            <Text style={[styles.roundBadgeLabel, { color: colors.primary }]}>
              {currentRound.isCompleted ? 'COMPLETED' : 'IN PLAY'}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next round"
            style={({ pressed }) => [
              styles.navArrowButton,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.surfaceBorder,
              },
              isLastRound && styles.arrowDisabled,
              pressed && !isLastRound && styles.buttonPressed,
            ]}
            onPress={() => {
              if (!isLastRound) {
                triggerHaptic('light');
                goToRound(currentRoundIndex + 1);
              }
            }}
            disabled={isLastRound}
          >
            <Text
              style={[
                styles.navArrowText,
                { color: isLastRound ? colors.textMuted : colors.text },
              ]}
            >
              Next Round
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isLastRound ? colors.textMuted : colors.text}
            />
          </Pressable>
        </View>

        {/* Bye Player Alert (if 5 players or odd count) */}
        {currentRound.byePlayer && (
          <View
            style={[
              styles.byeCard,
              {
                backgroundColor: colors.accentOrangeSurface,
                borderColor: colors.accentOrange,
              },
            ]}
          >
            <View
              style={[
                styles.byeIconCircle,
                { backgroundColor: colors.accentOrangeSurface },
              ]}
            >
              <Ionicons name="cafe" size={22} color={colors.accentOrange} />
            </View>
            <View style={styles.byeInfo}>
              <Text style={[styles.byeTitle, { color: colors.accentOrange }]}>
                BYE ROUND (RESTING)
              </Text>
              <Text style={[styles.byePlayerName, { color: colors.text }]}>
                {currentRound.byePlayer.name} sits out this round ☕
              </Text>
            </View>
          </View>
        )}

        {/* Court Cards */}
        {currentRound.matches.map((match, matchIdx) => (
          <CourtCard
            key={match.id}
            match={match}
            config={activeTournament.config}
            onUpdateScore={(teamAScore) =>
              updateMatchScore(currentRoundIndex, matchIdx, teamAScore)
            }
          />
        ))}

        {/* Action Button: Save & Next Round OR Finish */}
        <View style={styles.actionContainer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isLastRound ? 'Finish tournament' : 'Save and advance to next round'}
            style={({ pressed }) => [
              styles.nextRoundButton,
              { backgroundColor: isLastRound ? colors.podiumGold : colors.primary },
              pressed && styles.buttonPressed,
            ]}
            onPress={handleNextOrFinish}
          >
            <Text
              style={[
                styles.nextRoundButtonText,
                { color: isLastRound ? '#000000' : colors.buttonText },
              ]}
            >
              {isLastRound ? 'Finish Tournament & See Winners 🏆' : 'Save & Next Round ➔'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Standings Modal Popup */}
      {showStandingsModal && (
        <View style={styles.overlayModal}>
          <View
            style={[
              styles.standingsModalCard,
              {
                backgroundColor: colors.background,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: colors.surfaceBorder },
              ]}
            >
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Live Tournament Standings
                </Text>
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  Current leaderboard through Round {currentRoundIndex + 1}
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close standings modal"
                style={[
                  styles.closeModalBtn,
                  { backgroundColor: colors.surfaceElevated },
                ]}
                onPress={() => setShowStandingsModal(false)}
              >
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <StandingsTable
                standings={standings}
                onSelectPlayer={(p) => setSelectedPlayerStanding(p)}
              />
            </ScrollView>
          </View>
        </View>
      )}

      {/* Player Detailed Breakdown Modal */}
      <PlayerBreakdownModal
        visible={!!selectedPlayerStanding}
        playerStanding={selectedPlayerStanding}
        tournament={activeTournament}
        onClose={() => setSelectedPlayerStanding(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollList: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 40,
  },
  roundNavigatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navArrowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    minHeight: 44,
  },
  arrowDisabled: {
    opacity: 0.35,
  },
  navArrowText: {
    fontSize: 13,
    fontWeight: '700',
  },
  roundCenterBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  roundBadgeLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  byeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 20,
  },
  byeIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  byeInfo: {
    flex: 1,
  },
  byeTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  byePlayerName: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  actionContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  nextRoundButton: {
    height: 60,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextRoundButtonText: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  startSetupButton: {
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 18,
    marginTop: 24,
  },
  startSetupButtonText: {
    fontSize: 16,
    fontWeight: '900',
  },
  overlayModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  standingsModalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1.5,
    maxHeight: '90%',
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1.5,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '900',
  },
  modalSubtitle: {
    fontSize: 12,
  },
  closeModalBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
