/**
 * @fileoverview Login Page Header Component
 * 
 * Header component for the login page displaying title and subtitle.
 * 
 * @module components/auth/LoginForm/LoginHeader
 * @since 1.0.0
 */

/**
 * Login Header Component
 * 
 * Renders the login page header with title and description.
 */
export function LoginHeader() {
  return (
    <div>
      <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to White Cross
      </h1>
      <p className="mt-2 text-center text-sm text-gray-600">
        School Health Management System
      </p>
    </div>
  );
}
