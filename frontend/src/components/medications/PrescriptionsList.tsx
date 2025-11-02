'use client';

/**
 * PrescriptionsList Component
 */

import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmptyState } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export interface Prescription {
  id: string;
  medicationName: string;
  prescriptionNumber: string;
  prescriber: string;
  dateIssued: string;
  expirationDate?: string;
  refillsAuthorized: number;
  refillsRemaining: number;
  status: 'active' | 'expired' | 'filled' | 'cancelled';
}

export interface PrescriptionsListProps {
  prescriptions: Prescription[];
  isLoading?: boolean;
  onViewDetails?: (prescriptionId: string) => void;
  onRequestRefill?: (prescriptionId: string) => void;
}

export const PrescriptionsList: React.FC<PrescriptionsListProps> = ({
  prescriptions,
  isLoading,
  onViewDetails,
  onRequestRefill,
}) => {
  const getStatusColor = (status: Prescription['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      filled: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status];
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>

      <Table variant="striped">
        <TableHeader>
          <TableRow>
            <TableHead>Rx Number</TableHead>
            <TableHead>Medication</TableHead>
            <TableHead>Prescriber</TableHead>
            <TableHead>Date Issued</TableHead>
            <TableHead>Refills</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.length === 0 ? (
            <TableEmptyState colSpan={7} title="No prescriptions found" />
          ) : (
            prescriptions.map((rx) => (
              <TableRow key={rx.id}>
                <TableCell className="font-medium">{rx.prescriptionNumber}</TableCell>
                <TableCell>{rx.medicationName}</TableCell>
                <TableCell>{rx.prescriber}</TableCell>
                <TableCell>{rx.dateIssued}</TableCell>
                <TableCell>
                  {rx.refillsRemaining} of {rx.refillsAuthorized}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(rx.status)}`}>
                    {rx.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {onViewDetails && (
                      <Button size="xs" variant="ghost" onClick={() => onViewDetails(rx.id)}>
                        View
                      </Button>
                    )}
                    {onRequestRefill && rx.status === 'active' && rx.refillsRemaining > 0 && (
                      <Button size="xs" variant="outline" onClick={() => onRequestRefill(rx.id)}>
                        Refill
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

PrescriptionsList.displayName = 'PrescriptionsList';

export default PrescriptionsList;


