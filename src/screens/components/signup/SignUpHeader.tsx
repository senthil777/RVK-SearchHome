import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SignUpHeader = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Create Account</Text>
    <Text style={styles.subtitle}>Fill in your details to get started</Text>
  </View>
);

export default SignUpHeader;

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
  },
});