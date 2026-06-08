import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useSignUpViewModel } from '../viewmodels/SignUpViewModel';
import {
  SignUpHeader,
  ProfileImagePicker,
  SignUpForm,
  SignUpButton,
  LoginPrompt,
} from './components/signup';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUpScreen = ({ navigation }: Props) => {
  const {
    firstName, lastName, email, address,
    password, confirmPassword, profileImage,
    loading, error, successMessage,
    setFirstName, setLastName, setEmail,
    setAddress, setPassword, setConfirmPassword,
    setProfileImage, signUp,
  } = useSignUpViewModel();

  // Navigate back to login on success after short delay
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => navigation.navigate('Login'), 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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

          {/* Back button */}
          <View style={styles.backRow}>
            <Text
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              ← Back
            </Text>
          </View>

          <SignUpHeader />

          {/* Success Banner */}
          {successMessage ? (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>✓ {successMessage}</Text>
              <Text style={styles.successSub}>Redirecting to login...</Text>
            </View>
          ) : null}

          {/* Error Banner */}
          {error ? (
            <Text
              style={styles.errorText}
              accessibilityRole="alert"
              testID="signup-error"
            >
              {error}
            </Text>
          ) : null}

          <ProfileImagePicker
            profileImage={profileImage}
            onImageSelected={setProfileImage}
          />

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

          <SignUpButton loading={loading} onPress={signUp} />

          <LoginPrompt onLoginPress={() => navigation.navigate('Login')} />

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1 },
  container: { padding: 24, paddingTop: 52 },
  backRow: { marginBottom: 16 },
  backBtn: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '500',
  },
  successBanner: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    alignItems: 'center',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 15,
    fontWeight: '600',
  },
  successSub: {
    color: '#4CAF50',
    fontSize: 12,
    marginTop: 4,
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
});