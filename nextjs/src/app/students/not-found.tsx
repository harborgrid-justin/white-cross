/**
 * Student Not Found Page
 * Displayed when a student ID doesn't exist
 *
 * @module app/students/not-found
 */

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/buttons/Button';
import { Card } from '@/components/ui/layout/Card';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

/**
 * Not Found Page
 *
 * Displays a user-friendly message when a student cannot be found.
 */
export default function StudentNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <Card className="max-w-md w-full">
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Student Not Found
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The student you're looking for doesn't exist or has been removed from the system.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/students">
              <Button variant="primary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Students
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
