import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export const triggerHaptic = async (
  type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light'
) => {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
        if (type === 'light') navigator.vibrate(10);
        else if (type === 'medium') navigator.vibrate(25);
        else if (type === 'heavy') navigator.vibrate(45);
        else if (type === 'success') navigator.vibrate([20, 40, 30]);
        else if (type === 'warning') navigator.vibrate([30, 50, 40]);
      }
      return;
    }

    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
    }
  } catch {
    // Ignore haptic failures gracefully if device doesn't support them
  }
};
