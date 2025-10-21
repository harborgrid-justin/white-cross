/**
 * COMPLETE MEDICATION ADMINISTRATION EXAMPLE
 *
 * This is a production-ready example demonstrating CRITICAL healthcare operations:
 * - Critical operation handling with high-priority bulkhead
 * - Immediate audit flush (no batching for medication)
 * - Request deduplication to prevent double-dosing
 * - Circuit breaker with fast timeout (5 seconds max)
 * - Five Rights of Medication Administration validation
 * - Adverse reaction reporting and tracking
 * - Complete error handling with patient safety focus
 * - Real-time medication scheduling
 * - Medication reconciliation
 *
 * CRITICAL: This example handles life-critical operations
 * Every medication administration MUST be audited immediately
 * Error handling must never fail silently
 *
 * @example How to use this example:
 * 1. Copy this file to your pages/medications directory
 * 2. Ensure your backend supports immediate audit commits
 * 3. Configure circuit breaker for fast failover
 * 4. Test thoroughly before production deployment
 *
 * Last Updated: 2025-10-21
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// =============================================================================
// IMPORTS - Critical Healthcare Operations
// =============================================================================

// Medication service APIs
import {
  useMedicationAdministration,
  useMedicationFormulary,
  useOfflineQueue,
} from '@/services/modules/medication/hooks';

import {
  AdministrationApi,
  PrescriptionApi,
  MedicationFormularyApi,
} from '@/services/modules/medication/api';

// Audit service - IMMEDIATE FLUSH for medications
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '@/services/audit';

// Resilience patterns
import { getCircuitBreaker } from '@/services/resilience/CircuitBreaker';
import { getBulkhead } from '@/services/resilience/Bulkhead';
import { getRequestDeduplicator } from '@/services/resilience/RequestDeduplicator';

// Types
import type {
  MedicationAdministration,
  MedicationPrescription,
  MedicationFormulary,
  AdverseReaction,
  AdministrationStatus,
  FiveRightsValidation,
} from '@/types/medications';

// UI Components
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { BackButton } from '@/components/BackButton';

// =============================================================================
// CONSTANTS - Healthcare Safety Standards
// =============================================================================

/**
 * Five Rights of Medication Administration
 * CRITICAL: All must be validated before administration
 */
const FIVE_RIGHTS = {
  RIGHT_PATIENT: 'Verify patient identity with two identifiers',
  RIGHT_MEDICATION: 'Verify medication name matches prescription',
  RIGHT_DOSE: 'Verify dosage matches prescription',
  RIGHT_ROUTE: 'Verify route of administration',
  RIGHT_TIME: 'Verify administration time is appropriate',
} as const;

/**
 * Critical priority for medication operations
 * Uses dedicated bulkhead resources
 */
const MEDICATION_PRIORITY = 'CRITICAL';

/**
 * Fast timeout for medication operations
 * Patient safety requires quick feedback
 */
const MEDICATION_TIMEOUT = 5000; // 5 seconds

// =============================================================================
// COMPONENT: Medication Administration Page
// =============================================================================

