import { useState, useCallback } from 'react';
import { loginApi } from '../services/AuthService';
import { LoginModel, ApiResponse } from '../models/AuthModel';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export const useLoginViewModel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const login = useCallback(async () => {
    if (loading) return;

    setError(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    const credentials: LoginModel = {
      email: email.trim().toLowerCase(),
      password,
    };

    try {
      setLoading(true);
      
    console.log('Error response data:', credentials);
      const response: ApiResponse = await loginApi(credentials);
      setSuccessMessage(response.accessToken);
    } catch (err) {
      const apiError = err as ApiResponse;
      setError(apiError.accessToken ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, password, loading]);

  return {
    email,
    password,
    loading,
    error,
    successMessage,
    setEmail,
    setPassword,
    login,
  };
};