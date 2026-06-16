// src/components/signup/SignUpForm.tsx
import React, { useRef, useState } from 'react';
import {
  View, TextInput, Text, StyleSheet,
  TouchableOpacity, TextInput as TextInputType,
} from 'react-native';

interface Props {
  firstName: string; lastName: string; email: string;
  address: string; password: string; confirmPassword: string;
  loading: boolean;
  onChangeFirstName: (v: string) => void;
  onChangeLastName:  (v: string) => void;
  onChangeEmail:     (v: string) => void;
  onChangeAddress:   (v: string) => void;
  onChangePassword:  (v: string) => void;
  onChangeConfirmPassword: (v: string) => void;
  onSubmit: () => void;
}

const GREEN_DARK = '#2E6B3E';
const BORDER     = '#D4E8D4';
const TEXT_DARK  = '#111827';

// Reusable input
const Field = ({ label, value, onChangeText, placeholder, inputRef, nextRef,
  keyboardType = 'default', autoCapitalize = 'words', secureTextEntry = false,
  textContentType = 'none', autoComplete = 'off', returnKeyType = 'next',
  multiline = false, onSubmitEditing, editable = true, testID,
  rightElement,
}: any) => (
  <View style={fieldStyles.wrapper}>
    <Text style={fieldStyles.label}>{label}</Text>
    <View style={[fieldStyles.row, multiline && fieldStyles.multilineRow]}>
      <TextInput
        ref={inputRef}
        placeholder={placeholder}
        placeholderTextColor="#AABBA7"
        value={value}
        onChangeText={onChangeText}
        style={[fieldStyles.input, multiline && fieldStyles.multiline]}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        textContentType={textContentType}
        autoComplete={autoComplete}
        returnKeyType={returnKeyType}
        multiline={multiline}
        onSubmitEditing={onSubmitEditing ?? (() => nextRef?.current?.focus())}
        editable={editable}
        accessibilityLabel={label}
        testID={testID}
        blurOnSubmit={multiline}
      />
      {rightElement ?? null}
    </View>
  </View>
);

const SignUpForm = ({
  firstName, lastName, email, address,
  password, confirmPassword, loading,
  onChangeFirstName, onChangeLastName,
  onChangeEmail, onChangeAddress,
  onChangePassword, onChangeConfirmPassword,
  onSubmit,
}: Props) => {
  const lastNameRef = useRef<TextInputType>(null);
  const emailRef    = useRef<TextInputType>(null);
  const addressRef  = useRef<TextInputType>(null);
  const passwordRef = useRef<TextInputType>(null);
  const confirmRef  = useRef<TextInputType>(null);

  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirmPassword, setShowConfirm] = useState(false);

  return (
    <View>

      {/* First Name */}
      <Field
        label="First Name"
        value={firstName}
        onChangeText={onChangeFirstName}
        placeholder="John"
        nextRef={lastNameRef}
        textContentType="givenName"
        autoComplete="given-name"
        editable={!loading}
        testID="first-name-input"
      />

      {/* Last Name */}
      <Field
        label="Last Name"
        inputRef={lastNameRef}
        value={lastName}
        onChangeText={onChangeLastName}
        placeholder="Doe"
        nextRef={emailRef}
        textContentType="familyName"
        autoComplete="family-name"
        editable={!loading}
        testID="last-name-input"
      />

      {/* Email */}
      <Field
        label="Email Address"
        inputRef={emailRef}
        value={email}
        onChangeText={onChangeEmail}
        placeholder="john.doe@example.com"
        nextRef={addressRef}
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
        autoComplete="email"
        editable={!loading}
        testID="email-input"
      />

      {/* Address */}
      <Field
        label="Address"
        inputRef={addressRef}
        value={address}
        onChangeText={onChangeAddress}
        placeholder="123 Home Street, City"
        nextRef={passwordRef}
        textContentType="fullStreetAddress"
        autoComplete="street-address"
        autoCapitalize="words"
        editable={!loading}
        testID="address-input"
      />

      {/* Password with eye */}
      <Field
        label="Password"
        inputRef={passwordRef}
        value={password}
        onChangeText={onChangePassword}
        placeholder="Min. 6 characters"
        nextRef={confirmRef}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        textContentType="newPassword"
        autoComplete="new-password"
        editable={!loading}
        testID="password-input"
        rightElement={
          <TouchableOpacity
            onPress={() => setShowPassword(p => !p)}
            style={fieldStyles.eyeBtn}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Text style={fieldStyles.eyeIcon}>{showPassword ? '🔓' : '👁'}</Text>
          </TouchableOpacity>
        }
      />

      {/* Confirm Password with eye */}
      <Field
        label="Confirm Password"
        inputRef={confirmRef}
        value={confirmPassword}
        onChangeText={onChangeConfirmPassword}
        placeholder="Re-enter password"
        secureTextEntry={!showConfirmPassword}
        autoCapitalize="none"
        textContentType="newPassword"
        autoComplete="new-password"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        editable={!loading}
        testID="confirm-password-input"
        rightElement={
          <TouchableOpacity
            onPress={() => setShowConfirm(p => !p)}
            style={fieldStyles.eyeBtn}
            accessibilityLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            <Text style={fieldStyles.eyeIcon}>{showConfirmPassword ? '🔓' : '👁'}</Text>
          </TouchableOpacity>
        }
      />

    </View>
  );
};

export default SignUpForm;

const fieldStyles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FAFFFE',
    height: 48,
  },
  multilineRow: {
    height: 80,
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: TEXT_DARK,
    paddingVertical: 0,
  },
  multiline: {
    height: 56,
    textAlignVertical: 'top',
  },
  eyeBtn: {
    paddingLeft: 8,
    justifyContent: 'center',
  },
  eyeIcon: { fontSize: 17 },
});