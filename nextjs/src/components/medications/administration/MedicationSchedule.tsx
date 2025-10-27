'use client';

/**
 * Medication Schedule Component
 * Displays medication schedule with due/overdue indicators
 */

import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmptyState } from '@/components/ui/data/Table';
import { Button } from '@/components/ui/Button';

export interface ScheduledMedication {
  id: string;
  medicationName: string;
  studentName: string;
  dosage: string;
  route: string;
  scheduledTime: string;
  frequency: string;
  status: 'pending' | 'given' | 'missed' | 'refused' | 'overdue';
  administeredAt?: string;
  administeredBy?: string;
}

export interface MedicationScheduleProps {
  scheduledMedications: ScheduledMedication[];
  onAdminister?: (medicationId: string) => void;
  onSkip?: (medicationId: string) => void;
  showStudent?: boolean;
}

export const MedicationSchedule: React.FC<MedicationScheduleProps> = ({
  scheduledMedications,
  onAdminister,
  onSkip,
  showStudent = true,
}) => {
  const getStatusBadge = (status: ScheduledMedication['status']) => {
    const badges = {
      pending: 'bg-blue-100 text-blue-800',
      given: 'bg-green-100 text-green-800',
      missed: 'bg-yellow-100 text-yellow-800',
      refused: 'bg-red-100 text-red-800',
      overdue: 'bg-orange-100 text-orange-800',
    };
    return badges[status];
  };

  const isActionable = (status: ScheduledMedication['status']) => {
    return status === 'pending' || status === 'overdue';
  };

  return (
    <div className="space-y-4">
      <Table variant="striped">
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Medication</TableHead>
            {showStudent && <TableHead>Student</TableHead>}
            <TableHead>Dosage</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduledMedications.length === 0 ? (
            <TableEmptyState
              colSpan={showStudent ? 7 : 6}
              title="No scheduled medications"
              description="There are no medications scheduled for administration"
            />
          ) : (
            scheduledMedications.map((med) => (
              <TableRow key={med.id}>
                <TableCell className="font-medium">
                  {new Date(med.scheduledTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell>{med.medicationName}</TableCell>
                {showStudent && <TableCell>{med.studentName}</TableCell>}
                <TableCell>{med.dosage}</TableCell>
                <TableCell>{med.frequency}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(med.status)}`}>
                    {med.status}
                  </span>
                  {med.administeredAt && (
                    <div className="text-xs text-gray-500 mt-1">
                      Given at {new Date(med.administeredAt).toLocaleTimeString()}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {isActionable(med.status) && (
                    <div className="flex items-center gap-2">
                      {onAdminister && (
                        <Button size="xs" variant="primary" onClick={() => onAdminister(med.id)}>
                          Administer
                        </Button>
                      )}
                      {onSkip && (
                        <Button size="xs" variant="ghost" onClick={() => onSkip(med.id)}>
                          Skip
                        </Button>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

MedicationSchedule.displayName = 'MedicationSchedule';

export default MedicationSchedule;
