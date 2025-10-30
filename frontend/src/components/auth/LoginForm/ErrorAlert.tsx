/**
 * @fileoverview Login Form Error Alert Component
 * 
 * Error alert component for displaying authentication and validation errors.
 * 
 * @module components/auth/LoginForm/ErrorAlert
 * @since 1.0.0
 */

interface ErrorAlertProps {
  error: string;
}

/**
 * Error Alert Component
 * 
 * Displays error messages with proper accessibility attributes.
 */
export function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <div
      className="rounded-md bg-red-50 p-4"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{error}</h3>
        </div>
      </div>
    </div>
  );
}
