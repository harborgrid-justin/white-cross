/**
 * @fileoverview Incident Details Page
 * @module app/(dashboard)/incidents/[id]
 *
 * Comprehensive incident details with:
 * - Full incident information
 * - Status workflow management
 * - Witness and follow-up tracking
 * - Audit trail
 */

import React from 'react';
import { Metadata } from 'next';
import { getIncident } from '@/actions/incidents.actions';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export const metadata: Metadata = {
  title: 'Incident Details | White Cross',
  description: 'View incident report details',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

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

export default async function IncidentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getIncident(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const incident = result.data;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">
              {incident.incidentNumber || `Incident #${incident.id?.substring(0, 8)}`}
            </h1>
            <Badge color={statusColors[incident.status]}>
              {incident.status.replace('_', ' ')}
            </Badge>
            <Badge color={severityColors[incident.severity]}>
              {incident.severity}
            </Badge>
          </div>
          <p className="text-gray-600">
            {formatDistanceToNow(new Date(incident.incidentDate), { addSuffix: true })}
          </p>
        </div>

        <div className="flex gap-2">
          <Link href={`/incidents/${params.id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Link href={`/incidents/${params.id}/witnesses`}>
            <Button variant="secondary">Witnesses</Button>
          </Link>
          <Link href={`/incidents/${params.id}/follow-up`}>
            <Button>Follow-Up</Button>
          </Link>
        </div>
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Incident Information</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium">{incident.type.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">{incident.location.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Student</p>
                <p className="font-medium">
                  {incident.studentName || `ID: ${incident.studentId}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Reported By</p>
                <p className="font-medium">
                  {incident.reportedByName || 'Staff Member'}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">Location Details</p>
              <p className="text-gray-800">{incident.locationDetails}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-800 whitespace-pre-wrap">
              {incident.description}
            </p>
          </Card>

          {incident.medicalResponse && incident.medicalResponse !== 'NONE' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Medical Response</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Response Type</p>
                  <p className="font-medium">
                    {incident.medicalResponse.replace('_', ' ')}
                  </p>
                </div>
                {incident.medicalNotes && (
                  <div>
                    <p className="text-sm text-gray-600">Medical Notes</p>
                    <p className="text-gray-800">{incident.medicalNotes}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {incident.parentNotified && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Parent Notification</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Notified At</p>
                  <p className="font-medium">
                    {incident.parentNotifiedAt
                      ? new Date(incident.parentNotifiedAt).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Method</p>
                  <p className="font-medium">
                    {incident.parentNotificationMethod || 'N/A'}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href={`/incidents/${params.id}/witnesses/add`}>
                <Button className="w-full" size="sm" variant="secondary">
                  Add Witness
                </Button>
              </Link>
              <Link href={`/incidents/${params.id}/follow-up/new`}>
                <Button className="w-full" size="sm" variant="secondary">
                  Create Follow-Up
                </Button>
              </Link>
              <Button className="w-full" size="sm" variant="secondary">
                Update Status
              </Button>
              <Button className="w-full" size="sm" variant="secondary">
                Export Report
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Incident Occurred</p>
                  <p className="text-xs text-gray-600">
                    {new Date(incident.incidentDate).toLocaleString()}
                  </p>
                </div>
              </div>
              {incident.reportedDate && (
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Reported</p>
                    <p className="text-xs text-gray-600">
                      {new Date(incident.reportedDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {incident.createdAt && (
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-xs text-gray-600">
                      {new Date(incident.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {incident.tags && incident.tags.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {incident.tags.map((tag) => (
                  <Badge key={tag} color="gray">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {(incident.isConfidential || incident.restrictedAccess) && (
            <Card className="p-6 border-red-300 bg-red-50">
              <h3 className="font-semibold text-red-800 mb-2">Privacy Notices</h3>
              <div className="space-y-1 text-sm text-red-700">
                {incident.isConfidential && <p>Confidential Record</p>}
                {incident.restrictedAccess && <p>Restricted Access</p>}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
