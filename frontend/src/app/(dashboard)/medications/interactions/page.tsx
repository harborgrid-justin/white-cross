/**
 * @fileoverview Drug Interaction Checker Page
 * @module app/(dashboard)/medications/interactions/page
 *
 * Checks for potential drug interactions between medications.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { PageHeader } from '@/components/layouts/PageHeader';
import DrugInteractionChecker from '@/components/medications/advanced/DrugInteractionChecker';
import { BeakerIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Drug Interaction Checker',
  description: 'Check for potential drug interactions between medications'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

interface InteractionsPageProps {
  searchParams: {
    medicationId?: string;
    studentId?: string;
  };
}

/**
 * Drug Interaction Checker Page
 *
 * Interactive page for checking medication interactions.
 */
export default async function DrugInteractionsPage({
  searchParams
}: InteractionsPageProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Drug Interaction Checker"
        description="Check for potential interactions between medications"
        backLink="/medications"
        backLabel="Back to Medications"
      />

      {/* Information Banner */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <BeakerIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              About Drug Interaction Checking
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                This tool checks for known interactions between medications using
                the FDA Drug Interaction Database. Results are categorized by
                severity:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>
                  <strong>Major</strong>: May be life-threatening or cause
                  permanent damage
                </li>
                <li>
                  <strong>Moderate</strong>: May cause deterioration of patient
                  status
                </li>
                <li>
                  <strong>Minor</strong>: Usually does not require a change in
                  therapy
                </li>
              </ul>
              <p className="mt-2">
                <strong>Note:</strong> This is a screening tool. Always consult
                with a healthcare provider for clinical decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner for Automatic Checks */}
      {(searchParams.medicationId || searchParams.studentId) && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Automated Check in Progress
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Checking interactions for the selected medication(s).
                  This may take a few moments...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Interaction Checker Component */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <Suspense fallback={<InteractionCheckerSkeleton />}>
          <DrugInteractionChecker
            initialMedicationId={searchParams.medicationId}
            initialStudentId={searchParams.studentId}
          />
        </Suspense>
      </div>

      {/* Additional Resources */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Additional Resources
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ResourceCard
            title="FDA Drug Safety"
            description="FDA drug safety communications and alerts"
            href="https://www.fda.gov/drugs/drug-safety-and-availability"
          />
          <ResourceCard
            title="MedlinePlus"
            description="Comprehensive medication information"
            href="https://medlineplus.gov/druginformation.html"
          />
          <ResourceCard
            title="Poison Control"
            description="Emergency poison control information"
            href="https://www.poisonhelp.org"
          />
          <ResourceCard
            title="Medication Guide"
            description="Patient medication guides and information"
            href="https://www.fda.gov/drugs/drug-safety-and-availability/medication-guides"
          />
        </div>
      </div>

      {/* Common Interaction Warnings */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Common Interaction Warnings
        </h2>
        <div className="space-y-3">
          <InteractionWarning
            title="Antibiotics + Antacids"
            description="Antacids can reduce the absorption of certain antibiotics. Take antibiotics at least 2 hours before or 6 hours after antacids."
            severity="moderate"
          />
          <InteractionWarning
            title="Blood Thinners + NSAIDs"
            description="NSAIDs (like ibuprofen) can increase bleeding risk when taken with blood thinners. Use with caution and under medical supervision."
            severity="major"
          />
          <InteractionWarning
            title="Stimulants + Decongestants"
            description="Combining stimulant medications with decongestants can increase blood pressure and heart rate. Monitor closely."
            severity="moderate"
          />
          <InteractionWarning
            title="Grapefruit + Certain Medications"
            description="Grapefruit can interfere with many medications including statins, some blood pressure medications, and immunosuppressants."
            severity="moderate"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Resource Card Component
 */
function ResourceCard({
  title,
  description,
  href
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all"
    >
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
      <p className="mt-2 text-xs text-blue-600 flex items-center">
        Visit resource
        <svg
          className="ml-1 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </p>
    </a>
  );
}

/**
 * Interaction Warning Component
 */
function InteractionWarning({
  title,
  description,
  severity
}: {
  title: string;
  description: string;
  severity: 'major' | 'moderate' | 'minor';
}) {
  const severityColors = {
    major: 'border-red-200 bg-red-50',
    moderate: 'border-yellow-200 bg-yellow-50',
    minor: 'border-blue-200 bg-blue-50'
  };

  const severityBadgeColors = {
    major: 'bg-red-100 text-red-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    minor: 'bg-blue-100 text-blue-800'
  };

  return (
    <div className={`rounded-lg border p-4 ${severityColors[severity]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="mt-1 text-sm text-gray-700">{description}</p>
        </div>
        <span
          className={`ml-4 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${severityBadgeColors[severity]}`}
        >
          {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </span>
      </div>
    </div>
  );
}

/**
 * Interaction Checker Loading Skeleton
 */
function InteractionCheckerSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-12 w-full rounded bg-gray-200"></div>
        <div className="h-12 w-full rounded bg-gray-200"></div>
      </div>
      <div className="h-64 rounded bg-gray-100"></div>
    </div>
  );
}
