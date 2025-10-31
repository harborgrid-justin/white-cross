/**
 * Dashboard Route Not Found Page
 * Displayed when a dashboard page doesn't exist
 *
 * @module app/(dashboard)/not-found
 */

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/layout/Card';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

/**
 * Not Found Page for Dashboard Routes
 *
 * Displays a user-friendly message when a dashboard page cannot be found.
 * Provides navigation back to dashboard or home.
 */
export default function DashboardNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <Card className="max-w-md w-full">
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Page Not Found
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or you don't have permission to access it.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard">
              <Button variant="primary">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>If you believe you should have access to this page, contact your administrator.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
