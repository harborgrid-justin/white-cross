/**
 * @fileoverview Custom hook for password change functionality
 * @module app/(dashboard)/profile/_components/hooks/usePasswordChange
 * @category Profile - Hooks
 */

'use client';

import { useState, useCallback } from 'react';
import { changePasswordFromForm } from '@/lib/actions/profile.actions';

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showCurrent: boolean;
  showNew: boolean;
  showConfirm: boolean;
}

interface UsePasswordChangeReturn {
  passwordForm: PasswordFormState;
  setPasswordForm: React.Dispatch<React.SetStateAction<PasswordFormState>>;
  changePassword: (userId: string) => Promise<boolean>;
  resetPasswordForm: () => void;
  changing: boolean;
  changeError: string | null;
  validatePassword: () => string | null;
}

const initialPasswordForm: PasswordFormState = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  showCurrent: false,
  showNew: false,
  showConfirm: false
};

/**
 * Custom hook for managing password change operations
 * Handles form state, validation, and submission
 */
export function usePasswordChange(): UsePasswordChangeReturn {
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(initialPasswordForm);
  const [changing, setChanging] = useState(false);
  const [changeError, setChangeError] = useState<string | null>(null);

  const validatePassword = useCallback((): string | null => {
    if (!passwordForm.currentPassword) {
      return 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      return 'New password is required';
    }
    if (passwordForm.newPassword.length < 8) {
      return 'New password must be at least 8 characters';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return 'Passwords do not match';
    }
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      return 'New password must be different from current password';
    }
    return null;
  }, [passwordForm]);

  const changePassword = useCallback(async (userId: string): Promise<boolean> => {
    const validationError = validatePassword();
    if (validationError) {
      setChangeError(validationError);
      return false;
    }

    try {
      setChanging(true);
      setChangeError(null);

      const formData = new FormData();
      formData.append('currentPassword', passwordForm.currentPassword);
      formData.append('newPassword', passwordForm.newPassword);
      formData.append('confirmPassword', passwordForm.confirmPassword);

      const result = await changePasswordFromForm(userId, formData);

      if (result.success) {
        return true;
      } else {
        setChangeError(result.error || 'Failed to change password');
        return false;
      }
    } catch (err) {
      setChangeError('Failed to change password. Please try again.');
      return false;
    } finally {
      setChanging(false);
    }
  }, [passwordForm, validatePassword]);

  const resetPasswordForm = useCallback(() => {
    setPasswordForm(initialPasswordForm);
    setChangeError(null);
  }, []);

  return {
    passwordForm,
    setPasswordForm,
    changePassword,
    resetPasswordForm,
    changing,
    changeError,
    validatePassword
  };
}
