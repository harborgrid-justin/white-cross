'use client';

import React from 'react';
import type { NotificationPriority, NotificationFrequency } from '../types';

interface PrioritySettingsProps {
  priorityThreshold: NotificationPriority;
  frequency: NotificationFrequency;
  onPriorityChange: (priority: NotificationPriority) => void;
  onFrequencyChange: (frequency: NotificationFrequency) => void;
}

/**
 * PrioritySettings component - manages priority threshold and frequency settings
 */
export const PrioritySettings: React.FC<PrioritySettingsProps> = ({
  priorityThreshold,
  frequency,
  onPriorityChange,
  onFrequencyChange
}) => {
  return (
    <>
      <div>
        <label className="block text-gray-700 mb-1">Priority Threshold</label>
        <select
          value={priorityThreshold}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onPriorityChange(e.target.value as NotificationPriority)
          }
          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Frequency</label>
        <select
          value={frequency}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onFrequencyChange(e.target.value as NotificationFrequency)
          }
          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="immediate">Immediate</option>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>
    </>
  );
};
