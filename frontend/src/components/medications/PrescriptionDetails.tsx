'use client';

/**
 * PrescriptionDetails Component
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { type Prescription } from './PrescriptionsList';

export interface PrescriptionDetailsProps {
  prescription: Prescription & {
    pharmacy?: string;
    quantity?: string;
    directions?: string;
    notes?: string;
  };
  onClose?: () => void;
  onRequestRefill?: () => void;
}

export const PrescriptionDetails: React.FC<PrescriptionDetailsProps> = ({
  prescription,
  onClose,
  onRequestRefill,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prescription Details</h2>
          <p className="text-sm text-gray-600 mt-1">Rx #{prescription.prescriptionNumber}</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Medication</dt>
            <dd className="mt-1 text-sm text-gray-900 font-medium">{prescription.medicationName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Prescriber</dt>
            <dd className="mt-1 text-sm text-gray-900">{prescription.prescriber}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Date Issued</dt>
            <dd className="mt-1 text-sm text-gray-900">{prescription.dateIssued}</dd>
          </div>
          {prescription.expirationDate && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Expiration Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{prescription.expirationDate}</dd>
            </div>
          )}
          <div>
            <dt className="text-sm font-medium text-gray-500">Refills Authorized</dt>
            <dd className="mt-1 text-sm text-gray-900">{prescription.refillsAuthorized}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Refills Remaining</dt>
            <dd className="mt-1 text-sm text-gray-900">{prescription.refillsRemaining}</dd>
          </div>
          {prescription.pharmacy && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Pharmacy</dt>
              <dd className="mt-1 text-sm text-gray-900">{prescription.pharmacy}</dd>
            </div>
          )}
          {prescription.quantity && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Quantity</dt>
              <dd className="mt-1 text-sm text-gray-900">{prescription.quantity}</dd>
            </div>
          )}
        </dl>
      </div>

      {prescription.directions && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Directions</h3>
          <p className="text-sm text-gray-900">{prescription.directions}</p>
        </div>
      )}

      {prescription.notes && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
          <p className="text-sm text-gray-900">{prescription.notes}</p>
        </div>
      )}

      {onRequestRefill && prescription.status === 'active' && prescription.refillsRemaining > 0 && (
        <Button variant="default" onClick={onRequestRefill} fullWidth>
          Request Refill
        </Button>
      )}
    </div>
  );
};

PrescriptionDetails.displayName = 'PrescriptionDetails';

export default PrescriptionDetails;



