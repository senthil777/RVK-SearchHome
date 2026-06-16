import React, { useEffect } from 'react';  // ✅ add useEffect
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, StatusBar,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useSignUpViewModel } from '../viewmodels/SignUpViewModel';
import { ProfileImagePicker, SignUpForm } from './components/signup';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUpScreen = ({ navigation }: Props) => {
  const {
    firstName, lastName, email, address,
    password, confirmPassword, profileImage,
    loading, error, accessToken,           // ✅ accessToken added
    setFirstName, setLastName, setEmail,
    setAddress, setPassword, setConfirmPassword,
    setProfileImage, signUp,
  } = useSignUpViewModel();

  // ✅ Navigate to MainApp after successful registration
  useEffect(() => {
    if (accessToken) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
    }
  }, [accessToken, navigation]);

  const handleSignIn       = () => navigation.goBack();
  const handleGoogleSignUp = () => { /* TODO: Google OAuth */ };
  const handleAppleSignUp  = () => { /* TODO: Apple Sign-In */ };

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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>⌂</Text>
            <Text style={styles.headerTitle}>RVK HomeSearch</Text>
          </View>

          <Text style={styles.pageTitle}>Create Account</Text>

          {/* Error banner */}
          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText} accessibilityRole="alert">
                {error}
              </Text>
            </View>
          ) : null}

          {/* Profile image picker */}
          <View style={styles.avatarSection}>
            <ProfileImagePicker
              profileImage={profileImage}
              onImageSelected={setProfileImage}
            />
          </View>

          {/* Form card */}
          <View style={styles.formCard}>
            <SignUpForm
              firstName={firstName}
              lastName={lastName}
              email={email}
              address={address}
              password={password}
              confirmPassword={confirmPassword}
              loading={loading}
              onChangeFirstName={setFirstName}
              onChangeLastName={setLastName}
              onChangeEmail={setEmail}
              onChangeAddress={setAddress}
              onChangePassword={setPassword}
              onChangeConfirmPassword={setConfirmPassword}
              onSubmit={signUp}
            />
          </View>

          {/* Action area */}
          <View style={styles.actionArea}>

            {/* Register button */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={signUp}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={loading ? 'Creating account' : 'Register'}
              accessibilityState={{ busy: loading }}
              testID="signup-submit-btn"
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.registerBtnText}>Register</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleSignUp}
                accessibilityRole="button"
                accessibilityLabel="Sign up with Google"
                testID="google-signup-btn"
              >
                <Text style={styles.googleIcon}>▦</Text>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleAppleSignUp}
                accessibilityRole="button"
                accessibilityLabel="Sign up with Apple"
                testID="apple-signup-btn"
              >
                <Text style={styles.appleIcon}></Text>
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Sign In tab */}
      <View style={styles.bottomTab}>
        <TouchableOpacity
          style={styles.signInFab}
          onPress={handleSignIn}
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

export default SignUpScreen;

const GREEN_DARK = '#2E6B3E';
const GREEN_BG   = '#E8F5E9';
const GREEN_NAVY = '#1A237E';
const CARD_BG    = '#FFFFFF';
const TEXT_DARK  = '#111827';
const TEXT_MUTED = '#6B8C6B';
const BORDER     = '#D4E8D4';
const ERROR      = '#D32F2F';

const styles = StyleSheet.create({
  root:         { flex: 1, backgroundColor: GREEN_BG },
  flex:         { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 110 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingBottom: 8, gap: 8,
  },
  headerIcon:  { fontSize: 18, color: GREEN_DARK },
  headerTitle: { fontSize: 18, fontWeight: '800', color: GREEN_DARK, letterSpacing: 0.3 },

  pageTitle: {
    fontSize: 26, fontWeight: '800', color: TEXT_DARK,
    textAlign: 'center', marginTop: 8, marginBottom: 12,
  },

  errorBanner: {
    marginHorizontal: 20, marginBottom: 12,
    backgroundColor: '#FFEBEE', borderRadius: 10,
    borderWidth: 1, borderColor: '#FFCDD2', padding: 12,
  },
  errorText: { color: ERROR, fontSize: 13 },

  avatarSection: { alignItems: 'center', marginBottom: 4 },

  formCard: {
    marginHorizontal: 20, backgroundColor: CARD_BG,
    borderRadius: 20, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 12, elevation: 4,
  },

  actionArea:  { marginHorizontal: 20, marginTop: 20 },

  registerButton: {
    backgroundColor: GREEN_DARK, height: 50, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: GREEN_DARK, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5, marginBottom: 24,
  },
  registerButtonDisabled: { opacity: 0.6 },
  registerBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.4 },

  dividerRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: BORDER },
  dividerText: { fontSize: 11, fontWeight: '700', color: TEXT_MUTED, letterSpacing: 1 },

  socialRow:    { flexDirection: 'row', gap: 12 },
  socialButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, height: 48,
    borderWidth: 1, borderColor: BORDER, borderRadius: 10,
    backgroundColor: CARD_BG, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  googleIcon: { fontSize: 16, color: '#4285F4' },
  appleIcon:  { fontSize: 18, color: TEXT_DARK },
  socialText: { fontSize: 14, fontWeight: '600', color: TEXT_DARK },

  bottomTab: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 28 : 18,
    paddingTop: 10, borderTopWidth: 1,
    borderTopColor: 'rgba(200,225,205,0.6)',
    backgroundColor: GREEN_BG,
  },
  signInFab: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: GREEN_NAVY, alignItems: 'center',
    justifyContent: 'center', marginBottom: 4,
    shadowColor: GREEN_NAVY, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35, shadowRadius: 6, elevation: 6,
  },
  signInFabIcon:  { fontSize: 20, color: '#fff', fontWeight: '700' },
  signInFabLabel: { fontSize: 12, fontWeight: '600', color: TEXT_DARK, letterSpacing: 0.2 },
});