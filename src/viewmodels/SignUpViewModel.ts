import { useState, useCallback } from 'react';
import { signUpApi } from '../services/AuthService';
import { SignUpModel } from '../models/AuthModel';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export const useSignUpViewModel = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!firstName.trim()) return 'Please enter your first name.';
    if (!lastName.trim()) return 'Please enter your last name.';
    if (!email.trim()) return 'Please enter your email address.';
    if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email address.';
    if (!address.trim()) return 'Please enter your address.';
    if (!password) return 'Please enter a password.';
    if (password.length < MIN_PASSWORD_LENGTH)
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    if (!confirmPassword) return 'Please confirm your password.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

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
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      address: address.trim(),
      password,
      confirmPassword,
      profileImage,
    };

    try {
      setLoading(true);
      const response = await signUpApi(payload);
      setSuccessMessage(response.message);
    } catch (err) {
      const apiError = err as { message?: string };
      setError(apiError.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [firstName, lastName, email, address, password, confirmPassword, profileImage, loading]);

  const resetForm = useCallback(() => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setAddress('');
    setPassword('');
    setConfirmPassword('');
    setProfileImage(null);
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    firstName, lastName, email, address,
    password, confirmPassword, profileImage,
    loading, error, successMessage,
    setFirstName, setLastName, setEmail,
    setAddress, setPassword, setConfirmPassword,
    setProfileImage, signUp, resetForm,
  };
};