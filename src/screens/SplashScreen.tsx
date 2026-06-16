// src/screens/SplashScreen.tsx

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  Platform,
} from 'react-native';
import { TokenStorage } from '../storage/TokenStorage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

// ── Design tokens (matches Login / SignUp / ForgotPassword screens) ──
const GREEN_DARK  = '#2E6B3E';   // brand dark green
const GREEN_NAVY  = '#1A237E';   // navy blue (FAB, accents)
const GREEN_BG    = '#E8F5E9';   // mint green background
const GREEN_MID   = '#4CAF50';   // mid green
const GREEN_LIGHT = '#C8E6C9';   // light green blobs
const GOLD        = '#E8A838';   // magnifier / accent gold

const SplashScreen = ({ navigation }: Props) => {

  // ── Animation refs ──────────────────────────────────────────
  const iconScale      = useRef(new Animated.Value(0)).current;
  const iconOpacity    = useRef(new Animated.Value(0)).current;
  const ringScale      = useRef(new Animated.Value(0.6)).current;
  const ringOpacity    = useRef(new Animated.Value(0.7)).current;
  const headerOpacity  = useRef(new Animated.Value(0)).current;
  const textOpacity    = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const brandOpacity   = useRef(new Animated.Value(0)).current;
  const blob1Scale     = useRef(new Animated.Value(0.8)).current;
  const blob2Scale     = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // ── Step 1: Blobs drift in ─────────────────────────────
    Animated.parallel([
      Animated.timing(blob1Scale, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(blob2Scale, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([

      // ── Step 2: Header fades in ────────────────────────
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      // ── Step 3: Icon springs in ────────────────────────
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 55,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),

      // ── Step 4: Pulse ring expands & fades ────────────
      Animated.parallel([
        Animated.timing(ringScale, {
          toValue: 1.5,
          duration: 650,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),

      // ── Step 5: App name fades in ──────────────────────
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),

      // ── Step 6: Tagline fades in ───────────────────────
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),

      // ── Step 7: Brand footer fades in ──────────────────
      Animated.timing(brandOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),

    ]).start();

    // ── Auth check after animations settle ────────────────
    const timer = setTimeout(async () => {
      try {
        const token = await TokenStorage.getToken();
        navigation.reset({
          index: 0,
          routes: [{ name: token ? 'MainApp' : 'Login' }],
        });
      } catch {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={GREEN_BG} />

      {/* ── Decorative blobs (matches ForgotPassword / Login bg) ── */}
      <Animated.View style={[styles.blob1, { transform: [{ scale: blob1Scale }] }]} />
      <Animated.View style={[styles.blob2, { transform: [{ scale: blob2Scale }] }]} />
      <Animated.View style={styles.blob3} />

      {/* ── Header: ⌂ RVK HomeSearch (matches all screens) ── */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Text style={styles.headerIcon}>⌂</Text>
        <Text style={styles.headerTitle}>RVK HomeSearch</Text>
      </Animated.View>

      {/* ── Center content ── */}
      <View style={styles.centerContent}>

        {/* Pulse ring */}
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: ringScale }],
              opacity: ringOpacity,
            },
          ]}
        />

        {/* ✅ Icon card — white circle matching Login hero style ── */}
        <Animated.View
          style={[
            styles.iconWrapper,
            {
              transform: [{ scale: iconScale }],
              opacity: iconOpacity,
            },
          ]}
        >
          <View style={styles.houseContainer}>

            {/* Roof */}
            <View style={styles.roof} />

            {/* House body */}
            <View style={styles.houseBody}>

              {/* Windows */}
              <View style={styles.windowRow}>
                <View style={styles.window} />
                <View style={styles.window} />
              </View>

              {/* Door */}
              <View style={styles.door} />

            </View>

            {/* Gold magnifier */}
            <View style={styles.magnifier}>
              <View style={styles.magnifierCircle} />
              <View style={styles.magnifierHandle} />
            </View>

          </View>
        </Animated.View>

        {/* App name */}
        <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
          HomeSearch
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Find your perfect home
        </Animated.Text>

        {/* Green pill badge — matches brand accent */}
        <Animated.View style={[styles.badge, { opacity: taglineOpacity }]}>
          <Text style={styles.badgeText}>🏡  Properties · Rentals · Sales</Text>
        </Animated.View>

      </View>

      {/* ── Bottom brand footer (matches screen pattern) ── */}
      <Animated.View style={[styles.brandRow, { opacity: brandOpacity }]}>
        <View style={styles.brandDivider} />
        <Text style={styles.brandText}>RVK Properties</Text>
        <View style={styles.brandDivider} />
      </Animated.View>

    </View>
  );
};

export default SplashScreen;

// ── Icon dimensions ──────────────────────────────────────────
const ICON_SIZE  = 100;
const ROOF_WIDTH = ICON_SIZE + 16;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: GREEN_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Blobs ─────────────────────────────────────────────────
  blob1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: GREEN_LIGHT,
    opacity: 0.55,
    top: -80,
    right: -90,
  },
  blob2: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: GREEN_LIGHT,
    opacity: 0.45,
    bottom: -50,
    left: -70,
  },
  blob3: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: GREEN_LIGHT,
    opacity: 0.35,
    bottom: 160,
    right: 20,
  },

  // ── Header ────────────────────────────────────────────────
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    fontSize: 20,
    color: GREEN_DARK,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: GREEN_DARK,
    letterSpacing: 0.3,
  },

  // ── Center ────────────────────────────────────────────────
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Pulse ring ────────────────────────────────────────────
  pulseRing: {
    position: 'absolute',
    width: ICON_SIZE + 70,
    height: ICON_SIZE + 70,
    borderRadius: (ICON_SIZE + 70) / 2,
    borderWidth: 2,
    borderColor: GREEN_DARK,
    opacity: 0.25,
    backgroundColor: 'transparent',
  },

  // ── Icon wrapper: white circle card ───────────────────────
  iconWrapper: {
    width: ICON_SIZE + 50,
    height: ICON_SIZE + 50,
    borderRadius: (ICON_SIZE + 50) / 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 3,
    borderColor: GREEN_DARK,
    shadowColor: GREEN_DARK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },

  // ── House ────────────────────────────────────────────────
  houseContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  roof: {
    width: 0,
    height: 0,
    borderLeftWidth:   ROOF_WIDTH / 2,
    borderRightWidth:  ROOF_WIDTH / 2,
    borderBottomWidth: 38,
    borderLeftColor:   'transparent',
    borderRightColor:  'transparent',
    borderBottomColor: GREEN_DARK,
    marginBottom: -1,
    zIndex: 1,
  },
  houseBody: {
    width: ICON_SIZE - 16,
    height: 48,
    backgroundColor: GREEN_DARK,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  windowRow: {
    flexDirection: 'row',
    gap: 16,
    position: 'absolute',
    top: 8,
  },
  window: {
    width: 12,
    height: 12,
    backgroundColor: '#C8E6C9',
    borderRadius: 2,
  },
  door: {
    width: 13,
    height: 20,
    backgroundColor: GREEN_BG,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginBottom: 0,
  },

  // ── Magnifier ─────────────────────────────────────────────
  magnifier: {
    position: 'absolute',
    bottom: -4,
    right: -8,
    zIndex: 2,
  },
  magnifierCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: GOLD,
    backgroundColor: 'transparent',
  },
  magnifierHandle: {
    width: 3,
    height: 9,
    backgroundColor: GOLD,
    borderRadius: 2,
    position: 'absolute',
    bottom: -7,
    right: -1,
    transform: [{ rotate: '45deg' }],
  },

  // ── Text ──────────────────────────────────────────────────
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: GREEN_DARK,
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: '#6B8C6B',
    fontWeight: '400',
    letterSpacing: 0.4,
    marginBottom: 20,
  },

  // ── Green pill badge ──────────────────────────────────────
  badge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: GREEN_LIGHT,
    shadowColor: GREEN_DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  badgeText: {
    fontSize: 12,
    color: GREEN_DARK,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // ── Brand footer ──────────────────────────────────────────
  brandRow: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 44 : 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandDivider: {
    width: 40,
    height: 1,
    backgroundColor: GREEN_DARK,
    opacity: 0.3,
  },
  brandText: {
    fontSize: 12,
    color: GREEN_DARK,
    fontWeight: '700',
    letterSpacing: 2.5,
    opacity: 0.5,
    textTransform: 'uppercase',
  },
});