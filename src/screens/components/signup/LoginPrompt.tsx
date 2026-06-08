import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  onLoginPress: () => void;
}

const LoginPrompt = ({ onLoginPress }: Props) => (
  <View style={styles.row}>
    <Text style={styles.text}>Already have an account? </Text>
    <TouchableOpacity
      onPress={onLoginPress}
      accessibilityRole="link"
      accessibilityLabel="Login"
      testID="login-link-btn"
    >
      <Text style={styles.link}>Login</Text>
    </TouchableOpacity>
  </View>
);

export default LoginPrompt;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  text: { fontSize: 14, color: '#888' },
  link: { fontSize: 14, color: '#007AFF', fontWeight: '600' },
});