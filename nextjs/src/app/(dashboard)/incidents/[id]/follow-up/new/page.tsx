/**
 * @fileoverview Create Follow-Up Action Page
 * @module app/(dashboard)/incidents/[id]/follow-up/new
 */

'use client';

import React from 'react';
import { FollowUpForm } from '@/components/incidents/FollowUpForm';
import { useRouter } from 'next/navigation';

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";


export default function NewFollowUpPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const handleSuccess = () => {
    router.push(`/incidents/${params.id}/follow-up`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Follow-Up Action</h1>
      <FollowUpForm incidentId={params.id} onSuccess={handleSuccess} />
    </div>
  );
}
