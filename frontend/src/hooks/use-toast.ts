/**
 * Toast Notification Hook
 * Provides toast notification functionality for user feedback
 */

'use client';

import { useState, useCallback } from 'react';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  duration?: number;
}

interface ToastState {
  toasts: ToastProps[];
}

let toastCount = 0;

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] });

  const toast = useCallback(
    ({ title, description, variant = 'default', duration = 5000 }: Omit<ToastProps, 'id'>) => {
      const id = `toast-${++toastCount}`;
      const newToast: ToastProps = { id, title, description, variant, duration };

      setState((prev) => ({
        toasts: [...prev.toasts, newToast],
      }));

      // Auto dismiss
      if (duration > 0) {
        setTimeout(() => {
          setState((prev) => ({
            toasts: prev.toasts.filter((t) => t.id !== id),
          }));
        }, duration);
      }

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setState((prev) => ({
      toasts: prev.toasts.filter((t) => t.id !== id),
    }));
  }, []);

  return {
    toast,
    dismiss,
    toasts: state.toasts,
  };
}
