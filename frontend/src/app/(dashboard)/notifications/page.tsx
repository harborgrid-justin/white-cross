/**
 * Notifications Page - White Cross Healthcare Platform
 *
 * Features:
 * - Real-time notification management
 * - Priority-based alert system
 * - Healthcare-specific notifications
 * - Modern component architecture
 */

'use client';

/**
 * Force dynamic rendering for real-time notification data
 */


import React from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Notifications"
        description="Manage alerts, messages, and system notifications"
        actions={
          <Button variant="secondary">
            <Settings className="h-4 w-4 mr-2" />
            Notification Settings
          </Button>
        }
      />

      <div className="p-6">
        <div>Notifications content coming soon</div>
      </div>
    </div>
  );
}