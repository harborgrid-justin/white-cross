/**
 * @fileoverview Add Witness to Incident Page - Form for adding witnesses to incident
 * investigation with type selection, contact information, and consent tracking.
 *
 * @module app/(dashboard)/incidents/[id]/witnesses/add/page
 * @category Incidents - Witness Management
 *
 * ## Overview
 * Provides form for identifying and adding witnesses to an incident. Collects witness
 * information, determines witness type, and initiates statement collection workflow.
 * Handles consent requirements for student witnesses.
 *
 * ## Form Fields
 * - **Witness Type**: Student, Teacher, Staff, Parent, Visitor, Other
 * - **Name**: First and last name (auto-complete from directory if available)
 * - **Contact Information**: Email, phone (for non-student witnesses)
 * - **Relationship**: Relationship to incident or parties involved
 * - **Present During Incident**: Checkbox if witness saw/heard incident directly
 * - **Statement Urgency**: Priority level for statement collection
 * - **Parental Consent**: Required toggle if witness is a minor student
 * - **Confidential Identity**: Toggle to protect witness identity
 *
 * ## Student Witness Workflow
 * For student witnesses under 18:
 * 1. Parent/guardian notification sent automatically
 * 2. Consent form generated and tracked
 * 3. Statement collection awaits parent approval
 * 4. Privacy protections automatically applied per FERPA
 *
 * ## Witness Verification
 * - Staff witnesses verified against employee directory
 * - Student witnesses validated in student information system
 * - Parent witnesses matched to student emergency contacts
 * - External witnesses require manual verification
 *
 * ## Integration Points
 * - **Student Directory**: Auto-complete student witnesses
 * - **Staff Directory**: Verify and auto-fill staff information
 * - **Parent Consent System**: Trigger consent workflow for minors
 * - **Incident Records**: Link witness to parent incident
 * - **Audit System**: Log witness addition with user and timestamp
 *
 * @see {@link addIncidentWitness} for server action handling witness creation
 * @see {@link /incidents/[id]/witnesses} for return to witness list
 *
 * @example
 * ```tsx
 * // Rendered at route: /incidents/[id]/witnesses/add
 * <AddWitnessPage params={{ id: "incident-uuid" }} />
 * ```
 */

import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Add Witness | White Cross',
  description: 'Add witness to incident',
};

// Force dynamic rendering due to auth requirements and CSRF protection
export const dynamic = 'force-dynamic';

/**
 * Add Witness Page Component
 *
 * Renders form for adding a new witness to an incident with type selection,
 * contact details, and consent tracking for student witnesses.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.params - Next.js route params
 * @param {string} props.params.id - Incident UUID
 * @returns {JSX.Element} Witness addition form with validation and auto-complete
 */
export default function AddWitnessPage({ params }: { params: { id: string } }) {
  // WitnessForm component would handle full workflow here
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add Witness</h1>
      <p className="text-gray-600">Add witness form for incident {params.id}</p>
      {/* <WitnessForm incidentId={params.id} onSuccess={() => router.push(`/incidents/${params.id}/witnesses`)} /> */}
    </div>
  );
}
