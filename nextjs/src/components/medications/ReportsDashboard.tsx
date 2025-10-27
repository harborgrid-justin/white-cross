'use client';

/**
 * ReportsDashboard Component
 */

import React from 'react';
import { Button } from '@/components/ui/Button';

export interface MedicationReport {
  id: string;
  name: string;
  description: string;
  icon: string;
  onGenerate: () => void;
}

export interface ReportsDashboardProps {
  onGenerateReport?: (reportType: string) => void;
}

export const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ onGenerateReport }) => {
  const reports: MedicationReport[] = [
    {
      id: 'administration',
      name: 'Administration Report',
      description: 'Detailed log of all medication administrations',
      icon: '📋',
      onGenerate: () => onGenerateReport?.('administration'),
    },
    {
      id: 'adherence',
      name: 'Adherence Report',
      description: 'Medication adherence rates and trends',
      icon: '📊',
      onGenerate: () => onGenerateReport?.('adherence'),
    },
    {
      id: 'inventory',
      name: 'Inventory Report',
      description: 'Current inventory levels and stock status',
      icon: '📦',
      onGenerate: () => onGenerateReport?.('inventory'),
    },
    {
      id: 'controlled-substances',
      name: 'Controlled Substances Report',
      description: 'Detailed tracking of controlled substance usage',
      icon: '🔒',
      onGenerate: () => onGenerateReport?.('controlled-substances'),
    },
    {
      id: 'prescriptions',
      name: 'Prescription Report',
      description: 'Active prescriptions and refill status',
      icon: '💊',
      onGenerate: () => onGenerateReport?.('prescriptions'),
    },
    {
      id: 'compliance',
      name: 'Compliance Report',
      description: 'Regulatory compliance and audit trail',
      icon: '✅',
      onGenerate: () => onGenerateReport?.('compliance'),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Medication Reports</h2>
        <p className="text-sm text-gray-600 mt-1">Generate comprehensive medication reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-3xl mb-3">{report.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{report.description}</p>
            <Button variant="outline" size="sm" onClick={report.onGenerate} fullWidth>
              Generate Report
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

ReportsDashboard.displayName = 'ReportsDashboard';

export default ReportsDashboard;