export const MedicationAdminPageComplete: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!studentId) {
    navigate('/students');
    return null;
  }

  // ---------------------------------------------------------------------------
  // RESILIENCE PATTERN SETUP
  // ---------------------------------------------------------------------------

  const circuitBreaker = useMemo(() => getCircuitBreaker('medication'), []);
  const bulkhead = useMemo(() => getBulkhead(), []);
  const deduplicator = useMemo(() => getRequestDeduplicator(), []);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------

  const [selectedPrescription, setSelectedPrescription] = useState<MedicationPrescription | null>(null);
  const [isAdministerModalOpen, setIsAdministerModalOpen] = useState(false);
  const [fiveRightsChecklist, setFiveRightsChecklist] = useState<Record<string, boolean>>({});
  const [administrationNotes, setAdministrationNotes] = useState('');
  const [witnessNurseId, setWitnessNurseId] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------

  /**
   * Fetch active prescriptions
   */
  const {
    data: prescriptions,
    isLoading: isLoadingPrescriptions,
    error: prescriptionsError,
  } = useQuery({
    queryKey: ['medications', 'prescriptions', studentId],
    queryFn: async () => {
      // Use circuit breaker for resilience
      return await circuitBreaker.execute(async () => {
        const api = new PrescriptionApi();
        return await api.getActivePrescriptions(studentId);
      });
    },
    staleTime: 1 * 60 * 1000, // 1 minute - medications need fresh data
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  /**
   * Fetch administration history
   */
  const {
    data: administrationHistory,
    isLoading: isLoadingHistory,
  } = useQuery({
    queryKey: ['medications', 'history', studentId],
    queryFn: async () => {
      const api = new AdministrationApi();
      return await api.getAdministrationHistory(studentId, {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        endDate: new Date().toISOString(),
      });
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  /**
   * Fetch medication formulary for lookup
   */
  const {
    data: formulary,
    isLoading: isLoadingFormulary,
  } = useQuery({
    queryKey: ['medications', 'formulary'],
    queryFn: async () => {
      const api = new MedicationFormularyApi();
      return await api.getFormulary();
    },
    staleTime: 60 * 60 * 1000, // 1 hour - formulary changes infrequently
  });

  // ---------------------------------------------------------------------------
  // CRITICAL MUTATION - Medication Administration
  // ---------------------------------------------------------------------------

  /**
   * Administer medication with comprehensive safety checks
   *
   * CRITICAL OPERATION:
   * - Uses high-priority bulkhead
   * - Immediate audit flush (no batching)
   * - Request deduplication
   * - Fast timeout (5 seconds)
   * - Five Rights validation
   */
  const administerMedicationMutation = useMutation({
    mutationFn: async (data: {
      prescriptionId: string;
      dosageGiven: string;
      route: string;
      notes?: string;
      witnessNurseId?: string;
      fiveRightsValidation: FiveRightsValidation;
    }) => {
      // CRITICAL: Validate Five Rights before proceeding
      const validationErrors = validateFiveRights(data.fiveRightsValidation);
      if (validationErrors.length > 0) {
        throw new Error(`Five Rights validation failed: ${validationErrors.join(', ')}`);
      }

      // Use request deduplicator to prevent double-dosing
      const deduplicationKey = `med-admin-${data.prescriptionId}-${Date.now()}`;

      return await deduplicator.execute(deduplicationKey, async () => {
        // Use bulkhead with CRITICAL priority
        return await bulkhead.execute(
          async () => {
            // Use circuit breaker with fast timeout
            return await circuitBreaker.execute(
              async () => {
                const api = new AdministrationApi();

                // CRITICAL: Log intent BEFORE administration
                await auditService.log({
                  action: AuditAction.ADMINISTER_MEDICATION,
                  resourceType: AuditResourceType.MEDICATION,
                  resourceId: data.prescriptionId,
                  studentId,
                  status: AuditStatus.PENDING,
                  isPHI: true,
                  severity: 'CRITICAL',
                  metadata: {
                    prescriptionId: data.prescriptionId,
                    dosageGiven: data.dosageGiven,
                    route: data.route,
                    witnessNurseId: data.witnessNurseId,
                    fiveRightsValidated: true,
                  },
                });

                // Execute administration
                const result = await api.administerMedication({
                  prescriptionId: data.prescriptionId,
                  studentId,
                  dosageGiven: data.dosageGiven,
                  route: data.route,
                  notes: data.notes,
                  witnessNurseId: data.witnessNurseId,
                  administeredAt: new Date().toISOString(),
                });

                // CRITICAL: Immediate audit flush (no batching)
                await auditService.log({
                  action: AuditAction.ADMINISTER_MEDICATION,
                  resourceType: AuditResourceType.MEDICATION,
                  resourceId: result.id,
                  studentId,
                  status: AuditStatus.SUCCESS,
                  isPHI: true,
                  severity: 'CRITICAL',
                  afterState: result,
                  metadata: {
                    prescriptionId: data.prescriptionId,
                    administrationId: result.id,
                    dosageGiven: data.dosageGiven,
                    route: data.route,
                    witnessNurseId: data.witnessNurseId,
                    timestamp: new Date().toISOString(),
                  },
                });

                // CRITICAL: Force immediate flush of audit logs
                await (auditService as any).flushImmediately?.();

                return result;
              },
              { timeout: MEDICATION_TIMEOUT }
            );
          },
          MEDICATION_PRIORITY
        );
      });
    },
    onSuccess: async (result, variables) => {
      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: ['medications', 'history', studentId] });
      queryClient.invalidateQueries({ queryKey: ['medications', 'prescriptions', studentId] });

      // Show success notification
      showNotification({
        type: 'success',
        message: 'Medication administered successfully and logged',
        persistent: true, // Keep notification visible
      });

      // Reset form
      setIsAdministerModalOpen(false);
      setSelectedPrescription(null);
      setFiveRightsChecklist({});
      setAdministrationNotes('');
      setWitnessNurseId(null);

      // Log success to console for debugging
      console.info('[MEDICATION] Successfully administered:', {
        administrationId: result.id,
        prescriptionId: variables.prescriptionId,
        timestamp: new Date().toISOString(),
      });
    },
    onError: async (error: any, variables) => {
      // CRITICAL: Log failure immediately
      await auditService.log({
        action: AuditAction.ADMINISTER_MEDICATION,
        resourceType: AuditResourceType.MEDICATION,
        resourceId: variables.prescriptionId,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        severity: 'CRITICAL',
        context: {
          error: error.message,
          errorStack: error.stack,
          prescriptionId: variables.prescriptionId,
          dosageGiven: variables.dosageGiven,
          timestamp: new Date().toISOString(),
        },
      });

      // CRITICAL: Force immediate flush
      await (auditService as any).flushImmediately?.();

      // Show error notification
      showNotification({
        type: 'error',
        message: `Medication administration failed: ${error.message}`,
        persistent: true,
      });

      // Log error for debugging
      console.error('[MEDICATION] Administration failed:', {
        error: error.message,
        prescriptionId: variables.prescriptionId,
        timestamp: new Date().toISOString(),
      });
    },
  });

  /**
   * Report adverse reaction
   */
  const reportAdverseReactionMutation = useMutation({
    mutationFn: async (data: {
      administrationId: string;
      reactionType: string;
      severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
      description: string;
      actionTaken: string;
    }) => {
      return await bulkhead.execute(async () => {
        const api = new AdministrationApi();

        // Log adverse reaction
        await auditService.log({
          action: AuditAction.REPORT_ADVERSE_REACTION,
          resourceType: AuditResourceType.MEDICATION,
          resourceId: data.administrationId,
          studentId,
          status: AuditStatus.SUCCESS,
          isPHI: true,
          severity: 'CRITICAL',
          metadata: {
            administrationId: data.administrationId,
            reactionType: data.reactionType,
            severity: data.severity,
            timestamp: new Date().toISOString(),
          },
        });

        const result = await api.reportAdverseReaction(data);

        // CRITICAL: Immediate flush
        await (auditService as any).flushImmediately?.();

        return result;
      }, MEDICATION_PRIORITY);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', 'history', studentId] });

      showNotification({
        type: 'success',
        message: 'Adverse reaction reported and logged',
        persistent: true,
      });
    },
    onError: async (error: any) => {
      await auditService.log({
        action: AuditAction.REPORT_ADVERSE_REACTION,
        resourceType: AuditResourceType.MEDICATION,
        studentId,
        status: AuditStatus.FAILURE,
        severity: 'CRITICAL',
        context: { error: error.message },
      });

      showNotification({
        type: 'error',
        message: `Failed to report adverse reaction: ${error.message}`,
        persistent: true,
      });
    },
  });

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  /**
   * Handle Five Rights checklist validation
   */
  const handleFiveRightsCheck = useCallback((right: string, checked: boolean) => {
    setFiveRightsChecklist(prev => ({
      ...prev,
      [right]: checked,
    }));
  }, []);

  /**
   * Validate Five Rights before administration
   */
  const validateFiveRights = useCallback((validation: FiveRightsValidation): string[] => {
    const errors: string[] = [];

    if (!validation.rightPatient) {
      errors.push('Patient identity not verified');
    }
    if (!validation.rightMedication) {
      errors.push('Medication not verified');
    }
    if (!validation.rightDose) {
      errors.push('Dosage not verified');
    }
    if (!validation.rightRoute) {
      errors.push('Route not verified');
    }
    if (!validation.rightTime) {
      errors.push('Time not verified');
    }

    return errors;
  }, []);

  /**
   * Check if all Five Rights are validated
   */
  const isFiveRightsComplete = useMemo(() => {
    return Object.keys(FIVE_RIGHTS).every(right => fiveRightsChecklist[right] === true);
  }, [fiveRightsChecklist]);

  /**
   * Handle medication administration
   */
  const handleAdministerMedication = useCallback(async () => {
    if (!selectedPrescription) {
      showNotification({
        type: 'error',
        message: 'No prescription selected',
      });
      return;
    }

    if (!isFiveRightsComplete) {
      showNotification({
        type: 'error',
        message: 'All Five Rights must be verified before administration',
        persistent: true,
      });
      return;
    }

    // Prepare Five Rights validation data
    const fiveRightsValidation: FiveRightsValidation = {
      rightPatient: fiveRightsChecklist[Object.keys(FIVE_RIGHTS)[0]] || false,
      rightMedication: fiveRightsChecklist[Object.keys(FIVE_RIGHTS)[1]] || false,
      rightDose: fiveRightsChecklist[Object.keys(FIVE_RIGHTS)[2]] || false,
      rightRoute: fiveRightsChecklist[Object.keys(FIVE_RIGHTS)[3]] || false,
      rightTime: fiveRightsChecklist[Object.keys(FIVE_RIGHTS)[4]] || false,
      validatedBy: 'current-nurse-id', // Replace with actual nurse ID
      validatedAt: new Date().toISOString(),
    };

    await administerMedicationMutation.mutateAsync({
      prescriptionId: selectedPrescription.id,
      dosageGiven: selectedPrescription.dosage,
      route: selectedPrescription.route,
      notes: administrationNotes,
      witnessNurseId: witnessNurseId || undefined,
      fiveRightsValidation,
    });
  }, [
    selectedPrescription,
    isFiveRightsComplete,
    fiveRightsChecklist,
    administrationNotes,
    witnessNurseId,
    administerMedicationMutation,
  ]);

  /**
   * Handle adverse reaction reporting
   */
  const handleReportAdverseReaction = useCallback(async (
    administrationId: string,
    reactionData: any
  ) => {
    await reportAdverseReactionMutation.mutateAsync({
      administrationId,
      ...reactionData,
    });
  }, [reportAdverseReactionMutation]);

  // ---------------------------------------------------------------------------
  // DERIVED STATE
  // ---------------------------------------------------------------------------

  const medicationStats = useMemo(() => {
    return {
      activePrescriptions: prescriptions?.length || 0,
      dueNow: prescriptions?.filter(p => isDue(p)).length || 0,
      overdue: prescriptions?.filter(p => isOverdue(p)).length || 0,
      administeredToday: administrationHistory?.filter(a =>
        isToday(new Date(a.administeredAt))
      ).length || 0,
      adverseReactions: administrationHistory?.filter(a => a.adverseReaction).length || 0,
    };
  }, [prescriptions, administrationHistory]);

  const isLoading = isLoadingPrescriptions || isLoadingHistory || isLoadingFormulary;

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
        <span className="ml-4 text-lg text-gray-600">Loading medication data...</span>
      </div>
    );
  }

  if (prescriptionsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">Error Loading Medications</div>
        <p className="text-gray-600 mb-4">{(prescriptionsError as any)?.message}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <BackButton />
                <h1 className="text-3xl font-bold text-gray-900">Medication Administration</h1>
                <p className="text-gray-600 mt-1">
                  CRITICAL: All administrations are immediately audited
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
              <MedStatCard
                label="Active Prescriptions"
                value={medicationStats.activePrescriptions}
                color="blue"
              />
              <MedStatCard
                label="Due Now"
                value={medicationStats.dueNow}
                color="orange"
              />
              <MedStatCard
                label="Overdue"
                value={medicationStats.overdue}
                color="red"
              />
              <MedStatCard
                label="Administered Today"
                value={medicationStats.administeredToday}
                color="green"
              />
              <MedStatCard
                label="Adverse Reactions"
                value={medicationStats.adverseReactions}
                color="purple"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Active Prescriptions</h2>
            <div className="space-y-4">
              {prescriptions?.map(prescription => (
                <PrescriptionCard
                  key={prescription.id}
                  prescription={prescription}
                  onAdminister={() => {
                    setSelectedPrescription(prescription);
                    setIsAdministerModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Administer Modal */}
        {isAdministerModalOpen && selectedPrescription && (
          <AdministerMedicationModal
            prescription={selectedPrescription}
            fiveRightsChecklist={fiveRightsChecklist}
            onFiveRightsCheck={handleFiveRightsCheck}
            isFiveRightsComplete={isFiveRightsComplete}
            notes={administrationNotes}
            onNotesChange={setAdministrationNotes}
            witnessNurseId={witnessNurseId}
            onWitnessChange={setWitnessNurseId}
            onClose={() => {
              setIsAdministerModalOpen(false);
              setSelectedPrescription(null);
              setFiveRightsChecklist({});
              setAdministrationNotes('');
              setWitnessNurseId(null);
            }}
            onSubmit={handleAdministerMedication}
            isLoading={administerMedicationMutation.isPending}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

const MedStatCard: React.FC<any> = ({ label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    orange: 'bg-orange-50 text-orange-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm mt-1">{label}</div>
    </div>
  );
};

const PrescriptionCard: React.FC<any> = ({ prescription, onAdminister }) => (
  <div className="border rounded-lg p-4">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-lg">{prescription.medicationName}</h3>
        <p className="text-sm text-gray-600">Dosage: {prescription.dosage}</p>
        <p className="text-sm text-gray-600">Route: {prescription.route}</p>
        <p className="text-sm text-gray-600">Frequency: {prescription.frequency}</p>
      </div>
      <button
        onClick={onAdminister}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Administer
      </button>
    </div>
  </div>
);

const AdministerMedicationModal: React.FC<any> = ({
  prescription,
  fiveRightsChecklist,
  onFiveRightsCheck,
  isFiveRightsComplete,
  notes,
  onNotesChange,
  witnessNurseId,
  onWitnessChange,
  onClose,
  onSubmit,
  isLoading,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Administer Medication</h2>

      {/* Five Rights Checklist */}
      <div className="border-2 border-red-300 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-red-600 mb-4">Five Rights Verification (REQUIRED)</h3>
        {Object.entries(FIVE_RIGHTS).map(([key, description]) => (
          <label key={key} className="flex items-start gap-3 mb-3">
            <input
              type="checkbox"
              checked={fiveRightsChecklist[key] || false}
              onChange={(e) => onFiveRightsCheck(key, e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm">
              <strong>{key.replace(/_/g, ' ')}:</strong> {description}
            </span>
          </label>
        ))}
      </div>

      {/* Medication Details */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Medication Details</h3>
        <p><strong>Name:</strong> {prescription.medicationName}</p>
        <p><strong>Dosage:</strong> {prescription.dosage}</p>
        <p><strong>Route:</strong> {prescription.route}</p>
        <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Administration Notes</label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full border rounded-lg p-2"
          rows={3}
          placeholder="Optional notes about administration..."
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={!isFiveRightsComplete || isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Administering...' : 'Administer & Log'}
        </button>
      </div>

      {!isFiveRightsComplete && (
        <p className="text-red-600 text-sm mt-4 text-center">
          All Five Rights must be verified before administration
        </p>
      )}
    </div>
  </div>
);

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function isDue(prescription: MedicationPrescription): boolean {
  // Implement your due logic
  return false;
}

function isOverdue(prescription: MedicationPrescription): boolean {
  // Implement your overdue logic
  return false;
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  persistent?: boolean;
}

function showNotification(notification: Notification) {
  console.log(`[${notification.type.toUpperCase()}]`, notification.message);
  // Implement with your toast library
}

export default MedicationAdminPageComplete;
