import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForgotPasswordViewModel } from '../viewmodels/ForgotPasswordViewModel';

interface Props {
  navigation: any;
}

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const {
    email,
    loading,
    error,
    successMessage,
    setEmail,
    submitForgotPassword,
    resetState,
  } = useForgotPasswordViewModel();

  const handleBackToLogin = () => {
    resetState();
    navigation.goBack();
  };

  // ── Success state ──────────────────────────────────────────
  if (successMessage) {
    return (
      <View style={styles.flex}>
        <View style={styles.successContainer}>

          <View style={styles.successIconCircle}>
            <Text style={styles.successIconText}>✓</Text>
          </View>

          <Text style={styles.successTitle}>Check your email</Text>
          <Text style={styles.successMessage}>{successMessage}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleBackToLogin}
            accessibilityRole="button"
            accessibilityLabel="Back to login"
            testID="back-to-login-btn"
          >
            <Text style={styles.btnText}>Back to Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendContainer}
            onPress={submitForgotPassword}
            accessibilityRole="button"
            accessibilityLabel="Resend email"
            testID="resend-btn"
          >
            <Text style={styles.resendText}>Didn't receive it? </Text>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }

  // ── Form state ─────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToLogin}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            testID="back-btn"
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.iconCircle}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>

          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            No worries! Enter your registered email and we'll send you a reset link.
          </Text>

          {/* Email Input */}
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, !!error && styles.inputError]}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="done"
            onSubmitEditing={submitForgotPassword}
            accessibilityLabel="Email address"
            accessibilityHint="Enter your registered email address"
            editable={!loading}
            testID="forgot-email-input"
          />

          {/* Inline Error */}
          {error ? (
            <Text
              style={styles.errorText}
              accessibilityRole="alert"
              testID="error-text"
            >
              {error}
            </Text>
          ) : null}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={submitForgotPassword}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={loading ? 'Sending reset link' : 'Send reset link'}
            accessibilityState={{ busy: loading }}
            testID="submit-btn"
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.btnText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Back to Login Link */}
          <TouchableOpacity
            style={styles.backToLoginRow}
            onPress={handleBackToLogin}
            accessibilityRole="link"
            accessibilityLabel="Back to login"
            testID="back-to-login-link"
          >
            <Text style={styles.backArrowText}>← </Text>
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },

  // Back button (top-left)
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  backArrow: {
    fontSize: 18,
    color: '#333',
  },

  // Icon
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    alignSelf: 'center',
  },
  lockIcon: {
    fontSize: 32,
  },

  // Header text
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
  },

  // Label
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },

  // Input
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 15,
    color: '#111',
  },
  inputError: {
    borderColor: '#E24B4A',
  },
  errorText: {
    color: '#E24B4A',
    fontSize: 13,
    marginBottom: 12,
    marginTop: -4,
  },

  // Button
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  dividerText: {
    fontSize: 13,
    color: '#aaa',
  },

  // Back to login link
  backToLoginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  backToLoginText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },

  // ── Success state ──────────────────────────
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 36,
    color: '#2E7D32',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  resendContainer: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#888',
  },
  resendLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});