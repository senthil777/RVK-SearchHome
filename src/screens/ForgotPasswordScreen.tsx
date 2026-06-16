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
  StatusBar,
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
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🛡</Text>
          <Text style={styles.headerTitle}>RVK HomeSearch</Text>
        </View>

        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Check your email</Text>
          <Text style={styles.successMessage}>{successMessage}</Text>

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleBackToLogin}
            accessibilityRole="button"
            accessibilityLabel="Back to login"
            testID="back-to-login-btn"
          >
            <Text style={styles.sendBtnText}>Back to Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendContainer}
            onPress={submitForgotPassword}
            accessibilityRole="button"
            testID="resend-btn"
          >
            <Text style={styles.resendText}>Didn't receive it? </Text>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Sign In Tab */}
        <View style={styles.bottomTab}>
          <TouchableOpacity
            style={styles.signInFab}
            onPress={handleBackToLogin}
            accessibilityRole="button"
            accessibilityLabel="Sign In"
            testID="sign-in-fab"
          >
            <Text style={styles.signInFabIcon}>→</Text>
          </TouchableOpacity>
          <Text style={styles.signInFabLabel}>Sign In</Text>
        </View>
      </View>
    );
  }

  // ── Form state ─────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* ── Header bar ── */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>🛡</Text>
            <Text style={styles.headerTitle}>RVK HomeSearch</Text>
          </View>

          {/* ── Decorative background blobs ── */}
          <View style={styles.blob1} />
          <View style={styles.blob2} />
          <View style={styles.blob3} />

          {/* ── Main content ── */}
          <View style={styles.contentArea}>

            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address to receive a{'\n'}password reset link.
            </Text>

            {/* Email label */}
            <Text style={styles.label}>Email Address</Text>

            {/* Email input */}
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#AABBA7"
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

            {/* Send button */}
            <TouchableOpacity
              style={[styles.sendButton, loading && styles.sendButtonDisabled]}
              onPress={submitForgotPassword}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={loading ? 'Sending reset link' : 'Send'}
              accessibilityState={{ busy: loading }}
              testID="submit-btn"
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.sendBtnText}>Send</Text>
              )}
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Bottom Sign In tab ── */}
      <View style={styles.bottomTab}>
        <TouchableOpacity
          style={styles.signInFab}
          onPress={handleBackToLogin}
          accessibilityRole="button"
          accessibilityLabel="Sign In"
          testID="sign-in-btn"
        >
          <Text style={styles.signInFabIcon}>⇥</Text>
        </TouchableOpacity>
        <Text style={styles.signInFabLabel}>Sign In</Text>
      </View>

    </View>
  );
};

export default ForgotPasswordScreen;

// ── Design tokens ────────────────────────────────────────────
const GREEN_DARK  = '#1A237E';   // navy blue — header & button (matches screenshot)
const GREEN_BG    = '#E8F5E9';   // mint green page background
const CARD_BG     = '#FFFFFF';
const TEXT_DARK   = '#111827';
const TEXT_MUTED  = '#6B7A8D';
const BORDER      = '#D4E8D4';
const ERROR       = '#D32F2F';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GREEN_BG,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,   // space for bottom tab
  },

  // ── Header ──────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingBottom: 20,
    gap: 8,
    zIndex: 1,
  },
  headerIcon: {
    fontSize: 18,
    color: GREEN_DARK,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: GREEN_DARK,
    letterSpacing: 0.3,
  },

  // ── Decorative blobs (network-node style from screenshot) ───
  blob1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(200,230,210,0.55)',
    top: 180,
    left: -60,
  },
  blob2: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(200,230,210,0.45)',
    top: 260,
    right: -30,
  },
  blob3: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(180,220,195,0.4)',
    bottom: 160,
    left: 60,
  },

  // ── Content area ────────────────────────────────────────────
  contentArea: {
    paddingHorizontal: 24,
    paddingTop: 16,
    zIndex: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
  },

  // Label
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 8,
  },

  // Input
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 15,
    color: TEXT_DARK,
    backgroundColor: CARD_BG,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: ERROR,
  },
  errorText: {
    color: ERROR,
    fontSize: 13,
    marginBottom: 10,
  },

  // ── Send button ─────────────────────────────────────────────
  sendButton: {
    backgroundColor: GREEN_DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: GREEN_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  // ── Bottom Sign In tab ──────────────────────────────────────
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 28 : 18,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(200,225,205,0.6)',
    backgroundColor: GREEN_BG,
  },
  signInFab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: GREEN_DARK,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: GREEN_DARK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  signInFabIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  signInFabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_DARK,
    letterSpacing: 0.2,
  },

  // ── Success state ───────────────────────────────────────────
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    paddingBottom: 100,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
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
    fontWeight: '800',
    color: TEXT_DARK,
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    color: TEXT_MUTED,
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
    color: TEXT_MUTED,
  },
  resendLink: {
    fontSize: 14,
    color: GREEN_DARK,
    fontWeight: '700',
  },
});