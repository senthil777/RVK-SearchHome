// src/screens/components/home/HomeSearchBar.tsx
import React from 'react';
import {
  View, TextInput, StyleSheet,
  TouchableOpacity, Text,
} from 'react-native';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

const HomeSearchBar = ({ value, onChangeText }: Props) => (
  <View style={styles.container}>
    <Text style={styles.icon}>🔍</Text>
    <TextInput
      style={styles.input}
      placeholder="Search properties..."
      placeholderTextColor="#AABBA7"
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="search"
      accessibilityLabel="Search properties"
      testID="home-search-input"
    />
    {value.length > 0 && (
      <TouchableOpacity
        onPress={() => onChangeText('')}
        accessibilityLabel="Clear search"
        testID="clear-search-btn"
      >
        <Text style={styles.clearIcon}>✕</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default HomeSearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    gap: 8,
  },
  icon:  { fontSize: 15, color: '#6B8C6B' },
  input: { flex: 1, fontSize: 14, color: '#111827', padding: 0 },
  clearIcon: { fontSize: 13, color: '#AABBA7', paddingHorizontal: 4 },
});