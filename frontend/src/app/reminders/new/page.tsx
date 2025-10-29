'use client';

import React from 'react';
import { ReminderScheduler } from '@/features/notifications/components';
import { useRouter } from 'next/navigation';

/**
 * New Reminder Page
 *
 * Create new reminder form
 */
export default function NewReminderPage() {
  // TODO: Get userId from auth context
  const userId = 'current-user-id';
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/reminders');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Reminder</h1>
          <p className="mt-2 text-gray-600">
            Schedule a new reminder for yourself or your team
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <ReminderScheduler
            userId={userId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
