'use client';

import React from 'react';
import {
  Bell,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
  Plus,
  Settings
} from 'lucide-react';
import type { AppointmentReminder, ReminderStats, ReminderTabType } from './types';
import { getReminderTypeInfo, getStatusColor } from './utils';

/**
 * Props for the ReminderOverviewTab component
 *
 * @interface ReminderOverviewTabProps
 */
export interface ReminderOverviewTabProps {
  /** Reminder system statistics */
  stats?: ReminderStats;
  /** Recent reminders to display */
  recentReminders: AppointmentReminder[];
  /** Whether user can send manual reminders */
  canSendManual: boolean;
  /** Whether user can manage templates */
  canManageTemplates: boolean;
  /** Handler for tab changes */
  onTabChange: (tab: ReminderTabType) => void;
}

/**
 * ReminderOverviewTab Component
 *
 * Displays a high-level overview of the reminder system including statistics,
 * recent activity, and quick action shortcuts.
 *
 * @param {ReminderOverviewTabProps} props - Component props
 * @returns {JSX.Element} Overview tab content
 *
 * @example
 * <ReminderOverviewTab
 *   stats={stats}
 *   recentReminders={reminders.slice(0, 5)}
 *   canSendManual={true}
 *   canManageTemplates={true}
 *   onTabChange={setActiveTab}
 * />
 */
const ReminderOverviewTab: React.FC<ReminderOverviewTabProps> = ({
  stats,
  recentReminders,
  canSendManual,
  canManageTemplates,
  onTabChange
}) => {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reminders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                <p className="text-3xl font-bold text-green-600">{stats.deliveryRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-3xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reminder Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentReminders.length > 0 ? (
              recentReminders.map((reminder) => {
                const typeInfo = getReminderTypeInfo(reminder.type);
                const IconComponent = typeInfo.icon;

                return (
                  <div key={reminder.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${typeInfo.bg}`}>
                        <IconComponent className={`w-4 h-4 ${typeInfo.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{reminder.recipient}</p>
                        <p className="text-sm text-gray-600">
                          {reminder.message.substring(0, 60)}
                          {reminder.message.length > 60 ? '...' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reminder.status)}`}>
                        {reminder.status}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {reminder.sentTime?.toLocaleString() || reminder.scheduledTime.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent reminder activity
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {canSendManual && (
              <button
                onClick={() => onTabChange('reminders')}
                className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300
                         rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="text-center">
                  <Send className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Send Manual Reminder</p>
                  <p className="text-sm text-gray-600">Send immediate reminders</p>
                </div>
              </button>
            )}

            {canManageTemplates && (
              <button
                onClick={() => onTabChange('templates')}
                className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300
                         rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="text-center">
                  <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Create Template</p>
                  <p className="text-sm text-gray-600">Add new reminder template</p>
                </div>
              </button>
            )}

            <button
              onClick={() => onTabChange('settings')}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300
                       rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <div className="text-center">
                <Settings className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Configure Settings</p>
                <p className="text-sm text-gray-600">Manage reminder preferences</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderOverviewTab;
