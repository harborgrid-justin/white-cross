/**
 * @fileoverview Emergency Incidents List Page
 * @module app/(dashboard)/incidents/emergency
 */

import React from 'react';
import { Metadata } from 'next';
import { listIncidents } from '@/actions/incidents.actions';
import { IncidentCard } from '@/components/incidents/IncidentCard';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import type { IncidentReport } from '@/types/incidents';

export const metadata: Metadata = {
  title: 'Emergency Incidents | White Cross',
  description: 'View all emergency incidents',
};

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';

export default async function EmergencyIncidentsPage() {
  const result = await listIncidents({ type: 'EMERGENCY' });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Emergency Incidents</h1>
        <Link href="/incidents/new">
          <Button>Create Incident</Button>
        </Link>
      </div>

      {result.success && result.data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.data.incidents.map((incident: IncidentReport) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No emergency incidents found.</p>
      )}
    </div>
  );
}
