/**
 * @fileoverview Incident Card Component
 * @module components/incidents/IncidentCard
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { type Incident } from '@/schemas/incidents/incident.schemas';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface IncidentCardProps {
  incident: Incident;
}

const severityColors = {
  MINOR: 'green',
  MODERATE: 'yellow',
  SERIOUS: 'orange',
  CRITICAL: 'red',
  LIFE_THREATENING: 'red',
} as const;

const statusColors = {
  PENDING_REVIEW: 'yellow',
  UNDER_INVESTIGATION: 'blue',
  REQUIRES_ACTION: 'orange',
  RESOLVED: 'green',
  ARCHIVED: 'gray',
} as const;

export function IncidentCard({ incident }: IncidentCardProps) {
  return (
    <Link href={`/incidents/${incident.id}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">
                {incident.incidentNumber || `Incident #${incident.id?.substring(0, 8)}`}
              </h3>
              <Badge color={severityColors[incident.severity]}>
                {incident.severity}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {incident.studentName || `Student ID: ${incident.studentId}`}
            </p>
          </div>
          <Badge color={statusColors[incident.status]}>
            {incident.status.replace('_', ' ')}
          </Badge>
        </div>

        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {incident.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex gap-4">
            <span>{incident.type.replace('_', ' ')}</span>
            <span>{incident.location.replace('_', ' ')}</span>
          </div>
          <span>
            {formatDistanceToNow(new Date(incident.incidentDate), { addSuffix: true })}
          </span>
        </div>
      </Card>
    </Link>
  );
}



