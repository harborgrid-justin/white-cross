/**
 * @fileoverview Immunizations Not Found Page
 * @module app/(dashboard)/immunizations/not-found
 *
 * 404 page for immunizations module.
 *
 * @since 1.0.0
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function ImmunizationsNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-6 py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
          <FileQuestion className="h-8 w-8 text-blue-600" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Immunization Record Not Found
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The immunization record or page you're looking for doesn't exist or has been removed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/immunizations">
            <Button variant="default" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Immunizations
            </Button>
          </Link>
          
          <Link href="/immunizations/compliance">
            <Button variant="outline" size="lg">
              View Compliance Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? <Link href="/help" className="text-blue-600 hover:text-blue-700 font-medium">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
