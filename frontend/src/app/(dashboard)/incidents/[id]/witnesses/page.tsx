/**
 * @fileoverview Incident Witnesses List Page - Displays all witnesses associated with an
 * incident, tracks statement collection status, and manages witness testimony workflow.
 *
 * @module app/(dashboard)/incidents/[id]/witnesses/page
 * @category Incidents - Witness Management
 *
 * ## Overview
 * Provides comprehensive view of all witnesses for an incident including their type (student,
 * teacher, staff, parent, other), statement status, and quick actions for statement collection.
 * Manages the complete witness testimony workflow from identification through statement
 * verification.
 *
 * ## Witness Types
 * - **STUDENT**: Student witnesses (requires parental consent for minors)
 * - **TEACHER**: Teaching staff witnesses
 * - **STAFF**: Non-teaching staff (administrators, nurses, support staff)
 * - **PARENT**: Parent or guardian witnesses
 * - **VISITOR**: School visitors or volunteers
 * - **OTHER**: External witnesses (police, EMT, etc.)
 *
 * ## Statement Status Workflow
 * ```
 * IDENTIFIED → PENDING (awaiting statement) → COLLECTED (statement provided) → VERIFIED (reviewed and approved)
 * ```
 *
 * ### Status Indicators
 * - **Pending** (yellow badge): Witness identified but statement not yet collected
 * - **Statement Provided** (green badge): Witness has provided testimony
 * - Urgent statement collection prompts for critical witnesses
 *
 * ## Witness Privacy & Consent
 * - **Student Witnesses**: Require parental notification and consent (for minors)
 * - **Confidential Identity**: Option to protect witness identity in certain cases
 * - **Statement Privacy**: Statements restricted to authorized personnel only
 * - **FERPA Compliance**: Student witness information protected per federal law
 *
 * ## Statement Collection Process
 * 1. **Identify Witness**: Add witness to incident via "Add Witness" button
 * 2. **Schedule Collection**: Determine appropriate time and setting for statement
 * 3. **Collect Statement**: Navigate to statement form via "Collect Statement" button
 * 4. **Review & Verify**: Administrator reviews statement for accuracy
 * 5. **Finalize**: Statement locked and timestamp recorded
 *
 * ## Integration Points
 * - **Incident Records**: All witnesses linked to parent incident
 * - **Student Directory**: Student witnesses auto-populated from student records
 * - **Staff Directory**: Staff witnesses retrieved from HR system
 * - **Parent Portal**: Parent consent workflow for minor witnesses
 * - **Audit System**: All witness access and statement collection logged
 * - **Notification System**: Alerts for statement collection deadlines
 *
 * ## Compliance Requirements
 * - **Timely Collection**: Statements collected within 24-48 hours of incident (recommended)
 * - **Documentation**: All witness interactions documented for legal compliance
 * - **Consent Tracking**: Parental consent recorded for minor witnesses
 * - **Privacy Protection**: Witness identities protected in sensitive cases
 * - **Retention**: Witness records retained with incident (7+ years)
 *
 * ## User Actions
 * - **Add Witness**: Navigate to witness addition form
 * - **View Details**: Click witness card to see full information
 * - **Collect Statement**: Direct link to statement collection form
 * - **Back to Incident**: Return to incident detail page
 *
 * @see {@link listIncidentWitnesses} for server action fetching witness data
 * @see {@link /incidents/[id]/witnesses/add} for adding new witnesses
 * @see {@link /incidents/[id]/witnesses/[witnessId]/statement} for statement collection
 *
 * @example
 * ```tsx
 * // Rendered at route: /incidents/[id]/witnesses
 * <WitnessesPage params={{ id: "incident-uuid" }} />
 * ```
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

// Force dynamic rendering due to auth requirements and real-time witness data
export const dynamic = "force-dynamic";

/**
 * Witnesses List Page Component
 *
 * Displays grid of witness cards with statement collection status and quick actions.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.params - Next.js route params
 * @param {string} props.params.id - Incident UUID
 * @returns {JSX.Element} Grid of witness cards with status badges and collection buttons
 */
export default function WitnessesPage({
  params,
}: {
  params: { id: string };
}) {
  // Mock data - would fetch from API via listIncidentWitnesses(params.id)
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
