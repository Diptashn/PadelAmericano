import { Platform } from 'react-native';

/**
 * Google AdMob Ad Unit Configuration
 *
 * These are the official Google-provided TEST ad unit IDs.
 * Replace them with your own production IDs before publishing to the stores.
 *
 * @see https://developers.google.com/admob/android/test-ads
 * @see https://developers.google.com/admob/ios/test-ads
 */

export const AD_UNIT_IDS = {
  /** Adaptive / Anchored Banner Ad */
  BANNER: Platform.select({
    android: 'ca-app-pub-3940256099942544/9214589741',
    ios: 'ca-app-pub-3940256099942544/2435281174',
    default: 'ca-app-pub-3940256099942544/9214589741',
  }),

  /** Full-screen Interstitial Ad (shown between natural transition points) */
  INTERSTITIAL: Platform.select({
    android: 'ca-app-pub-3940256099942544/1033173712',
    ios: 'ca-app-pub-3940256099942544/4411468910',
    default: 'ca-app-pub-3940256099942544/1033173712',
  }),
} as const;

/**
 * App-level AdMob App IDs (configured in app.json plugin, listed here for reference)
 * Android: ca-app-pub-3940256099942544~3347511713
 * iOS:     ca-app-pub-3940256099942544~1458602512
 */
