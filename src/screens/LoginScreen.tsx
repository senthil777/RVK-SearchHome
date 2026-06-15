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
    successMessage,
    accessToken,
    setEmail,
    setPassword,
    login,
  } = useLoginViewModel();

  const passwordRef = useRef<TextInputType>(null);

  // ✅ Password visibility toggle state
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Navigate only when accessToken is received
  useEffect(() => {
    if (accessToken) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
    }
  }, [accessToken]);

  const handleForgotPassword = () => navigation.navigate('ForgotPassword');
  const handleSignup = () => navigation.navigate('SignUp');
  const handleGoogleLogin = () => console.log('Google login pressed');
  const handleAppleLogin = () => console.log('Apple login pressed');

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

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          {/* Error Banner */}
          {error ? (
            <Text
              style={styles.errorText}
              accessibilityRole="alert"
              testID="error-text"
            >
              {error}
            </Text>
          ) : null}

          {/* Email Input */}
          <TextInput
            placeholder="Email"
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
            accessibilityHint="Enter your registered email"
            editable={!loading}
            testID="email-input"
          />

          {/* ✅ Password Input with Eye Toggle */}
          <View style={[styles.passwordContainer, !!error && styles.inputError]}>
            <TextInput
              ref={passwordRef}
              placeholder="Password"
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              style={styles.passwordInput}
              textContentType="password"
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={login}
              accessibilityLabel="Password"
              accessibilityHint="Enter your password"
              editable={!loading}
              testID="password-input"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(prev => !prev)}
              style={styles.eyeButton}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              testID="toggle-password-btn"
            >
              <Text style={styles.eyeIcon}>
                {showPassword ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.forgotContainer}
            accessibilityRole="link"
            accessibilityLabel="Forgot password"
            testID="forgot-password-btn"
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={login}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={loading ? 'Signing in' : 'Login'}
            accessibilityState={{ busy: loading }}
            testID="login-button"
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.btnText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleLogin}
              accessibilityRole="button"
              accessibilityLabel="Sign in with Google"
              testID="google-login-btn"
            >
              <Text style={styles.socialIcon}>G</Text>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleAppleLogin}
              accessibilityRole="button"
              accessibilityLabel="Sign in with Apple"
              testID="apple-login-btn"
            >
              <Text style={styles.socialIcon}></Text>
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Row */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity
              accessibilityRole="link"
              accessibilityLabel="Sign up"
              onPress={handleSignup}
              testID="signup-btn"
            >
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 15,
    color: '#111',
  },
  inputError: {
    borderColor: '#E24B4A',
  },

  // ✅ Password wrapper styles
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    height: 50,
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: '#111',
    height: '100%',
  },
  eyeButton: {
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 18,
  },

  errorText: {
    color: '#E24B4A',
    fontSize: 13,
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F7C1C1',
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
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
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  socialText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#888',
  },
  signupLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});