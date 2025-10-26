/**
 * @fileoverview Witness Details Page
 * @module app/(dashboard)/incidents/[id]/witnesses/[witnessId]
 */

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/buttons/Button';

export const metadata: Metadata = {
  title: 'Witness Details | White Cross',
  description: 'View witness details',
};

export default function WitnessDetailsPage({
  params,
}: {
  params: { id: string; witnessId: string };
}) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Witness Details</h1>
        <Link href={`/incidents/${params.id}/witnesses/${params.witnessId}/statement`}>
          <Button>Collect Statement</Button>
        </Link>
      </div>
      <p className="text-gray-600">Witness {params.witnessId} for incident {params.id}</p>
    </div>
  );
}
