/**
 * Access Denied Component
 *
 * Displays an access denied message when user lacks required permissions.
 *
 * @module components/AccessDenied
 */

import React from 'react';
import { Link } from 'react-router-dom';

export interface AccessDeniedProps {
  message?: string;
  returnUrl?: string;
  className?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = 'You do not have permission to access this resource.',
  returnUrl = '/',
  className = '',
}) => {
  return (
    <div className={`flex min-h-screen items-center justify-center bg-gray-100 ${className}`}>
      <div className="max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-4 flex justify-center">
          <svg
            className="h-16 w-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-800">Access Denied</h1>
        <p className="mb-6 text-center text-gray-600">{message}</p>
        <div className="flex justify-center">
          <Link
            to={returnUrl}
            className="rounded bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
