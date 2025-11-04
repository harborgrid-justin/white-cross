'use client';

import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { ExportSchedule } from './types';

/**
 * Props for the ExportScheduler component
 */
export interface ExportSchedulerProps {
  /** Current schedule configuration */
  schedule?: ExportSchedule;
  /** Callback when schedule changes */
  onChange: (schedule: ExportSchedule | undefined) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/**
 * ExportScheduler Component
 *
 * Configuration for scheduled export jobs.
 * Supports one-time, daily, weekly, and monthly schedules with timezone selection.
 *
 * @param props - ExportScheduler component props
 * @returns JSX element representing the export scheduler
 */
export const ExportScheduler: React.FC<ExportSchedulerProps> = ({
  schedule,
  onChange,
  disabled = false,
  className = ''
}) => {
  const isEnabled = schedule?.enabled ?? false;

  /**
   * Toggles schedule enabled state
   */
  const handleToggleEnabled = (enabled: boolean) => {
    if (enabled) {
      onChange({
        enabled: true,
        frequency: 'daily',
        time: '09:00',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
    } else {
      onChange(undefined);
    }
  };

  /**
   * Updates schedule field
   */
  const updateScheduleField = <K extends keyof ExportSchedule>(
    field: K,
    value: ExportSchedule[K]
  ) => {
    if (!schedule) return;
    onChange({
      ...schedule,
      [field]: value
    });
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          <Calendar className="w-4 h-4 inline mr-2" />
          Schedule Export
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => handleToggleEnabled(e.target.checked)}
            disabled={disabled}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
            aria-label="Enable export schedule"
          />
          <span className="ml-2 text-sm text-gray-600">
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      {isEnabled && schedule && (
        <div className="space-y-4 pl-6 border-l-2 border-blue-200">
          {/* Frequency */}
          <div>
            <label htmlFor="scheduleFrequency" className="block text-xs font-medium text-gray-600 mb-1">
              Frequency
            </label>
            <select
              id="scheduleFrequency"
              value={schedule.frequency}
              onChange={(e) =>
                updateScheduleField('frequency', e.target.value as ExportSchedule['frequency'])
              }
              disabled={disabled}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                       disabled:bg-gray-100 disabled:cursor-not-allowed"
              aria-label="Schedule frequency"
            >
              <option value="once">One Time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Time */}
          <div>
            <label htmlFor="scheduleTime" className="block text-xs font-medium text-gray-600 mb-1">
              <Clock className="w-3 h-3 inline mr-1" />
              Time
            </label>
            <input
              type="time"
              id="scheduleTime"
              value={schedule.time}
              onChange={(e) => updateScheduleField('time', e.target.value)}
              disabled={disabled}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                       disabled:bg-gray-100 disabled:cursor-not-allowed"
              aria-label="Schedule time"
            />
          </div>

          {/* Timezone */}
          <div>
            <label htmlFor="scheduleTimezone" className="block text-xs font-medium text-gray-600 mb-1">
              Timezone
            </label>
            <select
              id="scheduleTimezone"
              value={schedule.timezone}
              onChange={(e) => updateScheduleField('timezone', e.target.value)}
              disabled={disabled}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                       disabled:bg-gray-100 disabled:cursor-not-allowed"
              aria-label="Schedule timezone"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Asia/Shanghai">Shanghai (CST)</option>
              <option value="Australia/Sydney">Sydney (AEDT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          {/* Info message */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-800">
              {schedule.frequency === 'once' && 'Export will run once at the specified time.'}
              {schedule.frequency === 'daily' && 'Export will run every day at the specified time.'}
              {schedule.frequency === 'weekly' && 'Export will run every week at the specified time.'}
              {schedule.frequency === 'monthly' && 'Export will run every month at the specified time.'}
            </p>
          </div>
        </div>
      )}

      {!isEnabled && (
        <p className="text-xs text-gray-500 mt-2">
          Enable scheduling to automatically run exports at specified intervals.
        </p>
      )}
    </div>
  );
};

export default ExportScheduler;
