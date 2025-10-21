import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

interface AccessDeniedProps {
  message?: string;
  onGoBack?: () => void;
  className?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ 
  message = "You don't have permission to access this page.",
  onGoBack,
  className = '' 
}) => {
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${className}`}>
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Access Denied
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            {message}
          </p>
          
          <div className="mt-6">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            If you believe this is an error, please contact your administrator.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;