// src/screens/components/home/SectionHeader.tsx
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';

interface Props {
  title: string;
  onSeeAllPress: () => void;
}

const SectionHeader = ({ title, onSeeAllPress }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <TouchableOpacity
      onPress={onSeeAllPress}
      accessibilityRole="link"
      accessibilityLabel={`See all ${title}`}
      testID="see-all-btn"
    >
      <Text style={styles.seeAll}>See all</Text>
    </TouchableOpacity>
  </View>
);

export default SectionHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    color: '#1A237E',
    fontWeight: '600',
  },
});