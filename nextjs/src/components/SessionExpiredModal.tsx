/**
 * Session Expired Modal
 * Displays a modal when user session expires
 */

import React from 'react';

export interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Session Expired</h2>
        <p className="mb-6 text-gray-600">
          Your session has expired for security reasons. Please log in again to continue.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
          >
            Close
          </button>
          <button
            onClick={onLogin}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
