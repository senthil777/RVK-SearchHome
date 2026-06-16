import { useState, useCallback } from 'react';
import { signUpApi } from '../services/AuthService';
import { SignUpModel, ApiResponse, ApiErrorResponse } from '../models/AuthModel';
import { TokenStorage } from '../storage/TokenStorage';
import { UserStorage } from '../storage/UserStorage';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export const useSignUpViewModel = () => {
  const [firstName,       setFirstName]       = useState('');
  const [lastName,        setLastName]        = useState('');
  const [email,           setEmail]           = useState('');
  const [address,         setAddress]         = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage,    setProfileImage]    = useState<string | null>(null);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState<string | null>(null);
  const [successMessage,  setSuccessMessage]  = useState<string | null>(null);
  const [accessToken,     setAccessToken]     = useState<string | null>(null);

  // ── Validation ───────────────────────────────────────────
  const validate = useCallback((): string | null => {
    if (!firstName.trim())
      return 'Please enter your first name.';
    if (!lastName.trim())
      return 'Please enter your last name.';
    if (!email.trim())
      return 'Please enter your email address.';
    if (!EMAIL_REGEX.test(email.trim()))
      return 'Please enter a valid email address.';
    if (!address.trim())
      return 'Please enter your address.';
    if (!password)
      return 'Please enter a password.';
    if (password.length < MIN_PASSWORD_LENGTH)
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    if (!confirmPassword)
      return 'Please confirm your password.';
    if (password !== confirmPassword)
      return 'Passwords do not match.';
    return null;
  }, [firstName, lastName, email, address, password, confirmPassword]);

  // ── Sign Up ──────────────────────────────────────────────
  const signUp = useCallback(async () => {
    if (loading) return;

    setError(null);
    setSuccessMessage(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload: SignUpModel = {
      firstName:       firstName.trim(),
      lastName:        lastName.trim(),
      email:           email.trim().toLowerCase(),
      address:         address.trim(),
      password,
      confirmPassword,        // kept in model for local use
      profileImage,           // kept for future upload support
    };

    try {
      setLoading(true);

      const response: ApiResponse = await signUpApi(payload);

      // ✅ Persist token and user — same pattern as login
      await Promise.all([
        TokenStorage.saveToken(response.accessToken),
        UserStorage.saveUser(response.user),
      ]);

      setAccessToken(response.accessToken);
      setSuccessMessage(response.message); // "User registered successfully"

    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [
    firstName, lastName, email, address,
    password, confirmPassword, profileImage,
    loading, validate,
  ]);

  return {
    firstName, lastName, email, address,
    password, confirmPassword, profileImage,
    loading, error, successMessage, accessToken,
    setFirstName, setLastName, setEmail,
    setAddress, setPassword, setConfirmPassword,
    setProfileImage, signUp,
  };
};