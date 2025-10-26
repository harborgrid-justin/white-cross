/**
 * @fileoverview Incident Reports List - Main incident management page
 * @module app/incidents/page
 * @version 1.0.0
 *
 * Comprehensive incident tracking with:
 * - Advanced search and filtering
 * - Multi-dimensional filtering (type, severity, status, dates)
 * - Paginated list view with sortable columns
 * - Visual severity and status indicators
 * - Export capabilities for reporting
 * - Role-based access control
 */

import React from 'react'
import { Metadata } from 'next'
import IncidentReportsList from '@/components/features/incidents/IncidentReportsList'

export const metadata: Metadata = {
  title: 'Incident Reports | White Cross',
  description: 'Manage and track incident reports',
}

/**
 * Incident Reports Page
 *
 * Server component that renders the incident reports list interface.
 *
 * @remarks
 * - Uses Client Component for interactive features
 * - Server-side pagination for large datasets
 * - HIPAA-compliant audit logging
 * - PHI data never cached locally
 */
export default function IncidentReportsPage() {
  return <IncidentReportsList />
}
