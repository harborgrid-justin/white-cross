'use client';

import React from 'react';
import { History, Activity } from 'lucide-react';
import { ComplianceHistoryProps } from './types';

/**
 * ComplianceHistory Component
 *
 * Displays the activity history for a compliance requirement. Shows a timeline of
 * actions performed on the requirement including who performed them and when.
 * Displays an empty state when no history is present.
 *
 * @param props - ComplianceHistory component props
 * @returns JSX element representing the compliance history tab
 */
const ComplianceHistory: React.FC<ComplianceHistoryProps> = ({ history }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Activity History</h3>

      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((entry) => (
            <div key={entry.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                <p className="text-xs text-gray-500 mt-1">by {entry.performedByName}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity History</h3>
          <p className="text-gray-600">Activity will appear here as changes are made to this requirement.</p>
        </div>
      )}
    </div>
  );
};

export default ComplianceHistory;
