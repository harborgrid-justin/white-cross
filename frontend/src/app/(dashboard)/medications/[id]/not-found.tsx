/**
 * Medication Not Found Page
 * Displayed when a medication ID doesn't exist
 *
 * @module app/(dashboard)/medications/[id]/not-found
 */

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/layout/Card';
import { AlertTriangle, ArrowLeft, Pill } from 'lucide-react';

/**
 * Not Found Page for Medication Details
 *
 * Displays a user-friendly message when a medication cannot be found.
 * May indicate the medication was discontinued, archived, or the ID is invalid.
 */
export default function MedicationNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <Card className="max-w-md w-full">
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Medication Not Found
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The medication you're looking for doesn't exist, has been discontinued, or you don't have permission to view it.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/medications">
              <Button variant="primary">
                <Pill className="h-4 w-4 mr-2" />
                All Medications
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Medication records are subject to HIPAA privacy regulations.</p>
            <p className="mt-1">Contact your administrator if you need access.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
