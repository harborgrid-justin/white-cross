/**
 * @fileoverview Record Details Card Component
 * 
 * Card component displaying detailed health record information.
 * 
 * @module components/pages/HealthRecords/RecordDetailsCard
 * @since 1.0.0
 */

import { Calendar, FileText } from 'lucide-react';
import { Card } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';

interface HealthRecord {
  id: string;
  recordType: string;
  recordDate: string;
  provider?: string;
  description?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
}

interface RecordDetailsCardProps {
  record: HealthRecord;
}

/**
 * Record Details Card Component
 * 
 * Renders detailed health record information in a card layout.
 */
export function RecordDetailsCard({ record }: RecordDetailsCardProps) {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Record Details</h2>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Record Type</p>
            <div className="mt-1">
              <Badge variant="info">{record.recordType.replace('_', ' ')}</Badge>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Record Date</p>
            <div className="mt-1 flex items-center text-sm text-gray-900">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              {new Date(record.recordDate).toLocaleDateString()}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Healthcare Provider</p>
            <p className="mt-1 text-sm text-gray-900">{record.provider || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Follow-up Required</p>
            <div className="mt-1">
              <Badge variant={record.followUpRequired ? 'warning' : 'success'}>
                {record.followUpRequired ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        </div>

        {record.followUpRequired && record.followUpDate && (
          <div>
            <p className="text-sm font-medium text-gray-500">Follow-up Date</p>
            <div className="mt-1 flex items-center text-sm text-gray-900">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              {new Date(record.followUpDate).toLocaleDateString()}
            </div>
          </div>
        )}

        {record.description && (
          <div>
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
              {record.description}
            </p>
          </div>
        )}

        {record.diagnosis && (
          <div>
            <p className="text-sm font-medium text-gray-500">Diagnosis</p>
            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{record.diagnosis}</p>
          </div>
        )}

        {record.treatment && (
          <div>
            <p className="text-sm font-medium text-gray-500">Treatment</p>
            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{record.treatment}</p>
          </div>
        )}

        {record.notes && (
          <div>
            <p className="text-sm font-medium text-gray-500">Additional Notes</p>
            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{record.notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
