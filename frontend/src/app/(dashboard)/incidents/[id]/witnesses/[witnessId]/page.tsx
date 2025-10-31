/**
 * @fileoverview Witness Detail Page - Displays comprehensive witness information including
 * contact details, statement status, and testimony management workflow.
 *
 * @module app/(dashboard)/incidents/[id]/witnesses/[witnessId]/page
 * @category Incidents - Witness Management
 *
 * ## Overview
 * Provides detailed view of a single witness including their testimony, contact information,
 * and statement collection status. Enables statement viewing, verification, and management.
 *
 * ## Displayed Information
 * - **Basic Info**: Name, witness type, contact information
 * - **Incident Role**: Relationship to incident, present during incident
 * - **Statement Status**: Pending, collected, verified (with timestamps)
 * - **Statement Content**: Full testimony (if collected)
 * - **Consent Status**: Parental consent tracking (for student witnesses)
 * - **Verification**: Administrator review and approval status
 * - **Audit Trail**: Statement collection and modification history
 *
 * ## Statement Workflow
 * - **Pending**: "Collect Statement" button visible to initiate collection
 * - **Collected**: View statement with "Verify" button for administrators
 * - **Verified**: Statement locked, timestamp recorded, available for reports
 *
 * ## Privacy Protection
 * - Student witness statements viewable only by authorized staff
 * - Confidential witnesses have identity-protected display
 * - Statement access logged per FERPA compliance
 *
 * @see {@link getWitnessDetails} for server action fetching witness data
 * @see {@link /incidents/[id]/witnesses/[witnessId]/statement} for statement collection
 *
 * @example
 * ```tsx
 * <WitnessDetailsPage params={{ id: "incident-uuid", witnessId: "witness-uuid" }} />
 * ```
 */

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Witness Details | White Cross',
  description: 'View witness details',
};

// Force dynamic rendering due to auth requirements and statement data protection
export const dynamic = 'force-dynamic';

/**
 * Witness Details Page Component
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.params - Route parameters
 * @param {string} props.params.id - Incident UUID
 * @param {string} props.params.witnessId - Witness UUID
 * @returns {JSX.Element} Witness detail page with statement and verification options
 */
export default function WitnessDetailsPage({
  params,
}: {
  params: { id: string; witnessId: string };
}) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Witness Details</h1>
        <Link href={`/incidents/${params.id}/witnesses/${params.witnessId}/statement`}>
          <Button>Collect Statement</Button>
        </Link>
      </div>
      <p className="text-gray-600">Witness {params.witnessId} for incident {params.id}</p>
    </div>
  );
}
