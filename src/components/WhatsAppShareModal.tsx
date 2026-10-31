import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Tournament, PlayerStanding } from '../types';
import { useTheme, SHADOWS } from '../constants/theme';
import {
  generateWhatsAppText,
  shareTournamentSummary,
  copyToClipboard,
  openDirectWhatsApp,
} from '../utils/shareFormatter';
import { triggerHaptic } from '../utils/haptics';

interface WhatsAppShareModalProps {
  visible: boolean;
  tournament: Tournament | null;
  standings: PlayerStanding[];
  onClose: () => void;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  visible,
  tournament,
  standings,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const { colors, isDark } = useTheme();

  if (!tournament) return null;

  const formattedText = generateWhatsAppText(tournament, standings);

  const handleShare = async () => {
    triggerHaptic('medium');
    await shareTournamentSummary(tournament, standings);
  };

  const handleCopy = async () => {
    triggerHaptic('success');
    const success = await copyToClipboard(formattedText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDirectWhatsApp = async () => {
    triggerHaptic('medium');
    await openDirectWhatsApp(formattedText);
  };

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
              <View style={styles.headerTitleRow}>
                <View style={styles.whatsappIconCircle}>
                  <FontAwesome name="whatsapp" size={24} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={[styles.title, { color: colors.text }]}>Share to WhatsApp</Text>
                  <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Viral leaderboard summary
                  </Text>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close share modal"
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

            {/* Preview Box */}
            <Text style={[styles.previewLabel, { color: colors.textMuted }]}>
              PREVIEW MESSAGE
            </Text>
            <View
              style={[
                styles.previewContainer,
                {
                  backgroundColor: isDark ? '#0F161E' : '#F8FAFC',
                  borderColor: colors.surfaceBorder,
                },
              ]}
            >
              <ScrollView showsVerticalScrollIndicator={false} style={styles.previewScroll}>
                <Text
                  style={[
                    styles.previewText,
                    { color: isDark ? '#D1D5DB' : '#334155' },
                  ]}
                >
                  {formattedText}
                </Text>
              </ScrollView>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              {/* Primary: Share via WhatsApp */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Send directly to WhatsApp"
                style={({ pressed }) => [styles.primaryShareButton, pressed && styles.buttonPressed]}
                onPress={handleDirectWhatsApp}
              >
                <FontAwesome name="whatsapp" size={20} color="#FFFFFF" />
                <Text style={styles.primaryShareButtonText}>Send Directly to WhatsApp</Text>
              </Pressable>

              <View style={styles.secondaryRow}>
                {/* Standard Native Share */}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="More share options"
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.surfaceBorderHighlight,
                    },
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={handleShare}
                >
                  <Ionicons name="share-social-outline" size={18} color={colors.text} />
                  <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                    More Options
                  </Text>
                </Pressable>

                {/* Copy Text */}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Copy tournament summary text"
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.surfaceBorderHighlight,
                    },
                    copied && {
                      borderColor: colors.primary,
                      backgroundColor: colors.primarySurface,
                    },
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={handleCopy}
                >
                  <Ionicons
                    name={copied ? 'checkmark-circle' : 'copy-outline'}
                    size={18}
                    color={copied ? colors.primary : colors.text}
                  />
                  <Text
                    style={[
                      styles.secondaryButtonText,
                      { color: colors.text },
                      copied && { color: colors.primary },
                    ]}
                  >
                    {copied ? 'Copied!' : 'Copy Text'}
                  </Text>
                </Pressable>
              </View>
            </View>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  whatsappIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.primaryGlow,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 16,
    marginBottom: 8,
  },
  previewContainer: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    maxHeight: 220,
  },
  previewScroll: {
    maxHeight: 190,
  },
  previewText: {
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 20,
  },
  actionsContainer: {
    marginTop: 20,
    gap: 10,
    paddingBottom: 10,
  },
  primaryShareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25D366',
    paddingVertical: 14,
    borderRadius: 16,
    ...SHADOWS.card,
  },
  primaryShareButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});
