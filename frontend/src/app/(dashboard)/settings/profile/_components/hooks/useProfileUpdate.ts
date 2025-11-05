/**
 * @fileoverview Custom hook for handling profile updates
 * @module app/(dashboard)/profile/_components/hooks/useProfileUpdate
 * @category Profile - Hooks
 */

'use client';

import { useState, useCallback } from 'react';
import { updateProfileFromForm, type UserProfile } from '@/lib/actions/profile.actions';

interface UseProfileUpdateReturn {
  updateProfile: (userId: string, formData: FormData) => Promise<UserProfile | null>;
  updating: boolean;
  updateError: string | null;
  clearUpdateError: () => void;
}

/**
 * Custom hook for managing profile update operations
 * Handles form submission, loading states, and error handling
 */
export function useProfileUpdate(): UseProfileUpdateReturn {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateProfile = useCallback(async (userId: string, formData: FormData): Promise<UserProfile | null> => {
    try {
      setUpdating(true);
      setUpdateError(null);

      const result = await updateProfileFromForm(userId, formData);

      if (result.success && result.data) {
        return result.data;
      } else {
        setUpdateError(result.error || 'Failed to update profile');
        return null;
      }
    } catch (err) {
      setUpdateError('Failed to update profile. Please try again.');
      return null;
    } finally {
      setUpdating(false);
    }
  }, []);

  const clearUpdateError = useCallback(() => {
    setUpdateError(null);
  }, []);

  return {
    updateProfile,
    updating,
    updateError,
    clearUpdateError
  };
}
