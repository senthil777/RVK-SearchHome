import React, { useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInput as TextInputType,
} from 'react-native';

interface Props {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
  onChangeFirstName: (v: string) => void;
  onChangeLastName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangeAddress: (v: string) => void;
  onChangePassword: (v: string) => void;
  onChangeConfirmPassword: (v: string) => void;
  onSubmit: () => void;
}

const InputField = ({
  label,
  inputRef,
  nextRef,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'words',
  textContentType = 'none',
  autoComplete = 'off',
  returnKeyType = 'next',
  multiline = false,
  onSubmitEditing,
  editable = true,
  testID,
}: any) => (
  <View style={inputStyles.wrapper}>
    <Text style={inputStyles.label}>{label}</Text>
    <TextInput
      ref={inputRef}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={[inputStyles.input, multiline && inputStyles.multiline]}
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
  const lastNameRef   = useRef<TextInputType>(null);
  const emailRef      = useRef<TextInputType>(null);
  const addressRef    = useRef<TextInputType>(null);
  const passwordRef   = useRef<TextInputType>(null);
  const confirmRef    = useRef<TextInputType>(null);

  return (
    <View>
      {/* Row: First + Last name */}
      <View style={styles.row}>
        <View style={styles.half}>
          <InputField
            label="First Name"
            value={firstName}
            onChangeText={onChangeFirstName}
            placeholder="John"
            nextRef={lastNameRef}
            autoCapitalize="words"
            textContentType="givenName"
            autoComplete="given-name"
            editable={!loading}
            testID="first-name-input"
          />
        </View>
        <View style={styles.half}>
          <InputField
            label="Last Name"
            inputRef={lastNameRef}
            value={lastName}
            onChangeText={onChangeLastName}
            placeholder="Doe"
            nextRef={emailRef}
            autoCapitalize="words"
            textContentType="familyName"
            autoComplete="family-name"
            editable={!loading}
            testID="last-name-input"
          />
        </View>
      </View>

      <InputField
        label="Email Address"
        inputRef={emailRef}
        value={email}
        onChangeText={onChangeEmail}
        placeholder="john@example.com"
        nextRef={addressRef}
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
        autoComplete="email"
        editable={!loading}
        testID="email-input"
      />

      <InputField
        label="Address"
        inputRef={addressRef}
        value={address}
        onChangeText={onChangeAddress}
        placeholder="123 Main Street, City"
        nextRef={passwordRef}
        textContentType="fullStreetAddress"
        autoComplete="street-address"
        autoCapitalize="words"
        multiline
        editable={!loading}
        testID="address-input"
      />

      <InputField
        label="Password"
        inputRef={passwordRef}
        value={password}
        onChangeText={onChangePassword}
        placeholder="Min. 6 characters"
        nextRef={confirmRef}
        secureTextEntry
        autoCapitalize="none"
        textContentType="newPassword"
        autoComplete="new-password"
        editable={!loading}
        testID="password-input"
      />

      <InputField
        label="Confirm Password"
        inputRef={confirmRef}
        value={confirmPassword}
        onChangeText={onChangeConfirmPassword}
        placeholder="Re-enter password"
        secureTextEntry
        autoCapitalize="none"
        textContentType="newPassword"
        autoComplete="new-password"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        editable={!loading}
        testID="confirm-password-input"
      />
    </View>
  );
};

export default SignUpForm;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
});

const inputStyles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 15,
    color: '#111',
    backgroundColor: '#fff',
  },
  multiline: {
    height: 80,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
});