import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Resilient in-memory fallback store to ensure zero unhandled promise rejections
 * if the native AsyncStorage module is unavailable (e.g. before native rebuild,
 * in Expo Go, on web, or during development).
 */
const memoryStore = new Map<string, string>();

const safeAsyncStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await AsyncStorage.getItem(name);
      if (value !== null && value !== undefined) {
        memoryStore.set(name, value);
        return value;
      }
      return memoryStore.get(name) ?? null;
    } catch {
      return memoryStore.get(name) ?? null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    memoryStore.set(name, value);
    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      // Intentionally caught so native null errors never produce unhandled promise rejection popups
    }
  },
  removeItem: async (name: string): Promise<void> => {
    memoryStore.delete(name);
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      // Intentionally caught
    }
  },
};
import {
  Tournament,
  TournamentConfig,
  SavedPlayer,
  PlayerStanding,
} from '../types';
import { buildTournament, calculateStandings } from '../utils/tournamentEngine';

interface TournamentState {
  activeTournament: Tournament | null;
  savedTournaments: Tournament[];
  favoritePlayers: SavedPlayer[];
  activeTab: 'setup' | 'match' | 'standings';

  // Navigation
  setActiveTab: (tab: 'setup' | 'match' | 'standings') => void;

  // Theme
  themeMode: 'dark' | 'light';
  toggleTheme: () => void;
  setThemeMode: (mode: 'dark' | 'light') => void;

  // Tournament lifecycle
  startTournament: (playerNames: string[], config: TournamentConfig) => void;
  updateMatchScore: (
    roundIndex: number,
    courtIndex: number,
    teamAScore: number
  ) => void;
  nextRound: () => void;
  prevRound: () => void;
  goToRound: (roundIndex: number) => void;
  finishTournament: () => void;
  resetTournament: () => void;
  loadSavedTournament: (tournamentId: string) => void;
  deleteSavedTournament: (tournamentId: string) => void;

  // Favorites
  addFavoritePlayer: (name: string) => void;
  removeFavoritePlayer: (id: string) => void;

  // Computed helper
  getStandings: () => PlayerStanding[];
}

const DEFAULT_FAVORITES: SavedPlayer[] = [
  { id: 'fav-1', name: 'Ale Galan', timesPlayed: 12, lastPlayed: new Date().toISOString() },
  { id: 'fav-2', name: 'Juan Lebron', timesPlayed: 11, lastPlayed: new Date().toISOString() },
  { id: 'fav-3', name: 'Agustin Tapia', timesPlayed: 15, lastPlayed: new Date().toISOString() },
  { id: 'fav-4', name: 'Arturo Coello', timesPlayed: 14, lastPlayed: new Date().toISOString() },
  { id: 'fav-5', name: 'Paquito Navarro', timesPlayed: 9, lastPlayed: new Date().toISOString() },
  { id: 'fav-6', name: 'Fede Chingotto', timesPlayed: 10, lastPlayed: new Date().toISOString() },
  { id: 'fav-7', name: 'Martin Di Nenno', timesPlayed: 8, lastPlayed: new Date().toISOString() },
  { id: 'fav-8', name: 'Franco Stupaczuk', timesPlayed: 7, lastPlayed: new Date().toISOString() },
];

