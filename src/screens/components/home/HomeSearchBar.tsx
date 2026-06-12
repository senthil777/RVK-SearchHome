import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
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
      placeholderTextColor="#bbb"
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="search"
      accessibilityLabel="Search properties"
      accessibilityHint="Type to filter properties by name or address"
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
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    gap: 8,
  },
  icon: { fontSize: 15 },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111',
    padding: 0,
  },
  clearIcon: {
    fontSize: 14,
    color: '#aaa',
    paddingHorizontal: 4,
  },
});