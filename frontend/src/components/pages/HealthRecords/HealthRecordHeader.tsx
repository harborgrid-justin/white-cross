/**
 * @fileoverview Health Record Detail Page Header Component
 * 
 * Header component for health record detail page with navigation and actions.
 * 
 * @module components/pages/HealthRecords/HealthRecordHeader
 * @since 1.0.0
 */

import Link from 'next/link';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HealthRecordHeaderProps {
  recordId: string;
  recordDate: string;
}

/**
 * Health Record Header Component
 * 
 * Renders header with navigation and action buttons for health record detail page.
 */
export function HealthRecordHeader({ recordId, recordDate }: HealthRecordHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button href="/health-records" variant="secondary" leftIcon={<ArrowLeft />}>
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Record</h1>
          <p className="mt-1 text-gray-600">
            {new Date(recordDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex space-x-3">
        <Button href={`/health-records/${recordId}/edit`} leftIcon={<Edit />}>
          Edit Record
        </Button>
        <Button variant="destructive" leftIcon={<Trash2 />}>
          Delete
        </Button>
      </div>
    </div>
  );
}



