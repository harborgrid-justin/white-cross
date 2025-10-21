/**
 * WF-COMP-179 | EmergencyContactsNotificationForm.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Emergency Contacts Notification Form Component
 *
 * Form for sending notifications to emergency contacts
 *
 * @module components/EmergencyContactsNotificationForm
 */

import React from 'react';
import { Send } from 'lucide-react';
import type { NotificationData, EmergencyContactFilters } from '../types';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
}

interface Channel {
  id: string;
  value: string;
  label: string;
  description?: string;
}

interface NotificationType {
  id: string;
  value: string;
  label: string;
}

interface PriorityLevel {
  id: string;
  value: string;
  label: string;
}

interface EmergencyContactsNotificationFormProps {
  notificationData: NotificationData;
  filters: EmergencyContactFilters;
  students: Student[];
  channels: Channel[];
  notificationTypes: NotificationType[];
  priorityLevels: PriorityLevel[];
  onFilterChange: (field: keyof EmergencyContactFilters, value: string) => void;
  onDataChange: (data: NotificationData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

/**
 * Notification form component
 */
export default function EmergencyContactsNotificationForm({
  notificationData,
  filters,
  students,
  channels,
  notificationTypes,
  priorityLevels,
  onFilterChange,
  onDataChange,
  onSubmit,
  onReset,
}: EmergencyContactsNotificationFormProps) {
  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold mb-4">Send Emergency Notification</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Student
          </label>
          <select
            value={filters.selectedStudent}
            onChange={(e) => onFilterChange('selectedStudent', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName} ({student.studentNumber})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message Type
          </label>
          <select
            value={notificationData.type}
            onChange={(e) =>
              onDataChange({ ...notificationData, type: e.target.value as any })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {notificationTypes.map((type) => (
              <option key={type.id} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={notificationData.priority}
            onChange={(e) =>
              onDataChange({ ...notificationData, priority: e.target.value as any })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {priorityLevels.map((priority) => (
              <option key={priority.id} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            value={notificationData.message}
            onChange={(e) =>
              onDataChange({ ...notificationData, message: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Enter notification message..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Communication Channels
          </label>
          <div className="space-y-2">
            {channels.map((channel) => (
              <label key={channel.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationData.channels.includes(channel.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onDataChange({
                        ...notificationData,
                        channels: [...notificationData.channels, channel.value],
                      });
                    } else {
                      onDataChange({
                        ...notificationData,
                        channels: notificationData.channels.filter(
                          (c) => c !== channel.value
                        ),
                      });
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{channel.label}</span>
                {channel.description && (
                  <span className="ml-2 text-xs text-gray-500">
                    - {channel.description}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear
          </button>
          <button type="submit" className="btn-primary flex items-center">
            <Send className="h-4 w-4 mr-2" />
            Send Notification
          </button>
        </div>
      </form>
    </div>
  );
}
