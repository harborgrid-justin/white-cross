/**
 * @fileoverview Incident Settings Page
 * @module app/(dashboard)/incidents/settings
 */

import React from 'react';
import { Metadata } from 'next';
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Incident Settings | White Cross',
  description: 'Configure incident management settings',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function IncidentSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Incident Settings</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm">Email notifications for new incidents</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm">Notify on status changes</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Daily incident summary</span>
            </label>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Auto-Assignment Rules</h2>
          <p className="text-sm text-gray-600 mb-4">
            Configure automatic incident assignment based on type and location
          </p>
          <Button size="sm">Configure Rules</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Retention Policy</h2>
          <p className="text-sm text-gray-600 mb-4">
            Set data retention periods for archived incidents
          </p>
          <div className="flex items-center gap-4">
            <select className="border rounded px-3 py-2">
              <option value="1">1 year</option>
              <option value="3">3 years</option>
              <option value="5">5 years</option>
              <option value="7" selected>7 years</option>
            </select>
            <Button size="sm">Save</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Custom Fields</h2>
          <p className="text-sm text-gray-600 mb-4">
            Add custom fields to incident reports
          </p>
          <Button size="sm">Manage Fields</Button>
        </Card>
      </div>
    </div>
  );
}
