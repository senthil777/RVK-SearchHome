import { useState, useCallback } from 'react';
import { loginApi } from '../services/AuthService';
import { LoginModel, ApiResponse, ApiErrorResponse } from '../models/AuthModel';
import { TokenStorage } from '../storage/TokenStorage';
import { UserStorage } from '../storage/UserStorage';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export const useLoginViewModel = () => {
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [accessToken, setAccessToken]       = useState<string | null>(null);

  const validate = useCallback((): string | null => {
    if (!email.trim())
      return 'Please enter your email address.';
    if (!EMAIL_REGEX.test(email.trim()))
      return 'Please enter a valid email address.';
    if (!password)
      return 'Please enter your password.';
    if (password.length < MIN_PASSWORD_LENGTH)
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    return null;
  }, [email, password]);

  const login = useCallback(async () => {
    if (loading) return;

    setError(null);
    setSuccessMessage(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const credentials: LoginModel = {
      email: email.trim().toLowerCase(),
      password,
    };

    try {
      setLoading(true);

      const response: ApiResponse = await loginApi(credentials);

      // ✅ Persist token and user to local storage
      await Promise.all([
        TokenStorage.saveToken(response.accessToken),
        UserStorage.saveUser(response.user),
      ]);

      // ✅ Update state to trigger navigation
      setAccessToken(response.accessToken);
      setSuccessMessage(response.message);

    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, password, loading, validate]);

  return {
    email,
    password,
    loading,
    error,
    successMessage,
    accessToken,
    setEmail,
    setPassword,
    login,
  };
};