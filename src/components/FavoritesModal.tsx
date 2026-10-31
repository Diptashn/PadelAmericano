import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavedPlayer } from '../types';
import { useTheme, SHADOWS } from '../constants/theme';
import { triggerHaptic } from '../utils/haptics';

interface FavoritesModalProps {
  visible: boolean;
  favorites: SavedPlayer[];
  selectedNames: string[];
  onTogglePlayer: (name: string) => void;
  onAddFavorite: (name: string) => void;
  onRemoveFavorite: (id: string) => void;
  onClose: () => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  visible,
  favorites,
  selectedNames,
  onTogglePlayer,
  onAddFavorite,
  onRemoveFavorite,
  onClose,
}) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { colors } = useTheme();

  const handleAddNew = () => {
    const trimmed = newPlayerName.trim();
    if (trimmed) {
      triggerHaptic('medium');
      onAddFavorite(trimmed);
      setNewPlayerName('');
    }
  };

  const filteredFavorites = favorites.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <Text style={[styles.title, { color: colors.text }]}>Saved Players</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Select friends to quick-fill your tournament
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close saved players"
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

            {/* Quick Add New Player Row */}
            <View style={styles.addInputRow}>
              <TextInput
                style={[
                  styles.addInput,
                  {
                    backgroundColor: colors.surfaceCard,
                    borderColor: colors.surfaceBorder,
                    color: colors.text,
                  },
                ]}
                placeholder="Add new friend name..."
                placeholderTextColor={colors.textMuted}
                value={newPlayerName}
                onChangeText={setNewPlayerName}
                onSubmitEditing={handleAddNew}
                returnKeyType="done"
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add friend"
                style={({ pressed }) => [
                  styles.addPlayerButton,
                  { backgroundColor: colors.primary },
                  !newPlayerName.trim() && styles.buttonDisabled,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleAddNew}
                disabled={!newPlayerName.trim()}
              >
                <Ionicons name="add" size={22} color={colors.buttonText} />
              </Pressable>
            </View>

            {/* Search Filter */}
            {favorites.length > 5 && (
              <View
                style={[
                  styles.searchRow,
                  {
                    backgroundColor: colors.surfaceCard,
                    borderColor: colors.surfaceBorder,
                  },
                ]}
              >
                <Ionicons name="search" size={16} color={colors.textMuted} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder="Filter friends..."
                  placeholderTextColor={colors.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            )}

            {/* Favorites List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.favoritesList}
            >
              {filteredFavorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="people-outline" size={36} color={colors.textMuted} />
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    No saved players found
                  </Text>
                </View>
              ) : (
                filteredFavorites.map((fav) => {
                  const isSelected = selectedNames.some(
                    (n) => n.toLowerCase() === fav.name.toLowerCase()
                  );

                  return (
                    <View key={fav.id} style={styles.favoriteRow}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Select ${fav.name}`}
                        style={({ pressed }) => [
                          styles.playerSelectable,
                          {
                            backgroundColor: colors.surfaceCard,
                            borderColor: colors.surfaceBorder,
                          },
                          isSelected && {
                            borderColor: colors.primary,
                            backgroundColor: colors.primarySurface,
                          },
                          pressed && styles.buttonPressed,
                        ]}
                        onPress={() => {
                          triggerHaptic('light');
                          onTogglePlayer(fav.name);
                        }}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            { borderColor: colors.textMuted },
                            isSelected && {
                              backgroundColor: colors.primary,
                              borderColor: colors.primary,
                            },
                          ]}
                        >
                          {isSelected && (
                            <Ionicons name="checkmark" size={14} color={colors.buttonText} />
                          )}
                        </View>

                        <View style={styles.playerMeta}>
                          <Text style={[styles.playerName, { color: colors.text }]}>
                            {fav.name}
                          </Text>
                          <Text style={[styles.playerStats, { color: colors.textMuted }]}>
                            {fav.timesPlayed} tournaments played
                          </Text>
                        </View>
                      </Pressable>

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${fav.name}`}
                        style={({ pressed }) => [
                          styles.deleteButton,
                          { backgroundColor: colors.surfaceCard },
                          pressed && styles.buttonPressed,
                        ]}
                        onPress={() => {
                          triggerHaptic('warning');
                          onRemoveFavorite(fav.id);
                        }}
                      >
                        <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
                      </Pressable>
                    </View>
                  );
                })
              )}
            </ScrollView>

            {/* Footer Action */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Confirm player selection"
              style={({ pressed }) => [
                styles.doneButton,
                { backgroundColor: colors.primary },
                pressed && styles.buttonPressed,
              ]}
              onPress={onClose}
            >
              <Text style={[styles.doneButtonText, { color: colors.buttonText }]}>
                Done ({selectedNames.length} Selected)
              </Text>
            </Pressable>
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
    maxHeight: '90%',
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
  addInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    marginBottom: 10,
  },
  addInput: {
    flex: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
  },
  addPlayerButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  favoritesList: {
    maxHeight: 280,
    gap: 8,
    paddingVertical: 4,
  },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerSelectable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerMeta: {
    flex: 1,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '700',
  },
  playerStats: {
    fontSize: 11,
    marginTop: 1,
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
    paddingVertical: 24,
    gap: 6,
  },
  emptyText: {
    fontSize: 13,
  },
  doneButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    ...SHADOWS.card,
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
