/**
 * @fileoverview Safety Incidents List Page
 * @module app/(dashboard)/incidents/safety
 */

import React from 'react';
import { Metadata } from 'next';
import { listIncidents } from '@/lib/actions/incidents.actions';
import { IncidentCard } from '@/components/incidents/IncidentCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Incident } from '@/schemas/incidents/incident.schemas';

export const metadata: Metadata = {
  title: 'Safety Incidents | White Cross',
  description: 'View all safety incidents',
};



export default async function SafetyIncidentsPage() {
  const incidents = await listIncidents({ type: 'SAFETY' });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Safety Incidents</h1>
        <Link href="/incidents/new">
          <Button>Create Incident</Button>
        </Link>
      </div>

      {incidents && incidents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident as unknown as Incident} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No safety incidents found.</p>
      )}
    </div>
  );
}
