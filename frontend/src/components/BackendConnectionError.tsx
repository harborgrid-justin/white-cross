import React from 'react';
import { AlertTriangle, RefreshCw, Settings } from 'lucide-react';

interface BackendConnectionErrorProps {
  onRetry?: () => void;
  className?: string;
}

export const BackendConnectionError: React.FC<BackendConnectionErrorProps> = ({ 
  onRetry, 
  className = '' 
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${className}`}>
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Connection Error
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Unable to connect to the backend server. Please check your connection and try again.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry Connection</span>
          </button>
          
          <div className="text-center">
            <span className="text-xs text-gray-400">
              If the problem persists, contact your administrator
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <details className="text-sm">
            <summary className="cursor-pointer text-gray-700 font-medium flex items-center space-x-1">
              <Settings className="h-4 w-4" />
              <span>Troubleshooting Tips</span>
            </summary>
            <div className="mt-2 text-xs text-gray-600 space-y-1">
              <p>• Check your internet connection</p>
              <p>• Verify the server is running</p>
              <p>• Try refreshing the page</p>
              <p>• Contact IT support if issues persist</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default BackendConnectionError;