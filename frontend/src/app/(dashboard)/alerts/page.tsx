/**
 * @fileoverview Alerts Page - System and inventory alerts management
 * @module app/(dashboard)/alerts/page
 * @category Healthcare
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alerts',
  description: 'System alerts and inventory notifications',
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
