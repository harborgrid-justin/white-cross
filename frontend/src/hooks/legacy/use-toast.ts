/**
 * Toast Hook
 *
 * Provides toast notification functionality for the application.
 * Based on Next.js patterns with client-side state management.
 */

'use client'

import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  duration?: number
}

interface ToastState {
  toasts: Toast[]
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    // Toast will be removed by state update
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * Hook for managing toast notifications
 */
export function useToast() {
  const [state, setState] = useState<ToastState>({
    toasts: []
  })

  const toast = useCallback(
    ({
      title,
      description,
      variant = 'default',
      duration = 5000,
      ...props
    }: Omit<Toast, 'id'>) => {
      const id = genId()

      const update = (props: Partial<Toast>) => {
        setState((state) => ({
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === id ? { ...t, ...props } : t
          )
        }))
      }

      const dismiss = () => {
        setState((state) => ({
          ...state,
          toasts: state.toasts.filter((t) => t.id !== id)
        }))
      }

      setState((state) => {
        const newToasts = [
          ...state.toasts.slice(-(TOAST_LIMIT - 1)),
          {
            id,
            title,
            description,
            variant,
            duration,
            ...props
          }
        ]

        return {
          ...state,
          toasts: newToasts
        }
      })

      if (duration && duration > 0) {
        setTimeout(() => {
          dismiss()
        }, duration)
      }

      return {
        id,
        dismiss,
        update
      }
    },
    []
  )

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      addToRemoveQueue(toastId)
      setState((state) => ({
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId)
      }))
    } else {
      state.toasts.forEach((toast) => {
        addToRemoveQueue(toast.id)
      })
      setState((state) => ({
        ...state,
        toasts: []
      }))
    }
  }, [state.toasts])

  return {
    ...state,
    toast,
    dismiss
  }
}

export default useToast
