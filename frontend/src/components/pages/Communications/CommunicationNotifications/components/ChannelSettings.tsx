'use client';

import React from 'react';
import type { NotificationPreference } from '../types';
import { getChannelIcon } from '../utils';
import { PrioritySettings } from './PrioritySettings';
import { QuietHours } from './QuietHours';

interface ChannelSettingsProps {
  preference: NotificationPreference;
  onUpdate: (prefId: string, updates: Partial<NotificationPreference>) => void;
}

/**
 * ChannelSettings component - manages individual notification channel preferences
 */
export const ChannelSettings: React.FC<ChannelSettingsProps> = ({
  preference,
  onUpdate
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getChannelIcon(preference.type)}
          <div>
            <h3 className="text-sm font-medium text-gray-900 capitalize">
              {preference.type} Notifications
            </h3>
            <p className="text-xs text-gray-500 capitalize">
              Category: {preference.category}
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={preference.enabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onUpdate(preference.id, { enabled: e.target.checked })
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {preference.enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <PrioritySettings
            priorityThreshold={preference.priority_threshold}
            frequency={preference.frequency}
            onPriorityChange={(priority) =>
              onUpdate(preference.id, { priority_threshold: priority })
            }
            onFrequencyChange={(frequency) =>
              onUpdate(preference.id, { frequency })
            }
          />

          <QuietHours
            quietHours={preference.quiet_hours}
            preferenceId={preference.id}
            onUpdate={(quietHours) =>
              onUpdate(preference.id, { quiet_hours: quietHours })
            }
          />
        </div>
      )}
    </div>
  );
};
