'use client';

/**
 * Emergency Contacts Error Page
 */

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function EmergencyContactsError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/students"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Students
      </Link>

      {/* Error Card */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Emergency Contacts
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-sm mb-6">
            {error.message || 'Something went wrong while loading the emergency contacts.'}
          </p>
          <div className="flex gap-3">
            <Button onClick={reset} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Link href="/students">
              <Button>
                Go to Students
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}