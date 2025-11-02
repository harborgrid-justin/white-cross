'use client';

/**
 * DueMedicationsDashboard Component
 * Dashboard showing medications due for administration
 */

import React, { useState } from 'react';
import { MedicationSchedule, type ScheduledMedication } from './administration/MedicationSchedule';
import { Button } from '@/components/ui/button';

export interface DueMedicationsDashboardProps {
  dueMedications: ScheduledMedication[];
  onAdminister?: (medicationId: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const DueMedicationsDashboard: React.FC<DueMedicationsDashboardProps> = ({
  dueMedications,
  onAdminister,
  onRefresh,
  isLoading = false,
}) => {
  const pendingCount = dueMedications.filter((m) => m.status === 'pending').length;
  const overdueCount = dueMedications.filter((m) => m.status === 'overdue').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-1">Total Due</div>
          <div className="text-3xl font-bold text-gray-900">{dueMedications.length}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-sm text-blue-600 mb-1">Pending</div>
          <div className="text-3xl font-bold text-blue-900">{pendingCount}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="text-sm text-orange-600 mb-1">Overdue</div>
          <div className="text-3xl font-bold text-orange-900">{overdueCount}</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Medications Due</h2>
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh} loading={isLoading}>
            Refresh
          </Button>
        )}
      </div>

      {/* Schedule */}
      <MedicationSchedule
        scheduledMedications={dueMedications}
        onAdminister={onAdminister}
        showStudent={true}
      />
    </div>
  );
};

DueMedicationsDashboard.displayName = 'DueMedicationsDashboard';

export default DueMedicationsDashboard;


