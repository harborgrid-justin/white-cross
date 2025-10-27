/**
 * @fileoverview Follow-Up Action Details Page
 * @module app/(dashboard)/incidents/[id]/follow-up/[followUpId]
 */

import React from 'react';
import { Metadata } from 'next';
import { Card } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Follow-Up Details | White Cross',
  description: 'View follow-up action details',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function FollowUpDetailsPage({
  params,
}: {
  params: { id: string; followUpId: string };
}) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Follow-Up Action</h1>
        <div className="flex gap-2">
          <Link href={`/incidents/${params.id}`}>
            <Button variant="secondary">Back to Incident</Button>
          </Link>
          <Button>Update Progress</Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Action Details</h2>
          <Badge color="blue">IN PROGRESS</Badge>
        </div>
        <p className="text-gray-600">
          Follow-up action {params.followUpId} for incident {params.id}
        </p>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }} />
          </div>
          <p className="text-sm text-gray-500 mt-1">45% Complete</p>
        </div>
      </Card>
    </div>
  );
}
