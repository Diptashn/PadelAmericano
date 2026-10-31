import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useTournamentStore } from '../store/tournamentStore';
import { useTheme } from '../constants/theme';
import { triggerHaptic } from '../utils/haptics';
import { FavoritesModal } from '../components/FavoritesModal';
import { TournamentHistoryModal } from '../components/TournamentHistoryModal';
import { AdBanner } from '../components/AdBanner';

const DEMO_PRESETS: Record<number, string[]> = {
  4: ['Ale Galan', 'Juan Lebron', 'Agustin Tapia', 'Arturo Coello'],
  5: ['Ale Galan', 'Juan Lebron', 'Agustin Tapia', 'Arturo Coello', 'Paquito Navarro'],
  8: [
    'Ale Galan',
    'Juan Lebron',
    'Agustin Tapia',
    'Arturo Coello',
    'Paquito Navarro',
    'Fede Chingotto',
    'Martin Di Nenno',
    'Franco Stupaczuk',
  ],
};

export const SetupScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const {
    startTournament,
    favoritePlayers,
    savedTournaments,
    addFavoritePlayer,
    removeFavoritePlayer,
    loadSavedTournament,
    deleteSavedTournament,
  } = useTournamentStore();

  const [players, setPlayers] = useState<string[]>(DEMO_PRESETS[8]);
  const [newPlayerInput, setNewPlayerInput] = useState('');
  const [totalPoints, setTotalPoints] = useState<number>(32);
  const [courtCount, setCourtCount] = useState<number>(2);

  // Modals
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleAddPlayer = () => {
    const trimmed = newPlayerInput.trim();
    if (trimmed) {
      if (players.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
        triggerHaptic('warning');
        return;
      }
      triggerHaptic('light');
      setPlayers([...players, trimmed]);
      setNewPlayerInput('');
    }
  };

  const handleRemovePlayer = (index: number) => {
    triggerHaptic('light');
    setPlayers(players.filter((_, idx) => idx !== index));
  };

  const handleSetPlayerCountPreset = (count: number) => {
    triggerHaptic('medium');
    if (DEMO_PRESETS[count]) {
      setPlayers(DEMO_PRESETS[count]);
      if (count === 8) {
        setCourtCount(2);
      } else {
        setCourtCount(1);
      }
    }
  };

  const handleToggleFavoriteName = (name: string) => {
    const exists = players.some((p) => p.toLowerCase() === name.toLowerCase());
    if (exists) {
      setPlayers(players.filter((p) => p.toLowerCase() !== name.toLowerCase()));
    } else {
      setPlayers([...players, name]);
    }
  };

  const handleGenerateTournament = () => {
    if (players.length < 4) {
      triggerHaptic('warning');
      return;
    }
    triggerHaptic('success');
    startTournament(players, {
      totalPoints,
      courtCount,
      tournamentName: `Americano ${players.length}P`,
    });
  };

  const canGenerate = players.length >= 4;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.keyboardContainer, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Header Title & Utilities */}
        <View style={styles.topBar}>
          <View>
            <View
              style={[
                styles.appBadge,
                { backgroundColor: colors.primarySurface, borderColor: colors.primary },
              ]}
            >
              <MaterialCommunityIcons name="tennis" size={16} color={colors.primary} />
              <Text style={[styles.appBadgeText, { color: colors.primary }]}>PADEL AMERICANO</Text>
            </View>
            <Text style={[styles.screenHeading, { color: colors.text }]}>Tournament Setup</Text>
          </View>

          <View style={styles.topButtons}>
            {/* Theme Toggle Button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              style={({ pressed }) => [
                styles.iconHeaderButton,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.surfaceBorder,
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
                size={22}
                color={isDark ? '#F59E0B' : colors.primary}
              />
            </Pressable>

            {/* Saved Friends */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Saved Friends"
              style={({ pressed }) => [
                styles.iconHeaderButton,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.surfaceBorder,
                },
                pressed && styles.buttonPressed,
              ]}
              onPress={() => {
                triggerHaptic('light');
                setShowFavorites(true);
              }}
            >
              <Ionicons name="people" size={22} color={colors.primary} />
            </Pressable>

            {/* Past Sessions History */}
            {savedTournaments.length > 0 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tournament History"
                style={({ pressed }) => [
                  styles.iconHeaderButton,
                  {
                    backgroundColor: colors.surfaceCard,
                    borderColor: colors.surfaceBorder,
                  },
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => {
                  triggerHaptic('light');
                  setShowHistory(true);
                }}
              >
                <Ionicons name="time" size={22} color={colors.accentCyan} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Format Selector Pills */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>CHOOSE FORMAT</Text>
          <View style={styles.presetsRow}>
            {[
              { count: 4, label: '4 Players', desc: '1 Court · 3 Rds' },
              { count: 8, label: '8 Players', desc: '2 Courts · 7 Rds' },
              { count: 5, label: '5 Players', desc: '1 Court · 1 Bye' },
            ].map((item) => {
              const isSelected = players.length === item.count;
              return (
                <Pressable
                  key={item.count}
                  style={({ pressed }) => [
                    styles.presetPill,
                    {
                      backgroundColor: colors.surfaceCard,
                      borderColor: isSelected ? colors.primary : colors.surfaceBorder,
                    },
                    isSelected && { backgroundColor: colors.primarySurface },
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => handleSetPlayerCountPreset(item.count)}
                >
                  <Text
                    style={[
                      styles.presetPillTitle,
                      { color: isSelected ? colors.primary : colors.text },
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      styles.presetPillDesc,
                      { color: isSelected ? colors.text : colors.textMuted },
                    ]}
                  >
                    {item.desc}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Player Roster Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              PLAYER ROSTER ({players.length} PLAYERS)
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.quickFillButton,
                {
                  backgroundColor: colors.primarySurface,
                  borderColor: colors.primary,
                },
                pressed && styles.buttonPressed,
              ]}
              onPress={() => handleSetPlayerCountPreset(players.length === 4 ? 4 : players.length === 5 ? 5 : 8)}
            >
              <Ionicons name="flash" size={14} color={colors.primary} />
              <Text style={[styles.quickFillButtonText, { color: colors.primary }]}>
                Quick Fill Demo
              </Text>
            </Pressable>
          </View>

          {/* Quick Add Player Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.surfaceBorder,
                  color: colors.text,
                },
              ]}
              placeholder="Enter player name..."
              placeholderTextColor={colors.textMuted}
              value={newPlayerInput}
              onChangeText={setNewPlayerInput}
              onSubmitEditing={handleAddPlayer}
              returnKeyType="done"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add player"
              style={({ pressed }) => [
                styles.addPlayerBtn,
                { backgroundColor: colors.primary },
                !newPlayerInput.trim() && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleAddPlayer}
              disabled={!newPlayerInput.trim()}
            >
              <Ionicons name="add" size={28} color={colors.buttonText} />
            </Pressable>
          </View>

          {/* Player Chips Grid */}
          <View style={styles.chipsGrid}>
            {players.map((name, idx) => (
              <View
                key={idx}
                style={[
                  styles.playerChip,
                  {
                    backgroundColor: colors.surfaceCard,
                    borderColor: colors.surfaceBorder,
                  },
                ]}
              >
                <View
                  style={[
                    styles.playerChipNumber,
                    { backgroundColor: colors.surfaceElevated },
                  ]}
                >
                  <Text style={[styles.playerChipNumberText, { color: colors.textSecondary }]}>
                    {idx + 1}
                  </Text>
                </View>
                <Text style={[styles.playerChipName, { color: colors.text }]} numberOfLines={1}>
                  {name}
                </Text>
                <Pressable
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  style={styles.removeChipButton}
                  onPress={() => handleRemovePlayer(idx)}
                >
                  <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* Configuration Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            MATCH CONFIGURATION
          </Text>

          {/* Total Points per Match */}
          <View
            style={[
              styles.configCard,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <View style={styles.configHeader}>
              <Text style={[styles.configTitle, { color: colors.text }]}>Match Points Target</Text>
              <Text style={[styles.configDesc, { color: colors.textMuted }]}>
                Complementary points divided between both teams
              </Text>
            </View>

            <View style={styles.pointsSelectorRow}>
              {[16, 24, 32].map((pts) => {
                const isSelected = totalPoints === pts;
                return (
                  <Pressable
                    key={pts}
                    style={({ pressed }) => [
                      styles.pointsOption,
                      {
                        backgroundColor: isSelected ? colors.primarySurface : colors.surfaceElevated,
                        borderColor: isSelected ? colors.primary : colors.surfaceBorderHighlight,
                      },
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() => {
                      triggerHaptic('light');
                      setTotalPoints(pts);
                    }}
                  >
                    <Text
                      style={[
                        styles.pointsOptionText,
                        { color: isSelected ? colors.primary : colors.textSecondary },
                      ]}
                    >
                      {pts} PTS
                    </Text>
                    {pts === 32 && (
                      <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.defaultBadgeText, { color: colors.buttonText }]}>
                          DEFAULT
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Court Count */}
          <View
            style={[
              styles.configCard,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <View style={styles.configHeader}>
              <Text style={[styles.configTitle, { color: colors.text }]}>Courts Available</Text>
              <Text style={[styles.configDesc, { color: colors.textMuted }]}>
                {courtCount === 2 ? '2 Simultaneous Matches' : '1 Main Court'}
              </Text>
            </View>

            <View style={styles.courtToggleRow}>
              {[
                { count: 1, label: '1 Court' },
                { count: 2, label: '2 Courts' },
              ].map((c) => {
                const isSelected = courtCount === c.count;
                return (
                  <Pressable
                    key={c.count}
                    style={({ pressed }) => [
                      styles.courtOption,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceElevated,
                        borderColor: isSelected ? colors.primaryLight : colors.surfaceBorderHighlight,
                      },
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() => {
                      triggerHaptic('light');
                      setCourtCount(c.count);
                    }}
                  >
                    <Ionicons
                      name="tennisball"
                      size={18}
                      color={isSelected ? colors.buttonText : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.courtOptionText,
                        { color: isSelected ? colors.buttonText : colors.textSecondary },
                      ]}
                    >
                      {c.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Generate Tournament Action Button */}
        <View style={styles.generateContainer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Generate Tournament"
            style={({ pressed }) => [
              styles.generateButton,
              { backgroundColor: colors.primary },
              !canGenerate && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleGenerateTournament}
            disabled={!canGenerate}
          >
            <MaterialCommunityIcons
              name="trophy-variant"
              size={24}
              color={colors.buttonText}
            />
            <Text style={[styles.generateButtonText, { color: colors.buttonText }]}>
              Generate Tournament
            </Text>
          </Pressable>

          {!canGenerate && (
            <Text style={[styles.validationNotice, { color: colors.warning }]}>
              ⚠️ Need at least 4 players to generate Americano schedule
            </Text>
          )}
        </View>

        {/* AdMob Banner */}
        <AdBanner style={{ marginTop: 16, borderRadius: 14, overflow: 'hidden' }} />
      </ScrollView>

      {/* Modals */}
      <FavoritesModal
        visible={showFavorites}
        favorites={favoritePlayers}
        selectedNames={players}
        onTogglePlayer={handleToggleFavoriteName}
        onAddFavorite={addFavoritePlayer}
        onRemoveFavorite={removeFavoritePlayer}
        onClose={() => setShowFavorites(false)}
      />

      <TournamentHistoryModal
        visible={showHistory}
        tournaments={savedTournaments}
        onSelectTournament={loadSavedTournament}
        onDeleteTournament={deleteSavedTournament}
        onClose={() => setShowHistory(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  appBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
  },
  appBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  screenHeading: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  topButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  iconHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickFillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickFillButtonText: {
    fontSize: 12,
    fontWeight: '800',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  presetPill: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 74,
  },
  presetPillTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  presetPillDesc: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    paddingHorizontal: 18,
    fontSize: 16,
    borderWidth: 1.5,
  },
  addPlayerBtn: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  playerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 8,
  },
  playerChipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerChipNumberText: {
    fontSize: 11,
    fontWeight: '800',
  },
  playerChipName: {
    fontSize: 14,
    fontWeight: '700',
    maxWidth: 130,
  },
  removeChipButton: {
    padding: 2,
  },
  configCard: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  configHeader: {
    marginBottom: 14,
  },
  configTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  configDesc: {
    fontSize: 12,
  },
  pointsSelectorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pointsOption: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  pointsOptionText: {
    fontSize: 15,
    fontWeight: '800',
  },
  defaultBadge: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
    marginTop: 2,
  },
  defaultBadgeText: {
    fontSize: 8,
    fontWeight: '900',
  },
  courtToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  courtOption: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  courtOptionText: {
    fontSize: 14,
    fontWeight: '800',
  },
  generateContainer: {
    marginTop: 12,
    gap: 10,
    marginBottom: 20,
  },
  generateButton: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 22,
  },
  generateButtonText: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  validationNotice: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
