'use client';

import React from 'react';
import { NotificationSettings } from '@/features/notifications/components';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Notification Settings Page
 *
 * User notification preferences management
 */
export default function NotificationSettingsPage() {
  const { user } = useAuth();
  const userId = user?.id || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
          <p className="mt-2 text-gray-600">
            Customize how and when you receive notifications
          </p>
        </div>

        <NotificationSettings userId={userId} />
      </div>
    </div>
  );
}
