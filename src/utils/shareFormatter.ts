import { Share, Linking, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Tournament, PlayerStanding } from '../types';

export function formatDiff(diff: number): string {
  if (diff > 0) return `+${diff}`;
  if (diff === 0) return '0';
  return `${diff}`;
}

export function generateWhatsAppText(
  tournament: Tournament,
  standings: PlayerStanding[]
): string {
  const dateStr = new Date(tournament.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const playerCount = tournament.players.length;
  const roundCount = tournament.rounds.length;

  const podium = standings.slice(0, 3);
  const remaining = standings.slice(3);

  const podiumMedals = ['🥇', '🥈', '🥉'];

  let message = `🎾 Padel Americano - Final Standings\n`;
  message += `📅 ${dateStr} | 📍 ${playerCount} Players, ${roundCount} Rounds\n\n`;

  message += `🏆 PODIUM:\n`;
  podium.forEach((s, idx) => {
    const medal = podiumMedals[idx] || `${idx + 1}.`;
    const diffText = formatDiff(s.pointDifferential);
    message += `${medal} ${s.rank}. ${s.player.name} - ${s.pointsWon} pts (${diffText})\n`;
  });

  if (remaining.length > 0) {
    message += `\n📋 COMPLETE RANKINGS:\n`;
    remaining.forEach((s) => {
      const diffText = formatDiff(s.pointDifferential);
      message += `${s.rank}. ${s.player.name} - ${s.pointsWon} pts (${diffText})\n`;
    });
  }

  message += `\n⚡ Generated with Padel Americano`;

  return message;
}

export async function shareTournamentSummary(
  tournament: Tournament,
  standings: PlayerStanding[]
): Promise<boolean> {
  const text = generateWhatsAppText(tournament, standings);

  try {
    const result = await Share.share({
      title: 'Padel Americano Standings',
      message: text,
    });

    if (result.action === Share.sharedAction) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Share error:', error);
    // Fallback: copy to clipboard
    await copyToClipboard(text);
    return false;
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await Clipboard.setStringAsync(text);
    return true;
  } catch (error) {
    console.error('Clipboard error:', error);
    return false;
  }
}

export async function openDirectWhatsApp(text: string): Promise<void> {
  const encoded = encodeURIComponent(text);
  const appUrl = `whatsapp://send?text=${encoded}`;
  const webUrl = `https://api.whatsapp.com/send?text=${encoded}`;

  try {
    if (Platform.OS !== 'web') {
      const canOpen = await Linking.canOpenURL(appUrl);
      if (canOpen) {
        await Linking.openURL(appUrl);
        return;
      }
    }
    await Linking.openURL(webUrl);
  } catch {
    await Linking.openURL(webUrl);
  }
}
