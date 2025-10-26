/**
 * @fileoverview Follow-Up Actions List Page
 * @module app/(dashboard)/incidents/[id]/follow-up
 */

import React from 'react';
import { Metadata } from 'next';
import { listFollowUpActions } from '@/actions/incidents.actions';
import { Card } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/buttons/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Follow-Up Actions | White Cross',
  description: 'View and manage follow-up actions',
};

export default async function FollowUpActionsPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await listFollowUpActions(params.id);
  const actions = result.data || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Follow-Up Actions</h1>
        <div className="flex gap-2">
          <Link href={`/incidents/${params.id}`}>
            <Button variant="secondary">Back to Incident</Button>
          </Link>
          <Link href={`/incidents/${params.id}/follow-up/new`}>
            <Button>Create Action</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {actions.map((action) => (
          <Link key={action.id} href={`/incidents/${params.id}/follow-up/${action.id}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {action.description}
                  </p>
                </div>
                <Badge
                  color={
                    action.status === 'COMPLETED'
                      ? 'green'
                      : action.status === 'OVERDUE'
                      ? 'red'
                      : 'blue'
                  }
                >
                  {action.status}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{action.actionType.replace('_', ' ')}</span>
                <span>Priority: {action.priority}</span>
                <span>Due: {new Date(action.dueDate).toLocaleDateString()}</span>
              </div>

              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${action.percentComplete}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {action.percentComplete}% Complete
                </p>
              </div>
            </Card>
          </Link>
        ))}

        {actions.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No follow-up actions for this incident.</p>
            <Link href={`/incidents/${params.id}/follow-up/new`}>
              <Button className="mt-4">Create First Action</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
