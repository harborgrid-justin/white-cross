/**
 * @fileoverview Incident Reports Page
 * @module app/(dashboard)/incidents/reports
 */

import React from 'react';
import { Metadata } from 'next';
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Incident Reports | White Cross',
  description: 'Generate and view incident reports',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function IncidentReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Incident Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-2">Monthly Summary</h3>
          <p className="text-sm text-gray-600 mb-4">
            Comprehensive monthly incident summary report
          </p>
          <Button size="sm">Generate Report</Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-2">Type Analysis</h3>
          <p className="text-sm text-gray-600 mb-4">
            Breakdown of incidents by type and severity
          </p>
          <Button size="sm">Generate Report</Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-2">Location Hotspots</h3>
          <p className="text-sm text-gray-600 mb-4">
            Identify high-frequency incident locations
          </p>
          <Button size="sm">Generate Report</Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-2">Response Times</h3>
          <p className="text-sm text-gray-600 mb-4">
            Analysis of incident response and resolution times
          </p>
          <Button size="sm">Generate Report</Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-2">Compliance Report</h3>
          <p className="text-sm text-gray-600 mb-4">
            Legal compliance and documentation status
          </p>
          <Button size="sm">Generate Report</Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-2">Custom Report</h3>
          <p className="text-sm text-gray-600 mb-4">
            Build a custom report with specific filters
          </p>
          <Button size="sm">Create Custom</Button>
        </Card>
      </div>
    </div>
  );
}
