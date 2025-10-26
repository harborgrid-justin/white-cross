/**
 * @fileoverview Witness Statements - Manage incident witness statements
 * @module app/incidents/[id]/witnesses/page
 * @version 1.0.0
 */

import React from 'react'
import { Metadata } from 'next'
import WitnessStatements from '@/components/features/incidents/WitnessStatements'

export const metadata: Metadata = {
  title: 'Witness Statements | Incidents | White Cross',
  description: 'Manage witness statements for incident report',
}

interface WitnessStatementsPageProps {
  params: {
    id: string
  }
}

/**
 * Witness Statements Page
 *
 * Interface for managing witness statements including:
 * - List of all witness statements
 * - Add new witness statement
 * - Edit existing statements
 * - View statement details
 * - Download/print statements
 */
export default function WitnessStatementsPage({ params }: WitnessStatementsPageProps) {
  return <WitnessStatements incidentId={params.id} />
}
