/**
 * @fileoverview Illness Incidents List Page
 * @module app/(dashboard)/incidents/illness
 */

import React from 'react';
import { Metadata } from 'next';
import { listIncidents } from '@/actions/incidents.actions';
import { IncidentCard } from '@/components/incidents/IncidentCard';
import Link from 'next/link';
import { Button } from '@/components/ui/buttons/Button';

export const metadata: Metadata = {
  title: 'Illness Incidents | White Cross',
  description: 'View all illness incidents',
};

export default async function IllnessIncidentsPage() {
  const result = await listIncidents({ type: 'ILLNESS' });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Illness Incidents</h1>
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
        <p className="text-gray-500">No illness incidents found.</p>
      )}
    </div>
  );
}
