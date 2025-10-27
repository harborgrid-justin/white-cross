/**
 * @fileoverview Incident Witnesses List Page
 * @module app/(dashboard)/incidents/[id]/witnesses
 */

import React from 'react';
import { Metadata } from 'next';
import { Card } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Witnesses | White Cross',
  description: 'View and manage incident witnesses',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function WitnessesPage({
  params,
}: {
  params: { id: string };
}) {
  // Mock data - would fetch from API
  const witnesses = [
    {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      witnessType: 'TEACHER',
      statementProvided: true,
    },
    {
      id: '2',
      firstName: 'Michael',
      lastName: 'Chen',
      witnessType: 'STUDENT',
      statementProvided: false,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Incident Witnesses</h1>
        <div className="flex gap-2">
          <Link href={`/incidents/${params.id}`}>
            <Button variant="secondary">Back to Incident</Button>
          </Link>
          <Link href={`/incidents/${params.id}/witnesses/add`}>
            <Button>Add Witness</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {witnesses.map((witness) => (
          <Link key={witness.id} href={`/incidents/${params.id}/witnesses/${witness.id}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {witness.firstName} {witness.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{witness.witnessType}</p>
                </div>
                <Badge color={witness.statementProvided ? 'green' : 'yellow'}>
                  {witness.statementProvided ? 'Statement Provided' : 'Pending'}
                </Badge>
              </div>

              {!witness.statementProvided && (
                <div className="mt-4 pt-4 border-t">
                  <Link
                    href={`/incidents/${params.id}/witnesses/${witness.id}/statement`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button size="sm" variant="secondary">
                      Collect Statement
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </Link>
        ))}

        {witnesses.length === 0 && (
          <Card className="p-8 text-center col-span-2">
            <p className="text-gray-500">No witnesses recorded for this incident.</p>
            <Link href={`/incidents/${params.id}/witnesses/add`}>
              <Button className="mt-4">Add First Witness</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
