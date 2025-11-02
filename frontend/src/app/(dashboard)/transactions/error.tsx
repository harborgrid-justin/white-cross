'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle, RefreshCcw, Home, CreditCard } from 'lucide-react';

interface TransactionsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TransactionsError({ error, reset }: TransactionsErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Transactions page error:', error);
  }, [error]);

  const getErrorMessage = () => {
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Unable to connect to the financial services. Please check your internet connection.';
    }
    
    if (error.message.includes('unauthorized') || error.message.includes('403')) {
      return 'You do not have permission to view financial transactions. Please contact your administrator.';
    }
    
    if (error.message.includes('timeout')) {
      return 'The request is taking too long. The financial system may be experiencing high traffic.';
    }
    
    return 'An unexpected error occurred while loading the transactions data.';
  };

  const getErrorSuggestions = () => {
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return [
        'Check your internet connection',
        'Verify the financial system is accessible',
        'Try refreshing the page',
      ];
    }
    
    if (error.message.includes('unauthorized') || error.message.includes('403')) {
      return [
        'Contact your system administrator',
        'Verify your account has financial access permissions',
        'Try logging out and back in',
      ];
    }
    
    return [
      'Try refreshing the page',
      'Check if the issue persists',
      'Contact technical support if the problem continues',
    ];
  };

  return (
    <div className="flex h-screen items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Error Title */}
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-gray-900">
              Financial System Error
            </h1>
            <p className="text-gray-600">
              {getErrorMessage()}
            </p>
          </div>

          {/* Error Details */}
          {error.digest && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">
                Error ID: <code className="font-mono">{error.digest}</code>
              </p>
            </div>
          )}

          {/* Suggestions */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">What you can try:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {getErrorSuggestions().map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </button>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Home className="h-4 w-4" />
              Go to Dashboard
            </button>
          </div>

          {/* Financial System Status */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <CreditCard className="h-4 w-4" />
              <span>Financial System Status</span>
            </div>
            
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Payment Processing</span>
                <span className="text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Transaction Records</span>
                <span className="text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Financial Reporting</span>
                <span className="text-yellow-600">Limited</span>
              </div>
            </div>
          </div>

          {/* Support Contact */}
          <div className="text-xs text-gray-500">
            Need help? Contact support at{' '}
            <a 
              href="mailto:support@whitecross.health" 
              className="text-blue-600 hover:underline"
            >
              support@whitecross.health
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}


