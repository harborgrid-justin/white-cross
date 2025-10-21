import React from 'react';
import { AlertTriangle, LogOut, RefreshCw } from 'lucide-react';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  isOpen,
  onClose,
  onRefresh,
  onLogout
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Session Expired</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Your session has expired for security reasons. Please refresh to continue 
          or log out to sign in again.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;