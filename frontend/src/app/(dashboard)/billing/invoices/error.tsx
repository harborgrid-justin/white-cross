'use client';

/**
 * Invoice Routes Error Boundary
 * Catches and handles errors specifically in invoice-related pages
 *
 * @module app/(dashboard)/billing/invoices/error
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, FileText, ArrowLeft, Home } from 'lucide-react';

interface InvoiceErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Boundary for Invoice Routes
 *
 * Displays a user-friendly error page specifically for invoice-related errors.
 * Provides contextual actions and maintains invoice workflow continuity.
 */
export default function InvoiceError({ error, reset }: InvoiceErrorProps) {
  useEffect(() => {
    // Log error to monitoring service with invoice context
    console.error('[Invoice Error]', error);

    // TODO: Send to external monitoring service with invoice context
    // Example: Sentry.captureException(error, {
    //   tags: { 
    //     route: 'billing/invoices', 
    //     priority: 'high', 
    //     category: 'financial',
    //     feature: 'invoicing'
    //   },
    //   level: 'error'
    // });

    // TODO: Audit log for invoice operation failures
    // auditLog({
    //   action: 'INVOICE_ERROR',
    //   resource: 'Invoice',
    //   success: false,
    //   errorMessage: error.message,
    //   timestamp: new Date().toISOString()
    // });
  }, [error]);

  // Determine error type for better user messaging
  const getErrorMessage = () => {
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return {
        title: 'Connection Error',
        description: 'Unable to connect to the billing system. Please check your internet connection and try again.',
        suggestion: 'If the problem persists, your invoice data is safe and no changes have been lost.'
      };
    }
    
    if (errorMessage.includes('payment') || errorMessage.includes('charge')) {
      return {
        title: 'Payment Processing Error',
        description: 'There was an issue processing the payment information. No charges have been made.',
        suggestion: 'Please verify payment details and try again, or contact support for assistance.'
      };
    }
    
    if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
      return {
        title: 'Invoice Validation Error',
        description: 'Some invoice information appears to be invalid or incomplete.',
        suggestion: 'Please review your invoice details and ensure all required fields are properly filled.'
      };
    }
    
    if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
      return {
        title: 'Access Permission Error',
        description: 'You do not have permission to perform this invoice operation.',
        suggestion: 'Please contact your administrator if you believe this is incorrect.'
      };
    }
    
    return {
      title: 'Invoice System Error',
      description: 'An unexpected error occurred while processing your invoice request.',
      suggestion: 'Your invoice data is secure. Please try again or contact support if the issue continues.'
    };
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4 py-16">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {errorInfo.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {errorInfo.description}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {errorInfo.suggestion}
            </p>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Technical Details (Development Only)
              </summary>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-32">
                {error.message}
              </pre>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Stack: {error.stack?.substring(0, 200)}...
              </p>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="default" 
              onClick={reset}
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Link href="/dashboard/billing/invoices" className="flex-1">
              <Button variant="secondary" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                All Invoices
              </Button>
            </Link>
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-col sm:flex-row gap-2 text-center">
            <Link href="/dashboard/billing/invoices/new" className="flex-1">
              <Button variant="ghost" size="sm" className="w-full">
                Create New Invoice
              </Button>
            </Link>
            <Link href="/dashboard/billing" className="flex-1">
              <Button variant="ghost" size="sm" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Billing Home
              </Button>
            </Link>
          </div>

          {/* Help Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">i</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                  Your Data is Safe
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  No invoice data has been lost or corrupted. All your information remains secure and accessible.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Need help? Contact your system administrator or 
              <br />
              <button className="text-blue-600 hover:text-blue-500 underline">
                submit a support ticket
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
