/**
 * @fileoverview Emergency Incidents List Page
 * @module app/(dashboard)/incidents/emergency
 */

import React from 'react';
import { Metadata } from 'next';
import { listIncidents } from '@/lib/actions/incidents.actions';
import { IncidentCard } from '@/components/incidents/IncidentCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Incident } from '@/schemas/incidents/incident.schemas';

export const metadata: Metadata = {
  title: 'Emergency Incidents | White Cross',
  description: 'View all emergency incidents',
};



export default async function EmergencyIncidentsPage() {
  const incidents = await listIncidents({ type: 'EMERGENCY' });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Emergency Incidents</h1>
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
        <p className="text-gray-500">No emergency incidents found.</p>
      )}
    </div>
  );
}
