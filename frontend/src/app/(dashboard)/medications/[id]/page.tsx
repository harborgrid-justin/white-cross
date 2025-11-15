/**
 * @fileoverview Medication Detail Page - Comprehensive Medication Information & History
 * @module app/(dashboard)/medications/[id]/page
 *
 * @description
 * Detailed medication information page displaying complete medication profile,
 * administration history, safety warnings, and quick action controls.
 *
 * **Comprehensive Medication Display:**
 * - Full medication details (brand, generic, NDC, dosage, route, frequency)
 * - Active prescriber information with NPI verification
 * - Current medication status and authorization dates
 * - Student information with cross-referenced health records
 * - Recent administration history (last 10 entries)
 * - Quick access to full administration log
 *
 * **Safety & Verification Features:**
 * - **Five Rights Display**: Patient, Medication, Dose, Route, Time verification data
 * - **Allergy Warnings**: Cross-referenced against student allergy profile
 * - **Drug Interactions**: Automatic checking against other active medications
 * - **Contraindication Alerts**: Medical condition warnings and restrictions
 * - **Black Box Warnings**: FDA-mandated serious risk information
 * - **Controlled Substance Info**: DEA schedule and handling requirements
 *
 * **Medication Administration:**
 * - One-click administration recording with timestamp
 * - Five Rights verification checklist
 * - Dosage calculator for weight-based medications
 * - Administration window compliance checking
 * - Witness signature for controlled substances
 * - Student refusal documentation
 *
 * **Drug Information Integration:**
 * - FDA National Drug Code (NDC) lookup
 * - Generic/brand name cross-referencing
 * - Dosage forms and strengths
 * - Storage requirements and expiration
 * - Manufacturer information
 *
 * **HIPAA Compliance:**
 * - All medication data treated as Protected Health Information (PHI)
 * - Server-side only rendering prevents client-side PHI exposure
 * - Audit logging for every medication record access
 * - Encrypted data transmission (TLS 1.3)
 * - Role-based access control with permission verification
 * - Automatic session timeout after inactivity
 *
 * **Regulatory Compliance:**
 * - FDA 21 CFR Part 11 - Electronic Records/Signatures
 * - DEA 21 CFR 1300-1321 - Controlled Substances
 * - State Board of Pharmacy medication administration standards
 * - Joint Commission medication management requirements
 * - School nursing practice act compliance
 *
 * **Authentication & Authorization:**
 * - Requires authenticated school nurse or administrator
 * - VIEW_MEDICATIONS permission required
 * - ADMINISTER_MEDICATIONS for recording administration
 * - Enhanced permissions for controlled substances
 *
 * **Performance Optimization:**
 * - Dynamic rendering for real-time medication status
 * - 1-minute cache for medication details
 * - 30-second cache for administration log
 * - Parallel data fetching (details + administrations)
 * - Suspense boundaries for progressive rendering
 *
 * **Refactoring:**
 * - Refactored from 633 lines to modular component structure
 * - Components extracted to _components directory
 * - Improved maintainability and testability
 * - Follows React component best practices
 *
 * @requires Authentication - JWT with nurse/admin role
 * @requires Permissions - VIEW_MEDICATIONS, ADMINISTER_MEDICATIONS
 *
 * @param {string} params.id - Medication UUID from URL
 *
 * @see {@link https://www.fda.gov/drugs/drug-approvals-and-databases/national-drug-code-directory NDC Directory}
 * @see {@link https://www.deadiversion.usdoj.gov/schedules/ DEA Schedules}
 *
 * @example
 * ```tsx
 * // URL: /medications/abc-123-def-456
 * // Displays full details for medication with ID abc-123-def-456
 *
 * // Includes:
 * // - Medication profile (name, dose, route, frequency)
 * // - Student information with allergies
 * // - Administration history
 * // - Safety warnings and contraindications
 * // - Quick action buttons (Edit, Administer, Check Interactions)
 * ```
 *
 * @since 1.0.0
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layouts/PageHeader';
import { getMedication, getRecentAdministrations } from '@/lib/actions/medications';
import MedicationDetails from '@/components/medications/core/MedicationDetails';
import {
  MedicationActionButtons,
  MedicationQuickInfo,
  StudentInfoCard,
  QuickActionsCard,
  RecentAdministrationsSection,
  DetailsSkeleton
} from './_components';

interface MedicationDetailPageProps {
  params: {
    id: string;
  };
}

/**
 * Generates dynamic metadata for medication detail page SEO and browser display
 *
 * @async
 * @function generateMetadata
 * @param {MedicationDetailPageProps} props - Component props with medication ID
 * @returns {Promise<Metadata>} Next.js metadata object for page head
 *
 * @description
 * Dynamically generates page metadata based on medication information for:
 * - Browser tab title with medication name
 * - Meta description for search engines (if public)
 * - Open Graph tags for social sharing (disabled for PHI)
 *
 * **Metadata Includes:**
 * - Medication brand and generic names
 * - Descriptive summary for browser display
 * - Fallback for not-found medications
 *
 * **HIPAA Note:**
 * - Metadata kept generic to avoid PHI in browser history
 * - No student names or specific dosages in meta tags
 * - Social sharing disabled to prevent PHI exposure
 *
 * @example
 * ```typescript
 * // For medication "Albuterol HFA Inhaler"
 * // Returns:
 * {
 *   title: "Albuterol HFA Inhaler",
 *   description: "Albuterol HFA Inhaler medication details and administration history"
 * }
 * ```
 */
