/**
 * @fileoverview Collect Witness Statement Page - Form for documenting witness testimony
 * with structured questions, free-form narrative, and verification workflow.
 *
 * @module app/(dashboard)/incidents/[id]/witnesses/[witnessId]/statement/page
 * @category Incidents - Witness Management
 *
 * ## Overview
 * Provides comprehensive form for collecting and documenting witness statements. Includes
 * structured questions, free-form testimony, and timestamps for legal validity. Ensures
 * proper documentation for incident investigation and compliance.
 *
 * ## Statement Collection Process
 * 1. **Introduction**: Explain statement purpose and witness rights
 * 2. **Consent Confirmation**: Verify witness willingness and consent (parental for minors)
 * 3. **Structured Questions**: Answer specific incident-related questions
 * 4. **Narrative Testimony**: Free-form description of what witness observed
 * 5. **Review**: Witness reviews statement for accuracy
 * 6. **Acknowledgment**: Witness acknowledges truthfulness and accuracy
 * 7. **Finalization**: Statement locked with timestamp and digital signature
 *
 * ## Form Sections
 * - **Witness Information**: Name, type, date/time of statement collection
 * - **Incident Context**: Where witness was, what they were doing during incident
 * - **Observations**: What witness saw, heard, or experienced directly
 * - **Timeline**: Sequence of events from witness perspective
 * - **Other Parties**: Other people present or involved that witness observed
 * - **Additional Information**: Any other relevant details
 * - **Acknowledgment**: Witness affirmation of truth and accuracy
 *
 * ## Statement Requirements
 * - Minimum 50 characters for testimony (ensures substantive statement)
 * - Timestamp recorded at collection start and completion
 * - Collecting staff member identified and logged
 * - Witness acknowledgment required (signature, checkbox, or verbal recorded)
 * - Parental co-signature required for minor student witnesses
 *
 * ## Privacy & Legal Considerations
 * - **FERPA Compliance**: Student witness statements protected
 * - **Confidentiality**: Statements accessible only to authorized personnel
 * - **Immutability**: Once finalized, statements cannot be edited (version tracking)
 * - **Chain of Custody**: All access and viewing logged for legal validity
 * - **Retention**: Statements retained with incident per district policy (7+ years)
 *
 * ## Integration Points
 * - **Incident Records**: Statement linked to parent incident and witness record
 * - **Audit System**: Collection timestamp, collector ID, and access logged
 * - **Notification System**: Witness and parents notified of statement completion
 * - **Document Management**: Statement can be exported to PDF for legal proceedings
 *
 * ## User Experience
 * - **Auto-save**: Statement auto-saved every 30 seconds during collection
 * - **Progress Indicator**: Shows completion percentage of required fields
 * - **Review Mode**: Witness can review before final submission
 * - **Edit Window**: 15-minute window after submission for corrections
 * - **Print/Export**: Statement can be printed for witness records
 *
 * @see {@link WitnessStatementForm} for form component with validation
 * @see {@link saveWitnessStatement} for server action handling submission
 * @see {@link /incidents/[id]/witnesses/[witnessId]} for return after completion
 *
 * @example
 * ```tsx
 * // Rendered at route: /incidents/[id]/witnesses/[witnessId]/statement
 * <WitnessStatementPage params={{ id: "incident-uuid", witnessId: "witness-uuid" }} />
 * ```
 */

'use client';

import React from 'react';
import { WitnessStatementForm } from '@/components/incidents/WitnessStatementForm';
import { useRouter } from 'next/navigation';

// Force dynamic rendering due to auth requirements and CSRF protection
export const dynamic = 'force-dynamic';

/**
 * Witness Statement Collection Page Component
 *
 * Client component rendering form for collecting witness testimony with
 * structured questions, narrative input, and acknowledgment workflow.
 *
 * @component
 * @client
 * @param {Object} props - Component props
 * @param {Object} props.params - Route parameters
 * @param {string} props.params.id - Incident UUID
 * @param {string} props.params.witnessId - Witness UUID
 * @returns {JSX.Element} Statement collection form with validation and success handling
 */
export default function WitnessStatementPage({
  params,
}: {
  params: { id: string; witnessId: string };
}) {
  const router = useRouter();

  /**
   * Success handler - redirects to witness detail page after statement submission
   */
  const handleSuccess = () => {
    router.push(`/incidents/${params.id}/witnesses/${params.witnessId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Collect Witness Statement</h1>
      <WitnessStatementForm
        incidentId={params.id}
        witnessId={params.witnessId}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
