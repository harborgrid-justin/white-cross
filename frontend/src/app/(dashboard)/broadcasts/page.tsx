/**
 * @fileoverview Broadcasts Page - Mass communication management for healthcare environments
 * @module app/broadcasts/page
 * @version 1.0.0
 *
 * Mass communication system supporting:
 * - Emergency broadcasts and alerts
 * - Health notifications and reminders
 * - Staff communication management
 * - Parent and guardian messaging
 * - Multi-channel delivery (email, SMS, push notifications)
 */

import React from 'react';
import { Metadata } from 'next';
import BroadcastsContent from './_components/BroadcastsContent';
import BroadcastsSidebar from './_components/BroadcastsSidebar';

export const metadata: Metadata = {
  title: 'Broadcasts | White Cross Healthcare',
  description: 'Mass communication and emergency broadcast management system',
};

// Dynamic rendering for real-time broadcast status


/**
 * Broadcasts Page
 *
 * Server component that renders the mass communication interface with
 * main content area and sidebar for quick actions and statistics.
 *
 * @remarks
 * - Split layout with BroadcastsContent and BroadcastsSidebar
 * - Server Actions for broadcast operations
 * - Real-time updates for emergency broadcasts
 */
export default function BroadcastsPage() {
  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-auto">
        <BroadcastsContent />
      </div>
      <div className="w-80 border-l bg-gray-50/50 overflow-auto">
        <div className="p-6">
          <BroadcastsSidebar />
        </div>
      </div>
    </div>
  );
}
