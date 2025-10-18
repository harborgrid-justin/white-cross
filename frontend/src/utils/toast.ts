/**
 * WF-COMP-353 | toast.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react-hot-toast
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, named exports | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import toast from 'react-hot-toast'

export const showSuccessToast = (message: string) => {
  const toastId = toast.success(message)
  // Add data-testid after the toast is created
  setTimeout(() => {
    const toastElement = document.querySelector(`[data-toast-id="${toastId}"]`)
    if (toastElement) {
      toastElement.setAttribute('data-testid', 'success-toast')
    }
  }, 10)
  return toastId
}

export const showErrorToast = (message: string) => {
  const toastId = toast.error(message)
  // Add data-testid after the toast is created
  setTimeout(() => {
    const toastElement = document.querySelector(`[data-toast-id="${toastId}"]`)
    if (toastElement) {
      toastElement.setAttribute('data-testid', 'error-toast')
    }
  }, 10)
  return toastId
}

export { toast }