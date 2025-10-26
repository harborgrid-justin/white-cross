/**
 * @fileoverview Collect Witness Statement Page
 * @module app/(dashboard)/incidents/[id]/witnesses/[witnessId]/statement
 */

'use client';

import React from 'react';
import { WitnessStatementForm } from '@/components/incidents/WitnessStatementForm';
import { useRouter } from 'next/navigation';

export default function WitnessStatementPage({
  params,
}: {
  params: { id: string; witnessId: string };
}) {
  const router = useRouter();

  const handleSuccess = () => {
    router.push(`/incidents/${params.id}/witnesses/${params.witnessId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Collect Witness Statement</h1>
      <WitnessStatementForm
        incidentId={params.id}
        witnessId={params.witnessId}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
