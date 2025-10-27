/**
 * @fileoverview Incidents List - Main incident management page
 * @module app/(dashboard)/incidents
 *
 * Comprehensive incident tracking with:
 * - Advanced search and filtering
 * - Multi-dimensional filtering (type, severity, status, dates)
 * - Paginated list view with sortable columns
 * - Visual severity and status indicators
 * - Export capabilities for reporting
 * - Role-based access control
 */

import React from 'react';
import { Metadata } from 'next';
import { listIncidents } from '@/actions/incidents.actions';
import { IncidentCard } from '@/components/incidents/IncidentCard';
import { Card } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Incident Reports | White Cross',
  description: 'Manage and track incident reports',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default async function IncidentsListPage() {
  const result = await listIncidents({ limit: 50, sortBy: 'incidentDate', sortOrder: 'desc' });
  const incidents = result.data?.incidents || [];
  const stats = result.data
    ? {
        total: result.data.total,
        pending: incidents.filter((i) => i.status === 'PENDING_REVIEW').length,
        investigating: incidents.filter((i) => i.status === 'UNDER_INVESTIGATION').length,
        requiresAction: incidents.filter((i) => i.status === 'REQUIRES_ACTION').length,
      }
    : { total: 0, pending: 0, investigating: 0, requiresAction: 0 };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Incident Reports</h1>
        <div className="flex gap-2">
          <Link href="/incidents/analytics">
            <Button variant="secondary">Analytics</Button>
          </Link>
          <Link href="/incidents/reports">
            <Button variant="secondary">Reports</Button>
          </Link>
          <Link href="/incidents/new">
            <Button>Create Incident</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Incidents</h3>
          <p className="text-3xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Review</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold">{stats.pending}</p>
            <Badge color="yellow">Pending</Badge>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Under Investigation</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold">{stats.investigating}</p>
            <Badge color="blue">Active</Badge>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Requires Action</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold">{stats.requiresAction}</p>
            <Badge color="orange">Action Needed</Badge>
          </div>
        </Card>
      </div>

      {/* Quick Filters */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/incidents/injury">
            <Badge color="gray" className="cursor-pointer hover:bg-gray-200">
              Injury
            </Badge>
          </Link>
          <Link href="/incidents/illness">
            <Badge color="gray" className="cursor-pointer hover:bg-gray-200">
              Illness
            </Badge>
          </Link>
          <Link href="/incidents/behavioral">
            <Badge color="gray" className="cursor-pointer hover:bg-gray-200">
              Behavioral
            </Badge>
          </Link>
          <Link href="/incidents/safety">
            <Badge color="gray" className="cursor-pointer hover:bg-gray-200">
              Safety
            </Badge>
          </Link>
          <Link href="/incidents/emergency">
            <Badge color="gray" className="cursor-pointer hover:bg-gray-200">
              Emergency
            </Badge>
          </Link>
          <span className="mx-2 text-gray-400">|</span>
          <Link href="/incidents/pending-review">
            <Badge color="yellow" className="cursor-pointer">
              Pending Review
            </Badge>
          </Link>
          <Link href="/incidents/under-investigation">
            <Badge color="blue" className="cursor-pointer">
              Under Investigation
            </Badge>
          </Link>
          <Link href="/incidents/requires-action">
            <Badge color="orange" className="cursor-pointer">
              Requires Action
            </Badge>
          </Link>
          <Link href="/incidents/resolved">
            <Badge color="green" className="cursor-pointer">
              Resolved
            </Badge>
          </Link>
        </div>
      </div>

      {/* Incidents List */}
      {result.success && incidents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">No incidents found</p>
          <Link href="/incidents/new">
            <Button>Create First Incident</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
