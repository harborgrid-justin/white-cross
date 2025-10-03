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