/**
 * @fileoverview Edit Incident Report Page
 * @module app/(dashboard)/incidents/[id]/edit
 */

import React from 'react';
import { Metadata } from 'next';
import { getIncident } from '@/actions/incidents.actions';
import { IncidentReportForm } from '@/components/incidents/IncidentReportForm';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Incident Report | White Cross',
  description: 'Edit incident report',
};

export default async function EditIncidentPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getIncident(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Incident Report</h1>
      <IncidentReportForm incident={result.data as any} />
    </div>
  );
}
