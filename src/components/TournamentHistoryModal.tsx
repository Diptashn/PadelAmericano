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
import { Tournament } from '../types';
import { useTheme, SHADOWS } from '../constants/theme';
import { triggerHaptic } from '../utils/haptics';

interface TournamentHistoryModalProps {
  visible: boolean;
  tournaments: Tournament[];
  onSelectTournament: (id: string) => void;
  onDeleteTournament: (id: string) => void;
  onClose: () => void;
}

export const TournamentHistoryModal: React.FC<TournamentHistoryModalProps> = ({
  visible,
  tournaments,
  onSelectTournament,
  onDeleteTournament,
  onClose,
}) => {
  const { colors } = useTheme();

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
            {/* Header */}
            <View
              style={[
                styles.header,
                { borderBottomColor: colors.surfaceBorder },
              ]}
            >
              <View>
                <Text style={[styles.title, { color: colors.text }]}>Tournament History</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Past sessions & saved results
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close tournament history"
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

            {/* List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
            >
              {tournaments.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="calendar-outline" size={38} color={colors.textMuted} />
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>
                    No Tournaments Saved
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                    Finish a tournament to have its final standings and match records stored here.
                  </Text>
                </View>
              ) : (
                tournaments.map((t) => {
                  const dateStr = new Date(t.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <View
                      key={t.id}
                      style={[
                        styles.card,
                        {
                          backgroundColor: colors.surfaceCard,
                          borderColor: colors.surfaceBorder,
                        },
                      ]}
                    >
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Tournament from ${dateStr}`}
                        style={({ pressed }) => [
                          styles.cardClickable,
                          pressed && styles.buttonPressed,
                        ]}
                        onPress={() => {
                          triggerHaptic('light');
                          onSelectTournament(t.id);
                          onClose();
                        }}
                      >
                        <View style={styles.cardHeader}>
                          <Text style={[styles.cardDate, { color: colors.textMuted }]}>
                            {dateStr}
                          </Text>
                          <View
                            style={[
                              styles.statusBadge,
                              t.isCompleted
                                ? {
                                    backgroundColor: colors.primarySurface,
                                    borderColor: colors.primary,
                                  }
                                : {
                                    backgroundColor: colors.accentOrangeSurface,
                                    borderColor: colors.accentOrange,
                                  },
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusBadgeText,
                                t.isCompleted
                                  ? { color: colors.primary }
                                  : { color: colors.accentOrange },
                              ]}
                            >
                              {t.isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
                            </Text>
                          </View>
                        </View>

                        <Text style={[styles.cardTitle, { color: colors.text }]}>
                          {t.players.length} Players · {t.rounds.length} Rounds · {t.config.totalPoints} Pts
                        </Text>

                        <Text style={[styles.playerChips, { color: colors.textSecondary }]} numberOfLines={1}>
                          {t.players.map((p) => p.name).join(', ')}
                        </Text>
                      </Pressable>

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Delete tournament ${dateStr}`}
                        style={({ pressed }) => [
                          styles.deleteButton,
                          { backgroundColor: colors.surfaceElevated },
                          pressed && styles.buttonPressed,
                        ]}
                        onPress={() => {
                          triggerHaptic('warning');
                          onDeleteTournament(t.id);
                        }}
                      >
                        <Ionicons name="trash-outline" size={18} color={colors.danger} />
                      </Pressable>
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
    ...SHADOWS.modal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
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
  list: {
    paddingVertical: 12,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  cardClickable: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  playerChips: {
    fontSize: 12,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 260,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
