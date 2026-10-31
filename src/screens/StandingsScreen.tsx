import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTournamentStore } from '../store/tournamentStore';
import { useTheme, SHADOWS } from '../constants/theme';
import { StandingsTable } from '../components/StandingsTable';
import { PlayerBreakdownModal } from '../components/PlayerBreakdownModal';
import { WhatsAppShareModal } from '../components/WhatsAppShareModal';
import { PlayerStanding } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { AdBanner } from '../components/AdBanner';

export const StandingsScreen: React.FC = () => {
  const {
    activeTournament,
    getStandings,
    setActiveTab,
    resetTournament,
    toggleTheme,
  } = useTournamentStore();

  const { colors, isDark } = useTheme();

  const [selectedPlayerStanding, setSelectedPlayerStanding] =
    useState<PlayerStanding | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const standings = getStandings();

  const handleResetConfirm = () => {
    triggerHaptic('warning');
    if (Platform.OS === 'web') {
      if (window.confirm('Start a new tournament? Current tournament results have been saved to history.')) {
        resetTournament();
      }
    } else {
      Alert.alert(
        'New Tournament',
        'Start a new tournament? Current tournament results have been safely saved to history.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Start New', style: 'destructive', onPress: () => resetTournament() },
        ]
      );
    }
  };

  if (!activeTournament) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="podium-outline" size={68} color={colors.textMuted} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Tournament Active</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Create a tournament in Setup to track points and view live standings.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go to setup"
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: colors.primary },
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setActiveTab('setup')}
        >
          <Text style={[styles.primaryButtonText, { color: colors.buttonText }]}>Go to Setup</Text>
        </Pressable>
        <AdBanner style={{ marginTop: 28, borderRadius: 14, overflow: 'hidden' }} />
      </View>
    );
  }

  const isCompleted = activeTournament.isCompleted;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View
        style={[
          styles.topHeader,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.surfaceBorder,
          },
        ]}
      >
        <View>
          <View style={styles.statusPillRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isCompleted ? colors.podiumGold : colors.primary },
              ]}
            />
            <Text
              style={[
                styles.statusPillText,
                { color: isCompleted ? colors.podiumGold : colors.primary },
              ]}
            >
              {isCompleted ? 'TOURNAMENT FINISHED 🏆' : 'LIVE LEADERBOARD'}
            </Text>
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Leaderboard</Text>
        </View>

        <View style={styles.headerRightActions}>
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
              size={20}
              color={isDark ? '#F59E0B' : colors.primary}
            />
          </Pressable>

          {/* WhatsApp Header Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Share to WhatsApp"
            style={({ pressed }) => [styles.whatsappHeaderBtn, pressed && styles.buttonPressed]}
            onPress={() => {
              triggerHaptic('medium');
              setShowShareModal(true);
            }}
          >
            <FontAwesome name="whatsapp" size={18} color="#FFFFFF" />
            <Text style={styles.whatsappHeaderBtnText}>Share</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {/* Quick summary stats banner */}
        <View
          style={[
            styles.summaryBanner,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.surfaceBorder,
            },
          ]}
        >
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {activeTournament.players.length}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>PLAYERS</Text>
          </View>
          <View
            style={[
              styles.summaryDivider,
              { backgroundColor: colors.surfaceBorderHighlight },
            ]}
          />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {activeTournament.rounds.length}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>ROUNDS</Text>
          </View>
          <View
            style={[
              styles.summaryDivider,
              { backgroundColor: colors.surfaceBorderHighlight },
            ]}
          />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {activeTournament.config.totalPoints}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>PTS/MATCH</Text>
          </View>
        </View>

        {/* Podium and Standings Table */}
        <StandingsTable
          standings={standings}
          onSelectPlayer={(p) => setSelectedPlayerStanding(p)}
        />

        {/* Action Controls */}
        <View style={styles.actionsBox}>
          {!isCompleted && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Resume match play"
              style={({ pressed }) => [
                styles.resumeMatchBtn,
                { backgroundColor: colors.primary },
                pressed && styles.buttonPressed,
              ]}
              onPress={() => {
                triggerHaptic('light');
                setActiveTab('match');
              }}
            >
              <MaterialCommunityIcons name="tennis" size={20} color={colors.buttonText} />
              <Text style={[styles.resumeMatchBtnText, { color: colors.buttonText }]}>
                Resume Match Play
              </Text>
            </Pressable>
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start new tournament"
            style={({ pressed }) => [
              styles.newTournamentBtn,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.surfaceBorder,
              },
              pressed && styles.buttonPressed,
            ]}
            onPress={handleResetConfirm}
          >
            <Ionicons name="refresh" size={20} color={colors.textSecondary} />
            <Text style={[styles.newTournamentBtnText, { color: colors.textSecondary }]}>
              Start New Tournament
            </Text>
          </Pressable>
        </View>

        {/* AdMob Banner */}
        <AdBanner style={{ marginTop: 20, marginBottom: 85, borderRadius: 14, overflow: 'hidden' }} />
      </ScrollView>

      {/* Floating WhatsApp Share CTA */}
      <View style={styles.floatingShareContainer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share results to WhatsApp"
          style={({ pressed }) => [styles.floatingShareButton, pressed && styles.buttonPressed]}
          onPress={() => {
            triggerHaptic('medium');
            setShowShareModal(true);
          }}
        >
          <FontAwesome name="whatsapp" size={24} color="#FFFFFF" />
          <Text style={styles.floatingShareButtonText}>Share Results to WhatsApp</Text>
        </Pressable>
      </View>

      {/* Modals */}
      <PlayerBreakdownModal
        visible={!!selectedPlayerStanding}
        playerStanding={selectedPlayerStanding}
        tournament={activeTournament}
        onClose={() => setSelectedPlayerStanding(null)}
      />

      <WhatsAppShareModal
        visible={showShareModal}
        tournament={activeTournament}
        standings={standings}
        onClose={() => setShowShareModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1.5,
  },
  statusPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeToggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  whatsappHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#25D366',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    ...SHADOWS.card,
  },
  whatsappHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  scrollList: {
    paddingBottom: 110,
  },
  summaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 18,
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1.5,
    height: 28,
  },
  actionsBox: {
    paddingHorizontal: 18,
    marginTop: 12,
    gap: 12,
  },
  resumeMatchBtn: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 18,
    ...SHADOWS.primaryGlow,
  },
  resumeMatchBtnText: {
    fontSize: 16,
    fontWeight: '900',
  },
  newTournamentBtn: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  newTournamentBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  floatingShareContainer: {
    position: 'absolute',
    bottom: 20,
    left: 18,
    right: 18,
  },
  floatingShareButton: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#25D366',
    borderRadius: 22,
    ...SHADOWS.card,
  },
  floatingShareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
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
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  primaryButton: {
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 18,
    marginTop: 24,
    ...SHADOWS.primaryGlow,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '900',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
