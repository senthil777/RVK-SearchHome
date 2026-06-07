import { useState, useCallback } from 'react';
import { forgotPasswordApi } from '../services/AuthService';
import { ForgotPasswordModel, ApiResponse } from '../models/AuthModel';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useForgotPasswordViewModel = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submitForgotPassword = useCallback(async () => {
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

    const payload: ForgotPasswordModel = {
      email: email.trim().toLowerCase(),
    };

    try {
      setLoading(true);
      const response: ApiResponse = await forgotPasswordApi(payload);
      setSuccessMessage(response.message);
      setEmail('');
    } catch (err) {
      const apiError = err as ApiResponse;
      setError(apiError.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, loading]);

  const resetState = useCallback(() => {
    setEmail('');
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    email,
    loading,
    error,
    successMessage,
    setEmail,
    submitForgotPassword,
    resetState,
  };
};