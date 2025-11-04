/**
 * @fileoverview Alerts Page - System and inventory alerts management
 * @module app/(dashboard)/alerts/page
 * @category Healthcare
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alerts & Notifications',
  description: 'System alerts, inventory notifications, low-stock warnings, and medication expiration alerts for healthcare management.',
  keywords: [
    'alerts',
    'notifications',
    'inventory alerts',
    'low stock',
    'medication expiration',
    'system notifications',
    'healthcare alerts'
  ],
  openGraph: {
    title: 'Alerts & Notifications | White Cross Healthcare',
    description: 'Real-time system alerts and inventory management notifications.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage system alerts, low-stock notifications, and expiration warnings
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-gray-600">Alerts dashboard - Under construction</p>
      </div>
    </div>
  );
}
