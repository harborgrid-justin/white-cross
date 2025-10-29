'use client';

import React, { useState } from 'react';
import { CreateReminderInput, ReminderType, ReminderFrequency, DayOfWeek } from '../types/reminder';
import { NotificationPriority, DeliveryChannel } from '../types/notification';
import { useReminders } from '../hooks';

export interface ReminderSchedulerProps {
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * ReminderScheduler Component
 *
 * Form for creating and scheduling reminders
 */
export const ReminderScheduler: React.FC<ReminderSchedulerProps> = ({
  userId,
  onSuccess,
  onCancel,
}) => {
  const { create, isCreating } = useReminders(userId);
  const [formData, setFormData] = useState<Partial<CreateReminderInput>>({
    type: ReminderType.CUSTOM,
    priority: NotificationPriority.MEDIUM,
    title: '',
    message: '',
    userId,
    scheduledAt: new Date(),
    channels: [DeliveryChannel.IN_APP],
  });

  const [showRecurrence, setShowRecurrence] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create(formData as CreateReminderInput, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Reminder type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as ReminderType })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            {Object.values(ReminderType).map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as NotificationPriority })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            {Object.values(NotificationPriority).map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
          maxLength={200}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows={3}
          required
          maxLength={1000}
        />
      </div>

      {/* Scheduling */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={formData.scheduledAt ? formData.scheduledAt.toISOString().split('T')[0] : ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                scheduledAt: new Date(e.target.value),
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            value={formData.scheduledAt ? formData.scheduledAt.toTimeString().slice(0, 5) : ''}
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(':');
              const newDate = new Date(formData.scheduledAt!);
              newDate.setHours(parseInt(hours), parseInt(minutes));
              setFormData({ ...formData, scheduledAt: newDate });
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
      </div>

      {/* Recurrence */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showRecurrence}
            onChange={(e) => setShowRecurrence(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Repeat this reminder</span>
        </label>
      </div>

      {showRecurrence && (
        <div className="border-l-4 border-blue-500 pl-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value={ReminderFrequency.DAILY}>Daily</option>
              <option value={ReminderFrequency.WEEKLY}>Weekly</option>
              <option value={ReminderFrequency.MONTHLY}>Monthly</option>
            </select>
          </div>
        </div>
      )}

      {/* Delivery channels */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery channels</label>
        <div className="space-y-2">
          {Object.values(DeliveryChannel).map((channel) => (
            <label key={channel} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.channels?.includes(channel)}
                onChange={(e) => {
                  const channels = formData.channels || [];
                  if (e.target.checked) {
                    setFormData({ ...formData, channels: [...channels, channel] });
                  } else {
                    setFormData({ ...formData, channels: channels.filter((c) => c !== channel) });
                  }
                }}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">{channel.replace(/_/g, ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isCreating}
          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isCreating ? 'Creating...' : 'Create reminder'}
        </button>
      </div>
    </form>
  );
};
