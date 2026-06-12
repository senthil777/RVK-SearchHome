import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface Props {
  onBrowsePress: () => void;
}

const HomeBanner = ({ onBrowsePress }: Props) => (
  <View style={styles.container}>
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
    backgroundColor: '#007AFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '600',
  },
});