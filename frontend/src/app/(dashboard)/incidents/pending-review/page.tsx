/**
 * @fileoverview Pending Review Incidents Page
 * @module app/(dashboard)/incidents/pending-review
 */

import React from 'react';
import { Metadata } from 'next';
import { listIncidents } from '@/actions/incidents.actions';
import { IncidentCard } from '@/components/incidents/IncidentCard';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Pending Review Incidents | White Cross',
  description: 'View incidents pending review',
};

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';

export default async function PendingReviewPage() {
  const result = await listIncidents({ status: 'PENDING_REVIEW' });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pending Review</h1>
        <Link href="/incidents/new">
          <Button>Create Incident</Button>
        </Link>
      </div>

      {result.success && result.data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.data.incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No pending incidents found.</p>
      )}
    </div>
  );
}
