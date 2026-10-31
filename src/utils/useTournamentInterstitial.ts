import { useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import { AD_UNIT_IDS } from '../constants/AdConfig';

/**
 * Check if running in Expo Go or Web where native AdMob modules cannot be loaded.
 */
let isExpoGo = false;
try {
  const Constants = require('expo-constants').default;
  const { ExecutionEnvironment } = require('expo-constants');
  isExpoGo = Constants?.executionEnvironment === ExecutionEnvironment?.StoreClient;
} catch {
  // Graceful fallback
}

let InterstitialAd: any = null;
let AdEventType: any = null;
let isNativeAvailable = false;

try {
  if (!isExpoGo && Platform.OS !== 'web') {
    const mobileAds = require('react-native-google-mobile-ads');
    InterstitialAd = mobileAds.InterstitialAd;
    AdEventType = mobileAds.AdEventType;
    isNativeAvailable = true;
  }
} catch {
  // Native module not available – dev/Expo Go mode
}

/**
 * Custom hook to manage an interstitial ad that is pre-loaded during gameplay.
 *
 * Usage:
 * ```tsx
 * const { showInterstitialAndProceed } = useTournamentInterstitial();
 *
 * // When the user finishes the tournament:
 * showInterstitialAndProceed(() => {
 *   nextRound();
 * });
 * ```
 *
 * Behavior:
 * - Pre-loads an interstitial ad in the background when the hook mounts.
 * - `showInterstitialAndProceed(onComplete)`:
 *   - If the ad is loaded → shows it, then calls `onComplete` when closed.
 *   - If the ad failed to load / isn't available → calls `onComplete` immediately.
 * - Automatically re-loads a new ad after each show for future use.
 */
export function useTournamentInterstitial() {
  const adRef = useRef<any>(null);
  const isLoadedRef = useRef(false);
  const onCompleteRef = useRef<(() => void) | null>(null);

  // Create and load the ad instance
  const loadAd = useCallback(() => {
    if (!isNativeAvailable || !InterstitialAd || !AdEventType) return;

    try {
      const interstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: true,
      });

      // Listen for ad loaded
      interstitial.addAdEventListener(AdEventType.LOADED, () => {
        isLoadedRef.current = true;
      });

      // Listen for ad closed → run pending callback + reload next ad
      interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        isLoadedRef.current = false;

        // Execute the pending callback
        if (onCompleteRef.current) {
          onCompleteRef.current();
          onCompleteRef.current = null;
        }

        // Pre-load the next ad for future use
        loadAd();
      });

      // Listen for errors
      interstitial.addAdEventListener(AdEventType.ERROR, (error: any) => {
        console.warn('[Interstitial] Ad error:', error?.message);
        isLoadedRef.current = false;
      });

      // Start loading
      interstitial.load();
      adRef.current = interstitial;
    } catch (err) {
      console.warn('[Interstitial] Failed to create ad request:', err);
    }
  }, []);

  // Pre-load on mount
  useEffect(() => {
    loadAd();

    return () => {
      // Cleanup: remove listeners on unmount
      if (adRef.current) {
        try {
          adRef.current.removeAllListeners?.();
        } catch {
          // Swallow cleanup errors
        }
      }
    };
  }, [loadAd]);

  /**
   * Show the pre-loaded interstitial, then execute `onComplete`.
   * If the ad isn't ready (failed to load, Expo Go, offline, etc.),
   * `onComplete` runs immediately so gameplay is never blocked.
   */
  const showInterstitialAndProceed = useCallback((onComplete: () => void) => {
    if (isLoadedRef.current && adRef.current) {
      // Store the callback – it will be called when the ad closes
      onCompleteRef.current = onComplete;

      try {
        adRef.current.show();
      } catch (err) {
        // If show() fails for any reason, run callback immediately
        console.warn('[Interstitial] Show failed, proceeding:', err);
        onCompleteRef.current = null;
        onComplete();
      }
    } else {
      // Ad not loaded or in Expo Go / web → proceed immediately (never block the user)
      onComplete();
    }
  }, []);

  return { showInterstitialAndProceed };
}
