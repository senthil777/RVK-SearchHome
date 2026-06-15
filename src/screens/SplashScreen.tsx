// src/screens/SplashScreen.tsx

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import { TokenStorage } from '../storage/TokenStorage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen = ({ navigation }: Props) => {

  // Animation values
  const iconScale     = useRef(new Animated.Value(0)).current;
  const iconOpacity   = useRef(new Animated.Value(0)).current;
  const textOpacity   = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const ringScale     = useRef(new Animated.Value(0.6)).current;
  const ringOpacity   = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // ✅ Step 1: Animate icon in
    Animated.sequence([
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 60,
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

      // ✅ Step 2: Pulse ring animation
      Animated.parallel([
        Animated.timing(ringScale, {
          toValue: 1.4,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // ✅ Step 3: Fade in app name
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),

      // ✅ Step 4: Fade in tagline
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    // ✅ Check auth after animations settle
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
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A2463" />

      {/* Background gradient circles for depth */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Center content */}
      <View style={styles.centerContent}>

        {/* Pulse ring behind icon */}
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: ringScale }],
              opacity: ringOpacity,
            },
          ]}
        />

        {/* ✅ Home Search Icon */}
        <Animated.View
          style={[
            styles.iconWrapper,
            {
              transform: [{ scale: iconScale }],
              opacity: iconOpacity,
            },
          ]}
        >
          {/* House shape using Views */}
          <View style={styles.houseContainer}>

            {/* Roof triangle using borders */}
            <View style={styles.roof} />

            {/* House body */}
            <View style={styles.houseBody}>

              {/* Door */}
              <View style={styles.door} />

              {/* Windows */}
              <View style={styles.windowRow}>
                <View style={styles.window} />
                <View style={styles.window} />
              </View>

            </View>

            {/* Search magnifier overlaid on house */}
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

      </View>

      {/* Bottom brand */}
      <Animated.Text style={[styles.brand, { opacity: taglineOpacity }]}>
        RVK Properties
      </Animated.Text>

    </View>
  );
};

export default SplashScreen;

const ICON_SIZE = 110;
const ROOF_WIDTH = ICON_SIZE + 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A2463',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Background depth circles
  bgCircle1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#1B3A8A',
    top: -80,
    right: -100,
    opacity: 0.5,
  },
  bgCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#1B3A8A',
    bottom: -60,
    left: -80,
    opacity: 0.4,
  },

  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Pulse ring
  pulseRing: {
    position: 'absolute',
    width: ICON_SIZE + 60,
    height: ICON_SIZE + 60,
    borderRadius: (ICON_SIZE + 60) / 2,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'transparent',
  },

  // ✅ Icon wrapper circle
  iconWrapper: {
    width: ICON_SIZE + 40,
    height: ICON_SIZE + 40,
    borderRadius: (ICON_SIZE + 40) / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 28,
  },

  // House container
  houseContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },

  // Roof: triangle via border trick
  roof: {
    width: 0,
    height: 0,
    borderLeftWidth: ROOF_WIDTH / 2,
    borderRightWidth: ROOF_WIDTH / 2,
    borderBottomWidth: 42,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#0A2463',
    marginBottom: -2,
    zIndex: 1,
  },

  // House body
  houseBody: {
    width: ICON_SIZE - 10,
    height: 52,
    backgroundColor: '#1B3A8A',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    alignItems: 'center',
    paddingTop: 8,
  },

  // Door at center bottom of body
  door: {
    width: 14,
    height: 22,
    backgroundColor: '#fff',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    position: 'absolute',
    bottom: 0,
  },

  // Windows row
  windowRow: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 6,
  },
  window: {
    width: 13,
    height: 13,
    backgroundColor: '#fff',
    borderRadius: 2,
    opacity: 0.85,
  },

  // ✅ Search magnifier overlay
  magnifier: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    zIndex: 2,
  },
  magnifierCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
    borderColor: '#E8A838',
    backgroundColor: 'transparent',
  },
  magnifierHandle: {
    width: 3,
    height: 10,
    backgroundColor: '#E8A838',
    borderRadius: 2,
    position: 'absolute',
    bottom: -8,
    right: -1,
    transform: [{ rotate: '45deg' }],
  },

  // App name text
  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  // Tagline
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '400',
    letterSpacing: 0.4,
  },

  // Bottom brand
  brand: {
    position: 'absolute',
    bottom: 40,
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});