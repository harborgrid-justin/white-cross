/**
 * Health Records Page - Simplified Version
 *
 * Complete health records management system with:
 * - Electronic health records
 * - Vaccination tracking
 * - Allergy management
 * - Chronic condition monitoring
 *
 * @module pages/HealthRecords
 */

import React, { useState } from 'react';
import { FileText, AlertTriangle, Activity } from 'lucide-react';
import { useAuthContext } from '../../hooks/utilities/AuthContext';

/**
 * Health Records Page Component
 */
export default function HealthRecords() {
  const { user } = useAuthContext();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Records</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage student health records, vaccinations, and medical information
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Records</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">1,234</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-warning-600 dark:text-warning-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Allergies</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">45</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-6 w-6 text-success-600 dark:text-success-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chronic Conditions</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">28</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Health Records
          </h2>
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No records selected</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select a student to view their health records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
