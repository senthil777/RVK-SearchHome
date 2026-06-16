import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput as TextInputType,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useLoginViewModel } from '../viewmodels/LoginViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const {
    email,
    password,
    loading,
    error,
    accessToken,
    setEmail,
    setPassword,
    login,
  } = useLoginViewModel();

  const passwordRef   = useRef<TextInputType>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (accessToken) {
      navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
    }
  }, [accessToken, navigation]);

  const handleForgotPassword = () => navigation.navigate('ForgotPassword');
  const handleSignup         = () => navigation.navigate('SignUp');
  const handleGoogleLogin    = () => { /* TODO: Google OAuth */ };
  const handleAppleLogin     = () => { /* TODO: Apple Sign-In */ };

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
            <Text style={styles.headerIcon}>⌂</Text>
            <Text style={styles.headerTitle}>RVK HomeSearch</Text>
          </View>

          {/* ── Hero building image ── */}
          <View style={styles.heroWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          {/* ── Title ── */}
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Please enter your details to sign in</Text>

          {/* ── Form Card ── */}
          <View style={styles.card}>

            {/* Error Banner */}
            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText} accessibilityRole="alert" testID="error-text">
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Email */}
            <Text style={styles.label}>Email Address</Text>
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
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              accessibilityLabel="Email address"
              editable={!loading}
              testID="email-input"
            />

            {/* Password row label */}
            <View style={styles.passwordLabelRow}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity
                onPress={handleForgotPassword}
                accessibilityRole="link"
                testID="forgot-password-btn"
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Password input + eye */}
            <View style={[styles.passwordContainer, !!error && styles.inputError]}>
              <TextInput
                ref={passwordRef}
                placeholder="••••••••"
                placeholderTextColor="#AABBA7"
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                style={styles.passwordInput}
                textContentType="password"
                autoComplete="password"
                returnKeyType="done"
                onSubmitEditing={login}
                accessibilityLabel="Password"
                editable={!loading}
                testID="password-input"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(p => !p)}
                style={styles.eyeButton}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                testID="toggle-password-btn"
              >
                {/* SVG-style eye using unicode — consistent cross-platform */}
                <Text style={styles.eyeIcon}>{showPassword ? '🔓' : '👁'}</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In button */}
            <TouchableOpacity
              style={[styles.signInButton, loading && styles.signInButtonDisabled]}
              onPress={login}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={loading ? 'Signing in' : 'Sign In'}
              accessibilityState={{ busy: loading }}
              testID="login-button"
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.signInText}>Sign In</Text>
              )}
            </TouchableOpacity>

          </View>

          {/* ── Divider ── */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* ── Social buttons ── */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleLogin}
              accessibilityRole="button"
              accessibilityLabel="Sign in with Google"
              testID="google-login-btn"
            >
              {/* Google coloured grid icon */}
              <Text style={styles.googleIcon}>▦</Text>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleAppleLogin}
              accessibilityRole="button"
              accessibilityLabel="Sign in with Apple"
              testID="apple-login-btn"
            >
              <Text style={styles.appleIcon}></Text>
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* ── Bottom register tab ── */}
          <View style={styles.registerTab}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleSignup}
              accessibilityRole="button"
              accessibilityLabel="Register"
              testID="signup-btn"
            >
              <Text style={styles.registerIcon}>👤+</Text>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const GREEN_DARK   = '#2E6B3E';   // brand dark green (header, button)
const GREEN_MID    = '#4CAF50';   // mid green accents
const GREEN_LIGHT  = '#E8F5E9';   // page background
const GREEN_FORGOT = '#4CAF50';   // forgot password link
const CARD_BG      = '#FFFFFF';
const TEXT_DARK    = '#1A2E1A';
const TEXT_MUTED   = '#6B8C6B';
const BORDER       = '#D4E8D4';
const ERROR        = '#D32F2F';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GREEN_LIGHT,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 16,
    gap: 8,
  },
  headerIcon: {
    fontSize: 20,
    color: GREEN_DARK,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: GREEN_DARK,
    letterSpacing: 0.3,
  },

  // ── Hero image ──
  heroWrapper: {
    alignSelf: 'center',
    width: 140,
    height: 130,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },

  // ── Title ──
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 20,
  },

  // ── Card ──
  card: {
    marginHorizontal: 20,
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },

  // ── Error ──
  errorBanner: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    color: ERROR,
    fontSize: 13,
  },

  // ── Labels ──
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 6,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: GREEN_FORGOT,
  },

  // ── Inputs ──
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    color: TEXT_DARK,
    backgroundColor: '#FAFFFE',
    marginBottom: 14,
  },
  inputError: {
    borderColor: ERROR,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: '#FAFFFE',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: TEXT_DARK,
    paddingVertical: 0,
  },
  eyeButton: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 17,
    color: TEXT_MUTED,
  },

  // ── Sign In button ──
  signInButton: {
    backgroundColor: GREEN_DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  // ── Divider ──
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: GREEN_MID,
    letterSpacing: 1,
  },

  // ── Social buttons ──
  socialRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 28,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD_BG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIcon: {
    fontSize: 16,
    color: '#4285F4',
  },
  appleIcon: {
    fontSize: 18,
    color: TEXT_DARK,
  },
  socialText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
  },

  // ── Register tab ──
  registerTab: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 14,
    marginHorizontal: 20,
  },
  registerButton: {
    alignItems: 'center',
    gap: 4,
  },
  registerIcon: {
    fontSize: 20,
    color: TEXT_DARK,
  },
  registerText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_DARK,
  },
});