import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  greeting: string;
  userName?: string;
}

const HomeHeader = ({ greeting, userName = 'User' }: Props) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.greeting}>{greeting} 👋</Text>
      <Text style={styles.name}>Welcome, {userName}!</Text>
    </View>
    <View style={styles.avatarCircle}>
      <Text style={styles.avatarText}>
        {userName.charAt(0).toUpperCase()}
      </Text>
    </View>
  </View>
);

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: { fontSize: 13, color: '#888' },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 2,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});