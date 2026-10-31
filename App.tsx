import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTournamentStore } from './src/store/tournamentStore';
import { SetupScreen } from './src/screens/SetupScreen';
import { MatchScreen } from './src/screens/MatchScreen';
import { StandingsScreen } from './src/screens/StandingsScreen';
import { useTheme } from './src/constants/theme';
import { triggerHaptic } from './src/utils/haptics';

function MainAppContent() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { activeTab, setActiveTab, activeTournament } = useTournamentStore();

  const handleTabPress = (tab: 'setup' | 'match' | 'standings') => {
    triggerHaptic('light');
    setActiveTab(tab);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'setup':
        return <SetupScreen />;
      case 'match':
        return <MatchScreen />;
      case 'standings':
        return <StandingsScreen />;
      default:
        return <SetupScreen />;
    }
  };

  const currentRoundIndex = activeTournament?.currentRoundIndex ?? 0;
  const totalRounds = activeTournament?.rounds.length ?? 0;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Main Screen Content */}
      <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
        {renderActiveScreen()}
      </View>

      {/* Ergonomic Athletic Bottom Navigation Bar */}
      <View
        style={[
          styles.bottomTabBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.surfaceBorder,
            paddingBottom: Math.max(insets.bottom, 14),
          },
        ]}
      >
        {/* Tab 1: Setup / Roster */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Setup screen"
          style={({ pressed }) => [
            styles.tabItem,
            activeTab === 'setup' && styles.tabItemActive,
            pressed && styles.tabItemPressed,
          ]}
          onPress={() => handleTabPress('setup')}
        >
          <View
            style={[
              styles.tabIconBox,
              activeTab === 'setup' && { backgroundColor: colors.primarySurface },
            ]}
          >
            <Ionicons
              name={activeTab === 'setup' ? 'people' : 'people-outline'}
              size={24}
              color={activeTab === 'setup' ? colors.primary : colors.textMuted}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'setup' ? colors.primary : colors.textMuted },
            ]}
          >
            Setup
          </Text>
        </Pressable>

        {/* Tab 2: Live Match */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Live match screen"
          style={({ pressed }) => [
            styles.tabItem,
            activeTab === 'match' && styles.tabItemActive,
            pressed && styles.tabItemPressed,
          ]}
          onPress={() => handleTabPress('match')}
        >
          <View
            style={[
              styles.tabIconBox,
              activeTab === 'match' && { backgroundColor: colors.primarySurface },
            ]}
          >
            <MaterialCommunityIcons
              name="tennis"
              size={24}
              color={activeTab === 'match' ? colors.primary : colors.textMuted}
            />
            {activeTournament && !activeTournament.isCompleted && (
              <View style={[styles.badgePill, { backgroundColor: colors.primary, borderColor: colors.surface }]}>
                <Text style={[styles.badgePillText, { color: colors.buttonText }]}>
                  R{currentRoundIndex + 1}/{totalRounds}
                </Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'match' ? colors.primary : colors.textMuted },
            ]}
          >
            Match
          </Text>
        </Pressable>

        {/* Tab 3: Standings */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Standings leaderboard screen"
          style={({ pressed }) => [
            styles.tabItem,
            activeTab === 'standings' && styles.tabItemActive,
            pressed && styles.tabItemPressed,
          ]}
          onPress={() => handleTabPress('standings')}
        >
          <View
            style={[
              styles.tabIconBox,
              activeTab === 'standings' && { backgroundColor: colors.primarySurface },
            ]}
          >
            <Ionicons
              name={activeTab === 'standings' ? 'podium' : 'podium-outline'}
              size={24}
              color={activeTab === 'standings' ? colors.primary : colors.textMuted}
            />
            {activeTournament?.isCompleted && (
              <View style={[styles.badgePill, styles.badgePillGold, { borderColor: colors.surface }]}>
                <Text style={styles.badgePillGoldText}>🏆</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'standings' ? colors.primary : colors.textMuted },
            ]}
          >
            Standings
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainAppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  bottomTabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1.5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minHeight: 52,
  },
  tabItemActive: {},
  tabIconBox: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
    letterSpacing: 0.3,
  },
  badgePill: {
    position: 'absolute',
    top: -4,
    right: -10,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgePillGold: {
    backgroundColor: '#F59E0B',
    right: -6,
  },
  badgePillText: {
    fontSize: 9,
    fontWeight: '900',
  },
  badgePillGoldText: {
    fontSize: 9,
  },
  tabItemPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },
});
