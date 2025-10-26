/**
 * @fileoverview Create New Incident Report - Multi-step form
 * @module app/incidents/new/page
 * @version 1.0.0
 */

import React from 'react'
import { Metadata } from 'next'
import CreateIncidentReport from '@/components/features/incidents/CreateIncidentReport'

export const metadata: Metadata = {
  title: 'New Incident Report | Incidents | White Cross',
  description: 'Create a new incident report',
}

/**
 * Create Incident Report Page
 *
 * Multi-step form for creating incident reports with:
 * - Student selection
 * - Incident details (type, severity, location, description)
 * - Witness information
 * - File attachments
 * - Parent notification options
 * - Follow-up requirements
 */
export default function NewIncidentPage() {
  return <CreateIncidentReport />
}
