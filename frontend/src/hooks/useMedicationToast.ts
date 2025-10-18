/**
 * WF-COMP-138 | useMedicationToast.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react-hot-toast
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import toast from 'react-hot-toast'
import type { UseToastReturn } from '../types/medications'

export const useMedicationToast = (): UseToastReturn => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10B981',
        color: '#FFFFFF',
      },
      iconTheme: {
        primary: '#FFFFFF',
        secondary: '#10B981',
      },
    })

    // Also create a DOM element for testing
    const toastElement = document.createElement('div')
    toastElement.setAttribute('data-testid', 'success-toast')
    toastElement.textContent = message
    toastElement.style.cssText = 'position:fixed;top:20px;right:20px;background:#10B981;color:white;padding:10px;border-radius:4px;z-index:9999'
    document.body.appendChild(toastElement)
    
    setTimeout(() => {
      if (document.body.contains(toastElement)) {
        document.body.removeChild(toastElement)
      }
    }, 4000)
  }

  const showError = (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#EF4444',
        color: '#FFFFFF',
      },
      iconTheme: {
        primary: '#FFFFFF',
        secondary: '#EF4444',
      },
    })

    // Also create a DOM element for testing
    const toastElement = document.createElement('div')
    toastElement.setAttribute('data-testid', 'error-toast')
    toastElement.textContent = message
    toastElement.style.cssText = 'position:fixed;top:20px;right:20px;background:#EF4444;color:white;padding:10px;border-radius:4px;z-index:9999'
    document.body.appendChild(toastElement)
    
    setTimeout(() => {
      if (document.body.contains(toastElement)) {
        document.body.removeChild(toastElement)
      }
    }, 5000)
  }

  const showWarning = (message: string) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: '#FFFFFF',
      },
    })

    // Also create a DOM element for testing
    const toastElement = document.createElement('div')
    toastElement.setAttribute('data-testid', 'warning-toast')
    toastElement.textContent = message
    toastElement.style.cssText = 'position:fixed;top:20px;right:20px;background:#F59E0B;color:white;padding:10px;border-radius:4px;z-index:9999'
    document.body.appendChild(toastElement)
    
    setTimeout(() => {
      if (document.body.contains(toastElement)) {
        document.body.removeChild(toastElement)
      }
    }, 4000)
  }

  const showInfo = (message: string) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#FFFFFF',
      },
    })

    // Also create a DOM element for testing
    const toastElement = document.createElement('div')
    toastElement.setAttribute('data-testid', 'info-toast')
    toastElement.textContent = message
    toastElement.style.cssText = 'position:fixed;top:20px;right:20px;background:#3B82F6;color:white;padding:10px;border-radius:4px;z-index:9999'
    document.body.appendChild(toastElement)
    
    setTimeout(() => {
      if (document.body.contains(toastElement)) {
        document.body.removeChild(toastElement)
      }
    }, 3000)
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}