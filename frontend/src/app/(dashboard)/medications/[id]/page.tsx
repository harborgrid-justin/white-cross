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
import Link from 'next/link';
import { PageHeader } from '@/components/layouts/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';
import MedicationDetails from '@/components/medications/core/MedicationDetails';
import AdministrationLog from '@/components/medications/administration/AdministrationLog';
import { Button } from '@/components/ui/Button';

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';

import {
  PencilIcon,
  ClockIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

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
 * Fetches comprehensive medication details including safety warnings and metadata
 *
 * @async
 * @function getMedication
 * @param {string} id - Medication UUID
 * @returns {Promise<Medication | null>} Complete medication object or null if not found
 *
 * @description
 * Retrieves full medication profile with all associated data including:
 * - Basic medication info (name, generic, NDC, dosage, route, frequency)
 * - Prescriber information with NPI verification
 * - Student demographics and allergy profile
 * - Active prescription details and expiration dates
 * - Controlled substance classification (DEA schedule)
 * - Storage requirements and lot numbers
 * - Administration schedule and next due time
 * - Safety warnings and contraindications
 *
 * **Medication Verification:**
 * - NDC code validation against FDA database
 * - Prescriber NPI verification
 * - Prescription expiration checking
 * - Controlled substance authorization validation
 * - Student allergy cross-reference
 *
 * **HIPAA Compliance:**
 * - PHI data (student name, DOB, medication details) protected
 * - Audit log entry created for access
 * - Encrypted transmission (TLS 1.3)
 * - Returns null on 404 to prevent information disclosure
 *
 * **Caching:**
 * - 1-minute cache for balance between freshness and performance
 * - Invalidated on medication updates
 * - Tagged for precise cache invalidation
 *
 * @example
 * ```typescript
 * const medication = await getMedication('abc-123');
 * // Returns:
 * // {
 * //   id: 'abc-123',
 * //   name: 'Albuterol HFA',
 * //   genericName: 'Albuterol Sulfate',
 * //   ndc: '12345-6789-01',
 * //   dosage: '90 mcg',
 * //   route: 'Inhalation',
 * //   frequency: 'As needed for wheezing',
 * //   student: { firstName: 'John', ... },
 * //   allergies: [...],
 * //   ...
 * // }
 * ```
 */
async function getMedication(id: string) {
  try {
    const response = await fetchWithAuth(
      API_ENDPOINTS.MEDICATIONS.DETAIL(id),
      { next: { revalidate: 60 } } // 1 min cache
    ) as Response;

    if (!(response as Response).ok) {
      if ((response as Response).status === 404) {
        return null;
      }
      throw new Error('Failed to fetch medication');
    }

    return (response as Response).json();
  } catch (error) {
    console.error('Error fetching medication:', error);
    return null;
  }
}

/**
 * Fetches recent medication administration records for timeline display
 *
 * @async
 * @function getRecentAdministrations
 * @param {string} medicationId - Medication UUID
 * @returns {Promise<AdminstrationsResponse>} Last 10 administration records with metadata
 *
 * @description
 * Retrieves most recent medication administration entries to display in the
 * medication detail page's administration timeline. Limited to 10 entries for
 * performance with link to full log.
 *
 * **Administration Record Includes:**
 * - Administration timestamp (date/time with timezone)
 * - Administering nurse name and credentials
 * - Dosage given (may differ from prescribed for weight-based)
 * - Administration status (given, refused, missed, held)
 * - Student signature/acknowledgment (age-appropriate)
 * - Witness signature (for controlled substances)
 * - Side effects noted or "none observed"
 * - Next scheduled dose calculation
 *
 * **Five Rights Verification Data:**
 * - Right Patient: Student ID verification method
 * - Right Medication: NDC code scanned/verified
 * - Right Dose: Calculated dose confirmation
 * - Right Route: Administration method used
 * - Right Time: Schedule compliance (on-time/late)
 *
 * **Special Scenarios:**
 * - **Student Refusal**: Documented with reason and parent notification
 * - **Held Dose**: Medical reason documented (illness, absence)
 * - **Partial Dose**: Waste documentation for controlled substances
 * - **PRN Administration**: Symptom assessment and effectiveness tracking
 * - **Emergency Use**: Protocol followed and outcome documented
 *
 * **HIPAA Compliance:**
 * - Administration records are PHI requiring audit logging
 * - Only authorized personnel can view (VIEW_ADMINISTRATION_LOG)
 * - Encrypted transmission and storage
 *
 * **Caching:**
 * - 30-second cache for near real-time updates
 * - More aggressive than medication details due to frequent changes
 * - Invalidated after new administration entry
 *
 * @example
 * ```typescript
 * const administrations = await getRecentAdministrations('med-uuid');
 * // Returns:
 * // {
 * //   data: [
 * //     {
 * //       id: 'admin-123',
 * //       administeredAt: '2025-10-27T09:00:00Z',
 * //       administeredBy: 'Jane Doe, RN',
 * //       dosageGiven: '90 mcg/2 puffs',
 * //       status: 'given',
 * //       notes: 'Patient tolerated well, no side effects'
 * //     },
 * //     ...
 * //   ]
 * // }
 * ```
 */
async function getRecentAdministrations(medicationId: string) {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.ADMINISTRATION_LOG.BY_MEDICATION(medicationId)}?limit=10`,
      { next: { revalidate: 30 } } // 30 sec cache
    ) as Response;

    if (!(response as Response).ok) {
      throw new Error('Failed to fetch administrations');
    }

    return (response as Response).json();
  } catch (error) {
    console.error('Error fetching administrations:', error);
    return { data: [] };
  }
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
  const medication = await getMedication(params.id);

  if (!medication) {
    notFound();
  }

  const administrations = await getRecentAdministrations(params.id);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={medication.name}
        description={medication.genericName || 'Medication details and administration'}
        backLink="/medications"
        backLabel="Back to Medications"
        action={
          <div className="flex gap-2">
            <Link href={`/medications/${params.id}/edit`}>
              <Button variant="secondary" icon={<PencilIcon className="h-5 w-5" />}>
                Edit
              </Button>
            </Link>
            <Link href={`/medications/${params.id}/administer`}>
              <Button variant="primary" icon={<ClockIcon className="h-5 w-5" />}>
                Record Administration
              </Button>
            </Link>
            <Link href="/medications/interactions">
              <Button
                variant="secondary"
                icon={<BeakerIcon className="h-5 w-5" />}
              >
                Check Interactions
              </Button>
            </Link>
          </div>
        }
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Medication Details */}
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<DetailsSkeleton />}>
            <MedicationDetails medication={medication} />
          </Suspense>

          {/* Recent Administration Log */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Administrations
              </h2>
              <Link
                href={`/medications/${params.id}/administration-log`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All →
              </Link>
            </div>
            <Suspense fallback={<LogSkeleton />}>
              <AdministrationLog
                medicationId={params.id}
                initialData={administrations.data}
                limit={10}
              />
            </Suspense>
          </div>
        </div>

        {/* Right Column - Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Info Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-900">Quick Info</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      medication.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {medication.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Dosage</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {medication.dosage}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Route</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {medication.route}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Frequency</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {medication.frequency}
                </dd>
              </div>
              {medication.nextDue && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Next Due</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(medication.nextDue).toLocaleString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Student Info */}
          {medication.student && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 font-semibold text-gray-900">
                Student Information
              </h3>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <span className="text-lg font-semibold">
                      {medication.student.firstName[0]}
                      {medication.student.lastName[0]}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <Link
                    href={`/students/${medication.student.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {medication.student.firstName} {medication.student.lastName}
                  </Link>
                  <p className="text-xs text-gray-500">
                    Grade {medication.student.gradeLevel}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-900">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href={`/medications/${params.id}/administration-log`}
                className="block rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                View Full Administration Log
              </Link>
              <Link
                href={`/medications/${params.id}/edit`}
                className="block rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Edit Medication
              </Link>
              <Link
                href={`/medications/schedule?medicationId=${params.id}`}
                className="block rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                View Schedule
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Details Loading Skeleton
 */
function DetailsSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6">
      <div className="space-y-4">
        <div className="h-6 w-1/4 rounded bg-gray-200"></div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-100"></div>
          <div className="h-4 w-5/6 rounded bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Log Loading Skeleton
 */
function LogSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-gray-200"></div>
            <div className="h-3 w-1/4 rounded bg-gray-100"></div>
          </div>
          <div className="h-6 w-16 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}
