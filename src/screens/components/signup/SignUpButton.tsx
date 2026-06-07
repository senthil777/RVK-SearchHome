import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

interface Props {
  loading: boolean;
  onPress: () => void;
}

const SignUpButton = ({ loading, onPress }: Props) => (
  <TouchableOpacity
    style={[styles.button, loading && styles.disabled]}
    onPress={onPress}
    disabled={loading}
    accessibilityRole="button"
    accessibilityLabel={loading ? 'Creating account' : 'Create Account'}
    accessibilityState={{ busy: loading }}
    testID="signup-submit-btn"
  >
    {loading ? (
      <ActivityIndicator color="#fff" size="small" />
    ) : (
      <Text style={styles.btnText}>Create Account</Text>
    )}
  </TouchableOpacity>
);

export default SignUpButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 8,
  },
  disabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});