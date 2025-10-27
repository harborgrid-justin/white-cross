/**
 * @fileoverview Create New Incident Report Page
 * @module app/(dashboard)/incidents/new
 */

import React from 'react';
import { Metadata } from 'next';
import { IncidentReportForm } from '@/components/incidents/IncidentReportForm';

export const metadata: Metadata = {
  title: 'New Incident Report | White Cross',
  description: 'Create a new incident report',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function NewIncidentPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Incident Report</h1>
      <IncidentReportForm />
    </div>
  );
}
