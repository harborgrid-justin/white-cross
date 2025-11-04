'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { ComplianceSettingsProps } from './types';
import { ComplianceStatus } from '../ComplianceCard';

/**
 * ComplianceSettings Component
 *
 * Provides settings management for a compliance requirement including status changes,
 * notification preferences, and danger zone actions like deletion. Allows users to
 * configure how they interact with the requirement.
 *
 * @param props - ComplianceSettings component props
 * @returns JSX element representing the compliance settings tab
 */
const ComplianceSettings: React.FC<ComplianceSettingsProps> = ({
  requirement,
  onStatusChange
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Requirement Settings</h3>

      {/* Status Management */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-base font-medium text-gray-900 mb-4">Status Management</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Current Status</span>
            <select
              value={requirement.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                onStatusChange?.(e.target.value as ComplianceStatus)}
              className="text-sm border border-gray-300 rounded px-2 py-1
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="compliant">Compliant</option>
              <option value="non-compliant">Non-Compliant</option>
              <option value="warning">Warning</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-base font-medium text-gray-900 mb-4">Notifications</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked={true}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Email reminders</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked={true}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Status change notifications</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked={false}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Daily progress updates</span>
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border-t border-red-200 bg-red-50 rounded-lg p-4">
        <h4 className="text-base font-medium text-red-900 mb-4">Danger Zone</h4>
        <p className="text-sm text-red-700 mb-4">
          Deleting this requirement will permanently remove all associated tasks, evidence, and comments.
        </p>
        <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600
                         bg-white border border-red-300 rounded-md hover:bg-red-50">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Requirement
        </button>
      </div>
    </div>
  );
};

export default ComplianceSettings;
