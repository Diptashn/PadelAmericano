import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../constants/theme';
import { AD_UNIT_IDS } from '../constants/AdConfig';

/**
 * Check if running inside Expo Go or Web, where native AdMob binary modules are not linked.
 */
let isExpoGo = false;
try {
  const Constants = require('expo-constants').default;
  const { ExecutionEnvironment } = require('expo-constants');
  isExpoGo = Constants?.executionEnvironment === ExecutionEnvironment?.StoreClient;
} catch {
  // If expo-constants is unavailable, fallback gracefully
}

let BannerAd: any = null;
let BannerAdSize: any = null;
let isNativeAdsAvailable = false;

try {
  // Only attempt to load native AdMob if NOT in Expo Go and NOT on Web
  if (!isExpoGo && Platform.OS !== 'web') {
    const mobileAds = require('react-native-google-mobile-ads');
    BannerAd = mobileAds.BannerAd;
    BannerAdSize = mobileAds.BannerAdSize;
    isNativeAdsAvailable = true;
  }
} catch {
  // Native module not linked (e.g. running without custom dev client)
  isNativeAdsAvailable = false;
}

interface AdBannerProps {
  /** Optional style overrides for the outer container */
  style?: object;
}

/**
 * Self-contained AdMob banner component (Anchored Adaptive Banner).
 *
 * - In standalone / custom dev client production builds: renders Google BannerAd.
 * - In Expo Go, Web, or when unlinked: displays a sleek themed placeholder.
 */
export const AdBanner: React.FC<AdBannerProps> = ({ style }) => {
  const { colors, isDark } = useTheme();
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  // Show real Google Banner if native AdMob is available
  if (isNativeAdsAvailable && BannerAd && BannerAdSize && !adError) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark
              ? 'rgba(17, 22, 34, 0.95)'
              : 'rgba(241, 245, 249, 0.95)',
            borderTopColor: colors.surfaceBorder,
          },
          style,
        ]}
      >
        <BannerAd
          unitId={AD_UNIT_IDS.BANNER}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={() => setAdLoaded(true)}
          onAdFailedToLoad={(error: any) => {
            console.warn('[AdBanner] Failed to load:', error?.message);
            setAdError(true);
          }}
        />
        {!adLoaded && (
          <View style={[styles.loadingOverlay, { backgroundColor: colors.surfaceCard }]}>
            <Text style={[styles.placeholderText, { color: colors.textMuted }]}>
              Loading ad…
            </Text>
          </View>
        )}
      </View>
    );
  }

  // Graceful fallback: Styled athletic placeholder for Expo Go / Web / Dev
  return (
    <View
      style={[
        styles.container,
        styles.devPlaceholder,
        {
          backgroundColor: isDark
            ? 'rgba(17, 22, 34, 0.7)'
            : 'rgba(241, 245, 249, 0.7)',
          borderColor: isDark
            ? 'rgba(204, 255, 0, 0.25)'
            : 'rgba(101, 163, 13, 0.25)',
        },
        style,
      ]}
    >
      <View style={styles.badgeRow}>
        <View
          style={[
            styles.adBadge,
            {
              backgroundColor: isDark
                ? 'rgba(204, 255, 0, 0.15)'
                : 'rgba(101, 163, 13, 0.15)',
            },
          ]}
        >
          <Text
            style={[
              styles.adBadgeText,
              { color: isDark ? '#CCFF00' : '#4D7C0F' },
            ]}
          >
            AD
          </Text>
        </View>
        <Text style={[styles.devLabel, { color: colors.text }]}>
          Google AdMob Banner
        </Text>
      </View>
      <Text style={[styles.devHint, { color: colors.textMuted }]}>
        {isExpoGo
          ? 'Adaptive Banner active in Custom Dev / Production builds'
          : adError
            ? 'Ad failed to load – placeholder active'
            : 'Anchored Adaptive Banner (Test ID configured)'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  loadingOverlay: {
    position: 'absolute',
    width: '100%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 12,
    fontWeight: '600',
  },
  devPlaceholder: {
    height: 58,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    gap: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  devLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  devHint: {
    fontSize: 10,
    fontWeight: '500',
  },
});
