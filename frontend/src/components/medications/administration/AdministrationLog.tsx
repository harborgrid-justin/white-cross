'use client';

/**
 * Administration Log Component
 * Displays medication administration history
 */

import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmptyState, TableLoadingState } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/inputs';

export interface AdministrationRecord {
  id: string;
  medicationName: string;
  studentName: string;
  dosageGiven: string;
  route: string;
  administeredAt: string;
  administeredBy: string;
  witnessedBy?: string;
  reactions?: string;
  refusedByStudent?: boolean;
  refusalReason?: string;
  notes?: string;
}

export interface AdministrationLogProps {
  records: AdministrationRecord[];
  isLoading?: boolean;
  onViewDetails?: (recordId: string) => void;
  showStudent?: boolean;
  showMedication?: boolean;
}

export const AdministrationLog: React.FC<AdministrationLogProps> = ({
  records,
  isLoading = false,
  onViewDetails,
  showStudent = true,
  showMedication = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter((record) => {
    const search = searchTerm.toLowerCase();
    return (
      record.medicationName.toLowerCase().includes(search) ||
      record.studentName.toLowerCase().includes(search) ||
      record.administeredBy.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search administration records..."
          className="max-w-md"
        />
        <div className="text-sm text-gray-600">
          {filteredRecords.length} of {records.length} records
        </div>
      </div>

      <Table variant="striped" size="sm">
        <TableHeader>
          <TableRow>
            <TableHead>Date/Time</TableHead>
            {showMedication && <TableHead>Medication</TableHead>}
            {showStudent && <TableHead>Student</TableHead>}
            <TableHead>Dosage</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Administered By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableLoadingState rows={5} cols={showMedication && showStudent ? 8 : 7} />
          ) : filteredRecords.length === 0 ? (
            <TableEmptyState
              colSpan={showMedication && showStudent ? 8 : 7}
              title="No administration records found"
              description={searchTerm ? "Try adjusting your search" : "No medications have been administered yet"}
            />
          ) : (
            filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{new Date(record.administeredAt).toLocaleString()}</TableCell>
                {showMedication && <TableCell className="font-medium">{record.medicationName}</TableCell>}
                {showStudent && <TableCell>{record.studentName}</TableCell>}
                <TableCell>{record.dosageGiven}</TableCell>
                <TableCell>{record.route}</TableCell>
                <TableCell>{record.administeredBy}</TableCell>
                <TableCell>
                  {record.refusedByStudent ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Refused
                    </span>
                  ) : record.reactions ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      Reaction
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Given
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {onViewDetails && (
                    <Button size="xs" variant="ghost" onClick={() => onViewDetails(record.id)}>
                      View
                    </Button>
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

AdministrationLog.displayName = 'AdministrationLog';

export default AdministrationLog;


