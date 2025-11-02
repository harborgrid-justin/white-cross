'use client';

/**
 * AdministrationRecordDetail Component
 */

import React from 'react';
import { type AdministrationRecord } from './administration/AdministrationLog';
import { Button } from '@/components/ui/button';

export interface AdministrationRecordDetailProps {
  record: AdministrationRecord;
  onClose?: () => void;
  onEdit?: () => void;
}

export const AdministrationRecordDetail: React.FC<AdministrationRecordDetailProps> = ({
  record,
  onClose,
  onEdit,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Administration Record</h2>
          <p className="text-sm text-gray-600 mt-1">{new Date(record.administeredAt).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Medication</dt>
            <dd className="mt-1 text-sm text-gray-900 font-medium">{record.medicationName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Student</dt>
            <dd className="mt-1 text-sm text-gray-900">{record.studentName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Dosage Given</dt>
            <dd className="mt-1 text-sm text-gray-900">{record.dosageGiven}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Route</dt>
            <dd className="mt-1 text-sm text-gray-900">{record.route}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Administered By</dt>
            <dd className="mt-1 text-sm text-gray-900">{record.administeredBy}</dd>
          </div>
          {record.witnessedBy && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Witnessed By</dt>
              <dd className="mt-1 text-sm text-gray-900">{record.witnessedBy}</dd>
            </div>
          )}
        </dl>
      </div>

      {record.refusedByStudent && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Medication Refused</h3>
          {record.refusalReason && <p className="text-sm text-red-800">{record.refusalReason}</p>}
        </div>
      )}

      {record.reactions && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Reactions/Side Effects</h3>
          <p className="text-sm text-yellow-800">{record.reactions}</p>
        </div>
      )}

      {record.notes && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
          <p className="text-sm text-gray-900">{record.notes}</p>
        </div>
      )}
    </div>
  );
};

AdministrationRecordDetail.displayName = 'AdministrationRecordDetail';

export default AdministrationRecordDetail;


