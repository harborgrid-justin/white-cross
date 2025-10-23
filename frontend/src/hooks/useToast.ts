/**
 * Toast Hook
 * Provides toast notification functionality
 */

import { useCallback } from 'react';
import { toast } from 'sonner';

export const useToast = () => {
  const showSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const showInfo = useCallback((message: string) => {
    toast.info(message);
  }, []);

  const showWarning = useCallback((message: string) => {
    toast.warning(message);
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    toast,
  };
};

export default useToast;
