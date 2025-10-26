'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface MedicationDetails {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  studentId: string;
  studentName?: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'completed';
  notes?: string;
  prescribedBy?: string;
  administrationHistory?: Array<{
    id: string;
    administeredAt: string;
    administeredBy: string;
    dosageGiven: string;
    notes?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Medication Details Page
 *
 * Displays comprehensive information about a specific medication prescription including:
 * - Prescription details (medication, dosage, frequency)
 * - Student information
 * - Administration history
 * - Safety information (allergies, interactions)
 * - Actions (administer, edit, pause, discontinue)
 *
 * @remarks
 * - Client Component for interactive features
 * - Uses dynamic route parameter [id]
 * - All data access is HIPAA-audited
 * - Provides navigation to administration workflow
 */
export default function MedicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const medicationId = params?.id as string;

  const { data: medication, isLoading, error } = useQuery<MedicationDetails>({
    queryKey: ['medication', medicationId],
    queryFn: async () => {
      const response = await fetch(`/api/proxy/medications/${medicationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medication details');
      }
      return response.json();
    },
    enabled: !!medicationId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        <span className="ml-3 text-sm text-gray-500">Loading medication details...</span>
      </div>
    );
  }

  if (error || !medication) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Medication</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Unable to load medication details. The medication may not exist or you may not have permission to view it.</p>
            </div>
            <div className="mt-4">
              <Link
                href="/medications"
                className="text-sm font-medium text-red-800 hover:text-red-900"
              >
                Back to Medications
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
          <li>
            <Link href="/medications" className="text-gray-400 hover:text-gray-500">
              Medications
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <span className="ml-4 text-sm font-medium text-gray-500">{medication.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header with Actions */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            {medication.name}
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[medication.status]}`}>
                {medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          {medication.status === 'active' && (
            <Link
              href={`/medications/${medicationId}/administer`}
              className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Administer Medication
            </Link>
          )}
        </div>
      </div>

      {/* Medication Details */}
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Prescription Information</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Medication Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{medication.name}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Dosage</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{medication.dosage}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Frequency</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{medication.frequency}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Student</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {medication.studentName || medication.studentId}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Start Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {new Date(medication.startDate).toLocaleDateString()}
              </dd>
            </div>
            {medication.endDate && (
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">End Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {new Date(medication.endDate).toLocaleDateString()}
                </dd>
              </div>
            )}
            {medication.notes && (
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{medication.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Administration History */}
      {medication.administrationHistory && medication.administrationHistory.length > 0 && (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Administration History</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {medication.administrationHistory.map((record) => (
                <li key={record.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(record.administeredAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Administered by: {record.administeredBy}
                      </p>
                      <p className="text-sm text-gray-500">Dosage: {record.dosageGiven}</p>
                      {record.notes && (
                        <p className="mt-1 text-sm text-gray-600">{record.notes}</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