export const useTournamentStore = create<TournamentState>()(
  persist(
    (set, get) => ({
      activeTournament: null,
      savedTournaments: [],
      favoritePlayers: DEFAULT_FAVORITES,
      activeTab: 'setup',
      themeMode: 'dark',

      setActiveTab: (tab) => set({ activeTab: tab }),

      toggleTheme: () =>
        set((state) => ({
          themeMode: state.themeMode === 'dark' ? 'light' : 'dark',
        })),

      setThemeMode: (mode) => set({ themeMode: mode }),

      startTournament: (playerNames, config) => {
        const tournament = buildTournament(playerNames, config);

        // Update favorite players usage
        const existingFavorites = [...get().favoritePlayers];
        playerNames.forEach((name) => {
          const trimmed = name.trim();
          if (!trimmed) return;
          const foundIdx = existingFavorites.findIndex(
            (f) => f.name.toLowerCase() === trimmed.toLowerCase()
          );
          if (foundIdx >= 0) {
            existingFavorites[foundIdx] = {
              ...existingFavorites[foundIdx],
              timesPlayed: existingFavorites[foundIdx].timesPlayed + 1,
              lastPlayed: new Date().toISOString(),
            };
          } else {
            existingFavorites.push({
              id: `fav-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
              name: trimmed,
              timesPlayed: 1,
              lastPlayed: new Date().toISOString(),
            });
          }
        });

        set({
          activeTournament: tournament,
          favoritePlayers: existingFavorites,
          activeTab: 'match',
        });
      },

      updateMatchScore: (roundIndex, courtIndex, teamAScore) => {
        const current = get().activeTournament;
        if (!current) return;

        const maxPoints = current.config.totalPoints;
        const clampedA = Math.max(0, Math.min(maxPoints, teamAScore));
        const clampedB = maxPoints - clampedA;

        const updatedRounds = current.rounds.map((round, rIdx) => {
          if (rIdx !== roundIndex) return round;

          const updatedMatches = round.matches.map((match, mIdx) => {
            if (mIdx !== courtIndex) return match;

            return {
              ...match,
              teamA: {
                ...match.teamA,
                score: clampedA,
              },
              teamB: {
                ...match.teamB,
                score: clampedB,
              },
              isCompleted: true,
            };
          });

          return {
            ...round,
            matches: updatedMatches,
          };
        });

        set({
          activeTournament: {
            ...current,
            rounds: updatedRounds,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      nextRound: () => {
        const current = get().activeTournament;
        if (!current) return;

        const currentIdx = current.currentRoundIndex;
        // Mark current round as completed
        const updatedRounds = current.rounds.map((r, idx) => {
          if (idx === currentIdx) {
            return {
              ...r,
              isCompleted: true,
              matches: r.matches.map((m) => ({ ...m, isCompleted: true })),
            };
          }
          return r;
        });

        if (currentIdx < current.rounds.length - 1) {
          set({
            activeTournament: {
              ...current,
              rounds: updatedRounds,
              currentRoundIndex: currentIdx + 1,
              updatedAt: new Date().toISOString(),
            },
          });
        } else {
          // Finished all rounds!
          const finishedTournament: Tournament = {
            ...current,
            rounds: updatedRounds,
            isCompleted: true,
            updatedAt: new Date().toISOString(),
          };

          const saved = [...get().savedTournaments];
          const existIdx = saved.findIndex((t) => t.id === current.id);
          if (existIdx >= 0) {
            saved[existIdx] = finishedTournament;
          } else {
            saved.unshift(finishedTournament);
          }

          set({
            activeTournament: finishedTournament,
            savedTournaments: saved,
            activeTab: 'standings',
          });
        }
      },

      prevRound: () => {
        const current = get().activeTournament;
        if (!current) return;
        if (current.currentRoundIndex > 0) {
          set({
            activeTournament: {
              ...current,
              currentRoundIndex: current.currentRoundIndex - 1,
            },
          });
        }
      },

      goToRound: (roundIndex) => {
        const current = get().activeTournament;
        if (!current) return;
        if (roundIndex >= 0 && roundIndex < current.rounds.length) {
          set({
            activeTournament: {
              ...current,
              currentRoundIndex: roundIndex,
            },
          });
        }
      },

      finishTournament: () => {
        const current = get().activeTournament;
        if (!current) return;

        const updatedRounds = current.rounds.map((r) => ({
          ...r,
          isCompleted: true,
          matches: r.matches.map((m) => ({ ...m, isCompleted: true })),
        }));

        const finishedTournament: Tournament = {
          ...current,
          rounds: updatedRounds,
          isCompleted: true,
          updatedAt: new Date().toISOString(),
        };

        const saved = [...get().savedTournaments];
        const existIdx = saved.findIndex((t) => t.id === current.id);
        if (existIdx >= 0) {
          saved[existIdx] = finishedTournament;
        } else {
          saved.unshift(finishedTournament);
        }

        set({
          activeTournament: finishedTournament,
          savedTournaments: saved,
          activeTab: 'standings',
        });
      },

      resetTournament: () => {
        set({
          activeTournament: null,
          activeTab: 'setup',
        });
      },

      loadSavedTournament: (tournamentId) => {
        const target = get().savedTournaments.find((t) => t.id === tournamentId);
        if (target) {
          set({
            activeTournament: target,
            activeTab: target.isCompleted ? 'standings' : 'match',
          });
        }
      },

      deleteSavedTournament: (tournamentId) => {
        const filtered = get().savedTournaments.filter((t) => t.id !== tournamentId);
        set({ savedTournaments: filtered });
      },

      addFavoritePlayer: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const favorites = [...get().favoritePlayers];
        if (!favorites.some((f) => f.name.toLowerCase() === trimmed.toLowerCase())) {
          favorites.push({
            id: `fav-${Date.now().toString(36)}`,
            name: trimmed,
            timesPlayed: 0,
            lastPlayed: new Date().toISOString(),
          });
          set({ favoritePlayers: favorites });
        }
      },

      removeFavoritePlayer: (id) => {
        set({
          favoritePlayers: get().favoritePlayers.filter((f) => f.id !== id),
        });
      },

      getStandings: () => {
        const current = get().activeTournament;
        if (!current) return [];
        return calculateStandings(current);
      },
    }),
    {
      name: 'padel-americano-storage-v1',
      storage: createJSONStorage(() => safeAsyncStorage),
      partialize: (state) => ({
        activeTournament: state.activeTournament,
        savedTournaments: state.savedTournaments,
        favoritePlayers: state.favoritePlayers,
        themeMode: state.themeMode,
      }),
    }
  )
);
