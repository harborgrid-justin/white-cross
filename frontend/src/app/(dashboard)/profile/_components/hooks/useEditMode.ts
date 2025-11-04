/**
 * @fileoverview Custom hook for managing component edit modes
 * @module app/(dashboard)/profile/_components/hooks/useEditMode
 * @category Profile - Hooks
 */

'use client';

import { useState, useCallback } from 'react';

interface UseEditModeReturn {
  isEditing: boolean;
  startEditing: () => void;
  cancelEditing: () => void;
  toggleEditing: () => void;
}

/**
 * Custom hook for managing edit mode state
 * Provides simple interface for toggling edit states in forms
 */
export function useEditMode(initialState: boolean = false): UseEditModeReturn {
  const [isEditing, setIsEditing] = useState(initialState);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const toggleEditing = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  return {
    isEditing,
    startEditing,
    cancelEditing,
    toggleEditing
  };
}
