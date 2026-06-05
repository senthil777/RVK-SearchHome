import React, { useRef } from 'react';
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
} from 'react-native';
import { useLoginViewModel } from '../viewmodels/LoginViewModel';

const LoginScreen = () => {
  const {
    email,
    password,
    loading,
    error,
    setEmail,
    setPassword,
    login,
  } = useLoginViewModel();

  const passwordRef = useRef<TextInputType>(null);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

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
        />

        <TextInput
          ref={passwordRef}
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={[styles.input, !!error && styles.inputError]}
          textContentType="password"
          autoComplete="password"
          returnKeyType="done"
          onSubmitEditing={login}
          accessibilityLabel="Password"
          accessibilityHint="Enter your password"
          editable={!loading}
        />

        {error ? (
          <Text style={styles.errorText} accessibilityRole="alert">
            {error}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={login}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel={loading ? 'Signing in' : 'Login'}
          accessibilityState={{ busy: loading }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  inputError: {
    borderColor: '#E24B4A',
  },
  errorText: {
    color: '#E24B4A',
    fontSize: 13,
    marginBottom: 12,
    marginTop: -8,
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
});