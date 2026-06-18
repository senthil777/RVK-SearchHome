// src/screens/components/home/HomeHeader.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  greeting: string;
  userName: string;
}

const HomeHeader = ({ greeting, userName }: Props) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.greeting}>{greeting} 👋</Text>
      <Text style={styles.name}>Welcome, {userName}!</Text>
    </View>

    {/* ✅ Avatar circle with first letter — matches screenshot */}
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
    marginBottom: 16,
  },
  greeting: {
    fontSize: 13,
    color: '#5A7A5A',
    fontWeight: '400',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A237E',    // navy blue — matches screenshot
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});