// src/screens/components/home/HomeBanner.tsx
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';

interface Props {
  onBrowsePress: () => void;
}

const HomeBanner = ({ onBrowsePress }: Props) => (
  <View style={styles.container}>
    {/* Decorative circle blobs */}
    <View style={styles.blob1} />
    <View style={styles.blob2} />

    <Text style={styles.title}>Explore what's new</Text>
    <Text style={styles.subtitle}>
      Discover the latest listings added today
    </Text>

    <TouchableOpacity
      style={styles.button}
      onPress={onBrowsePress}
      accessibilityRole="button"
      accessibilityLabel="Browse listings"
      testID="banner-browse-btn"
    >
      <Text style={styles.buttonText}>Browse Now</Text>
    </TouchableOpacity>
  </View>
);

export default HomeBanner;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A237E',      // navy blue — matches screenshot exactly
    borderRadius: 16,
    padding: 22,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  // Decorative blobs inside banner
  blob1: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -30,
    right: -20,
  },
  blob2: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -20,
    right: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 18,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
  },
  buttonText: {
    color: '#1A237E',
    fontSize: 13,
    fontWeight: '700',
  },
});