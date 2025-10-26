/**
 * @fileoverview Incident Report Details - View and manage specific incident
 * @module app/incidents/[id]/page
 * @version 1.0.0
 */

import React from 'react'
import { Metadata } from 'next'
import IncidentReportDetails from '@/components/features/incidents/IncidentReportDetails'

export const metadata: Metadata = {
  title: 'Incident Details | Incidents | White Cross',
  description: 'View incident report details',
}

interface IncidentDetailsPageProps {
  params: {
    id: string
  }
}

/**
 * Incident Report Details Page
 *
 * Displays comprehensive incident information including:
 * - Incident overview and timeline
 * - Student information
 * - Witness statements
 * - Follow-up actions
 * - Attachments and documentation
 * - Activity log
 * - Parent notification status
 */
export default function IncidentDetailsPage({ params }: IncidentDetailsPageProps) {
  return <IncidentReportDetails incidentId={params.id} />
}
