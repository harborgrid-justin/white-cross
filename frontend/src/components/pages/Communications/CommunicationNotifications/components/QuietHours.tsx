'use client';

import React from 'react';
import type { QuietHoursConfig } from '../types';

interface QuietHoursProps {
  quietHours: QuietHoursConfig;
  preferenceId: string;
  onUpdate: (quietHours: QuietHoursConfig) => void;
}

/**
 * QuietHours component - manages quiet hours time range configuration
 */
export const QuietHours: React.FC<QuietHoursProps> = ({
  quietHours,
  preferenceId,
  onUpdate
}) => {
  return (
    <div className="md:col-span-2">
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="checkbox"
          id={`quiet-${preferenceId}`}
          checked={quietHours.enabled}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onUpdate({ ...quietHours, enabled: e.target.checked })
          }
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor={`quiet-${preferenceId}`} className="text-gray-700">
          Enable quiet hours
        </label>
      </div>

      {quietHours.enabled && (
        <div className="flex items-center space-x-2 ml-6">
          <input
            type="time"
            value={quietHours.start_time}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onUpdate({ ...quietHours, start_time: e.target.value })
            }
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Quiet hours start time"
          />
          <span className="text-gray-500">to</span>
          <input
            type="time"
            value={quietHours.end_time}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onUpdate({ ...quietHours, end_time: e.target.value })
            }
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Quiet hours end time"
          />
        </div>
      )}
    </div>
  );
};