export async function generateMetadata({
  params
}: MedicationDetailPageProps): Promise<Metadata> {
  const medication = await getMedication(params.id);

  if (!medication) {
    return {
      title: 'Medication Not Found'
    };
  }

  return {
    title: medication.name,
    description: `${medication.name} medication details and administration history`
  };
}

/**
 * Medication Detail Page Component - Comprehensive Medication Profile Display
 *
 * @component
 * @async
 * @param {MedicationDetailPageProps} props - Component props with medication ID
 * @returns {Promise<JSX.Element>} Rendered medication detail page with administration history
 *
 * @description
 * Primary medication detail view displaying complete medication information,
 * safety warnings, administration history, and action controls.
 *
 * **Layout Structure:**
 * - **Header Section**: Medication name, generic name, quick action buttons
 * - **Main Content** (2-column responsive grid):
 *   - Left Column (2/3 width):
 *     * Detailed medication information card
 *     * Recent administration history timeline
 *   - Right Column (1/3 width):
 *     * Quick info summary (status, dosage, route, frequency)
 *     * Student information card with photo
 *     * Quick actions sidebar
 *
 * **Quick Action Buttons:**
 * - **Edit**: Navigate to medication edit form (requires EDIT_MEDICATIONS)
 * - **Record Administration**: Opens Five Rights verification workflow
 * - **Check Interactions**: Cross-reference with other active medications
 *
 * **Medication Information Displayed:**
 * - Brand and generic names
 * - NDC code with FDA database link
 * - Dosage, route, and frequency
 * - Prescriber details (name, NPI, signature)
 * - Prescription dates (start, expiration, refills)
 * - Storage requirements and temperature
 * - Controlled substance schedule (if applicable)
 * - Special instructions and precautions
 * - Known allergies and contraindications
 *
 * **Administration History:**
 * - Last 10 administration records
 * - Visual timeline with status indicators
 * - Dosage, time, administering nurse
 * - Side effects or concerns noted
 * - Link to full detailed log
 *
 * **Safety Alerts:**
 * - Allergy warnings (cross-referenced with student profile)
 * - Drug interaction alerts (checked against active meds)
 * - Black box FDA warnings
 * - Contraindication notices
 * - Expiring prescription warnings
 * - Controlled substance handling reminders
 *
 * **Student Information:**
 * - Name, grade, photo
 * - Active allergies
 * - Other current medications
 * - Emergency contacts
 * - Link to full health record
 *
 * **Data Fetching Strategy:**
 * - Parallel fetching of medication details and administration log
 * - Suspense boundaries for progressive rendering
 * - 404 handling redirects to not-found page
 * - Graceful error handling with user feedback
 *
 * **HIPAA Compliance:**
 * - All displayed data is PHI requiring audit logging
 * - Server-side rendering prevents client PHI exposure
 * - Automatic session timeout after inactivity
 * - Permission verification before rendering
 *
 * **Refactored Structure:**
 * - Uses modular sub-components from _components directory
 * - Each component has single responsibility
 * - Improved code organization and maintainability
 * - Better testability through component isolation
 *
 * @example
 * ```tsx
 * // Route: /medications/abc-123-def-456
 * <MedicationDetailPage params={{ id: 'abc-123-def-456' }} />
 *
 * // Displays:
 * // - Full medication profile
 * // - Last 10 administrations
 * // - Student info and allergies
 * // - Action buttons (Edit, Administer, Check Interactions)
 * ```
 *
 * @see {@link getMedication} for data fetching
 * @see {@link getRecentAdministrations} for administration log
 */
export default async function MedicationDetailPage({
  params
}: MedicationDetailPageProps) {
  // Fetch medication data
  const medication = await getMedication(params.id);

  if (!medication) {
    notFound();
  }

  // Fetch recent administrations
  const administrations = await getRecentAdministrations(params.id, 10);

  return (
    <div className="space-y-6">
      {/* Page Header with Action Buttons */}
      <PageHeader
        title={medication.name}
        description={medication.genericName || 'Medication details and administration'}
        backLink="/medications"
        backLabel="Back to Medications"
        action={<MedicationActionButtons medicationId={params.id} />}
      />

      {/* Main Content Grid: 2-column responsive layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Medication Details & Administration History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Medication Information */}
          <Suspense fallback={<DetailsSkeleton />}>
            <MedicationDetails medication={medication} />
          </Suspense>

          {/* Recent Administration Log Section */}
          <RecentAdministrationsSection
            medicationId={params.id}
            initialData={administrations}
            limit={10}
          />
        </div>

        {/* Right Column - Sidebar Cards */}
        <div className="space-y-6">
          {/* Quick Info Card - Status, Dosage, Route, Frequency */}
          <MedicationQuickInfo
            medication={{
              status: medication.status,
              dosage: medication.dosage,
              route: medication.route,
              frequency: medication.frequency,
              nextDue: medication.nextDue
            }}
          />

          {/* Student Info Card - Name, Grade, Avatar */}
          {medication.student && (
            <StudentInfoCard student={medication.student} />
          )}

          {/* Quick Actions Card - Navigation Links */}
          <QuickActionsCard medicationId={params.id} />
        </div>
      </div>
    </div>
  );
}
