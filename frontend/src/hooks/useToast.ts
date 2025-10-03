import { useState } from 'react'

export const useToast = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const showSuccess = (message?: string) => {
    setShowSuccessMessage(true)
    
    // Create and show toast
    const toast = document.createElement('div')
    toast.setAttribute('data-testid', 'success-toast')
    toast.className = 'fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'
    toast.textContent = message || 'Operation completed successfully!'
    document.body.appendChild(toast)
    
    setTimeout(() => {
      setShowSuccessMessage(false)
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 3000)
  }

  const showError = (message: string) => {
    const toast = document.createElement('div')
    toast.setAttribute('data-testid', 'error-toast')
    toast.className = 'fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'
    toast.textContent = message
    document.body.appendChild(toast)
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 3000)
  }

  return {
    showSuccessMessage,
    showSuccess,
    showError,
  }
}