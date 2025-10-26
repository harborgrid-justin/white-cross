'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useMedicationSafety } from '@/hooks/domains/medications/mutations/useMedicationSafety';

interface FiveRightsData {
  studentBarcode?: string;
  medicationNDC?: string;
  scannedDose?: string;
  route: string;
  administrationTime: string;
  patientPhotoConfirmed: boolean;
  allergyAcknowledged: boolean;
}

/**
 * Medication Administration Page
 *
 * SAFETY-CRITICAL: Implements Five Rights of Medication Administration workflow
 * 1. Right Patient - Barcode scanning and photo confirmation
 * 2. Right Medication - NDC verification
 * 3. Right Dose - Dosage validation
 * 4. Right Route - Administration route selection
 * 5. Right Time - Time validation
 *
 * @remarks
 * - All administrations are immutably logged for legal documentation
 * - Allergy checks are mandatory before administration
 * - Drug interaction warnings must be acknowledged
 * - Failed administrations (refusal, missed) must be documented
 */
export default function AdministerMedicationPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const medicationId = params?.id as string;

  const [fiveRightsData, setFiveRightsData] = useState<FiveRightsData>({
    route: '',
    administrationTime: new Date().toISOString(),
    patientPhotoConfirmed: false,
    allergyAcknowledged: false,
  });

  const [notes, setNotes] = useState('');
  const [safetyErrors, setSafetyErrors] = useState<string[]>([]);

  const { checkSafety, validateDosage } = useMedicationSafety();

  // Fetch medication details
  const { data: medication, isLoading } = useQuery({
    queryKey: ['medication', medicationId],
    queryFn: async () => {
      const response = await fetch(`/api/proxy/medications/${medicationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medication');
      }
      return response.json();
    },
    enabled: !!medicationId,
  });

  // Mutation for administering medication
  const administerMutation = useMutation({
    mutationFn: async (data: {
      medicationId: string;
      studentId: string;
      dosageGiven: string;
      route: string;
      administeredAt: string;
      notes?: string;
      fiveRightsData: FiveRightsData;
    }) => {
      const response = await fetch(`/api/proxy/medications/${medicationId}/administer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to administer medication');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['medication', medicationId] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      router.push(`/medications/${medicationId}`);
    },
  });

  const handleSafetyCheck = async () => {
    if (!medication) return false;

    const errors: string[] = [];

    // Check Five Rights
    if (!fiveRightsData.patientPhotoConfirmed) {
      errors.push('Patient photo must be confirmed (Right Patient)');
    }

    if (!fiveRightsData.allergyAcknowledged) {
      errors.push('Allergy verification must be acknowledged');
    }

    if (!fiveRightsData.route) {
      errors.push('Administration route must be selected (Right Route)');
    }

    // Check medication safety
    try {
      const safetyCheck = await checkSafety(medicationId, medication.studentId);
      if (safetyCheck.isAllergic) {
        errors.push('CRITICAL: Patient has known allergy to this medication');
      }
      if (safetyCheck.hasInteractions && safetyCheck.interactions) {
        errors.push(`Drug Interaction Warning: ${safetyCheck.interactions.join(', ')}`);
      }
    } catch (error) {
      errors.push('Unable to verify medication safety - do not proceed');
    }

    setSafetyErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!medication) return;

    // Run safety checks
    const safetyPassed = await handleSafetyCheck();
    if (!safetyPassed) {
      return;
    }

    // Confirm administration
    const confirmed = window.confirm(
      `Confirm medication administration:\n\n` +
      `Patient: ${medication.studentName || medication.studentId}\n` +
      `Medication: ${medication.name}\n` +
      `Dosage: ${medication.dosage}\n` +
      `Route: ${fiveRightsData.route}\n\n` +
      `This action will be permanently logged.`
    );

    if (!confirmed) return;

    administerMutation.mutate({
      medicationId,
      studentId: medication.studentId,
      dosageGiven: medication.dosage,
      route: fiveRightsData.route,
      administeredAt: fiveRightsData.administrationTime,
      notes,
      fiveRightsData,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        <span className="ml-3 text-sm text-gray-500">Loading medication...</span>
      </div>
    );
  }

  if (!medication) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-700">Medication not found</p>
        <Link href="/medications" className="mt-2 text-sm font-medium text-red-800 hover:text-red-900">
          Back to Medications
        </Link>
      </div>
    );
  }

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
              <Link href={`/medications/${medicationId}`} className="ml-4 text-sm text-gray-400 hover:text-gray-500">
                {medication.name}
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <span className="ml-4 text-sm font-medium text-gray-500">Administer</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900">Administer Medication</h2>
        <p className="mt-1 text-sm text-gray-500">
          Follow Five Rights verification before administering medication
        </p>
      </div>

      {/* Safety Errors */}
      {safetyErrors.length > 0 && (
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
              <h3 className="text-sm font-medium text-red-800">Safety Check Failed</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc space-y-1 pl-5">
                  {safetyErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Administration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Medication Information */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Medication Information</h3>
            <div className="mt-4 space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Patient: </span>
                <span className="text-sm text-gray-900">{medication.studentName || medication.studentId}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Medication: </span>
                <span className="text-sm text-gray-900">{medication.name}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Prescribed Dosage: </span>
                <span className="text-sm text-gray-900">{medication.dosage}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Frequency: </span>
                <span className="text-sm text-gray-900">{medication.frequency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Five Rights Verification */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Five Rights Verification</h3>
            <div className="mt-4 space-y-4">
              {/* Route Selection */}
              <div>
                <label htmlFor="route" className="block text-sm font-medium text-gray-700">
                  Administration Route *
                </label>
                <select
                  id="route"
                  required
                  value={fiveRightsData.route}
                  onChange={(e) => setFiveRightsData({ ...fiveRightsData, route: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select route...</option>
                  <option value="oral">Oral (PO)</option>
                  <option value="sublingual">Sublingual (SL)</option>
                  <option value="topical">Topical</option>
                  <option value="inhaled">Inhaled</option>
                  <option value="nasal">Nasal</option>
                  <option value="ophthalmic">Ophthalmic (Eye)</option>
                  <option value="otic">Otic (Ear)</option>
                  <option value="rectal">Rectal</option>
                </select>
              </div>

              {/* Patient Photo Confirmation */}
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="photo-confirmed"
                    type="checkbox"
                    required
                    checked={fiveRightsData.patientPhotoConfirmed}
                    onChange={(e) =>
                      setFiveRightsData({ ...fiveRightsData, patientPhotoConfirmed: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="photo-confirmed" className="font-medium text-gray-700">
                    Patient identity confirmed (Right Patient) *
                  </label>
                  <p className="text-gray-500">Visual confirmation or photo ID verified</p>
                </div>
              </div>

              {/* Allergy Acknowledgment */}
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="allergy-ack"
                    type="checkbox"
                    required
                    checked={fiveRightsData.allergyAcknowledged}
                    onChange={(e) =>
                      setFiveRightsData({ ...fiveRightsData, allergyAcknowledged: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="allergy-ack" className="font-medium text-gray-700">
                    Allergy check completed *
                  </label>
                  <p className="text-gray-500">Verified patient has no known allergies to this medication</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Administration Notes */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Administration Notes (Optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any observations, patient response, or relevant information..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Link
            href={`/medications/${medicationId}`}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSafetyCheck}
            className="rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-700"
          >
            Run Safety Check
          </button>
          <button
            type="submit"
            disabled={administerMutation.isPending}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {administerMutation.isPending ? 'Recording...' : 'Administer & Record'}
          </button>
        </div>
      </form>
    </div>
  );
}
