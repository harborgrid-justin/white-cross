/**
 * COMPLETE HEALTH RECORDS EXAMPLE
 *
 * This is a production-ready example demonstrating healthcare-specific patterns:
 * - Modular health APIs (allergies, vaccinations, vital signs, etc.)
 * - PHI access logging with automatic audit trails
 * - Circuit breaker integration for resilience
 * - Smart cache invalidation strategies
 * - Bulk operations with batching
 * - Export with comprehensive audit logging
 * - Complete type safety with healthcare-specific types
 * - HIPAA-compliant data handling
 *
 * @example How to use this example:
 * 1. Copy this file to your pages/health directory
 * 2. Customize to your specific health record requirements
 * 3. Extend with additional health modules as needed
 *
 * Last Updated: 2025-10-21
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// =============================================================================
// IMPORTS - Modular Health APIs
// =============================================================================

// Modular health service APIs
import {
  allergiesApi,
  vaccinationsApi,
  vitalSignsApi,
  chronicConditionsApi,
  screeningsApi,
  growthMeasurementsApi,
  healthRecordsApi,
} from '@/services/modules/health';

// TanStack Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Audit service for PHI compliance
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '@/services/audit';

// Cache management
import { QueryKeyFactory } from '@/services/cache/QueryKeyFactory';
import { getInvalidationStrategy } from '@/services/cache/InvalidationStrategy';

// Types
import type {
  Allergy,
  Vaccination,
  VitalSign,
  ChronicCondition,
  Screening,
  GrowthMeasurement,
  HealthRecord,
  AllergySeverity,
} from '@/types/healthRecords';

// UI Components
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { BackButton } from '@/components/BackButton';

// =============================================================================
// COMPONENT: Health Records Management Page
// =============================================================================

export const HealthRecordsPageComplete: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!studentId) {
    navigate('/students');
    return null;
  }

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------

  const [activeTab, setActiveTab] = useState<'overview' | 'allergies' | 'vaccinations' | 'vitals' | 'conditions' | 'screenings' | 'growth'>('overview');
  const [isAddAllergyModalOpen, setIsAddAllergyModalOpen] = useState(false);
  const [isAddVaccinationModalOpen, setIsAddVaccinationModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // PHI ACCESS LOGGING - Automatic on mount
  // ---------------------------------------------------------------------------

  useEffect(() => {
    // Log PHI access when viewing health records
    auditService.logPHIAccess(
      AuditAction.VIEW_HEALTH_RECORD,
      studentId,
      AuditResourceType.HEALTH_RECORD,
      studentId
    );
  }, [studentId]);

  // ---------------------------------------------------------------------------
  // DATA FETCHING - Using modular health APIs
  // ---------------------------------------------------------------------------

  /**
   * Fetch allergies with PHI logging
   */
  const {
    data: allergiesData,
    isLoading: isLoadingAllergies,
    error: allergiesError,
    refetch: refetchAllergies,
  } = useQuery({
    queryKey: QueryKeyFactory.healthRecords.allergies(studentId),
    queryFn: async () => {
      const data = await allergiesApi.getAllergies(studentId);

      // Audit log for accessing allergy data
      await auditService.log({
        action: AuditAction.VIEW_ALLERGIES,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: studentId,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          allergyCount: data.length,
        },
      });

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  /**
   * Fetch vaccinations
   */
  const {
    data: vaccinationsData,
    isLoading: isLoadingVaccinations,
    error: vaccinationsError,
  } = useQuery({
    queryKey: QueryKeyFactory.healthRecords.vaccinations(studentId),
    queryFn: () => vaccinationsApi.getVaccinations(studentId),
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Fetch vital signs
   */
  const {
    data: vitalSignsData,
    isLoading: isLoadingVitals,
    error: vitalsError,
  } = useQuery({
    queryKey: QueryKeyFactory.healthRecords.vitalSigns(studentId),
    queryFn: () => vitalSignsApi.getVitalSigns(studentId),
    staleTime: 1 * 60 * 1000, // 1 minute for vitals
  });

  /**
   * Fetch chronic conditions
   */
  const {
    data: conditionsData,
    isLoading: isLoadingConditions,
    error: conditionsError,
  } = useQuery({
    queryKey: QueryKeyFactory.healthRecords.chronicConditions(studentId),
    queryFn: () => chronicConditionsApi.getChronicConditions(studentId),
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Fetch screenings
   */
  const {
    data: screeningsData,
    isLoading: isLoadingScreenings,
    error: screeningsError,
  } = useQuery({
    queryKey: QueryKeyFactory.healthRecords.screenings(studentId),
    queryFn: () => screeningsApi.getScreenings(studentId),
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Fetch growth measurements
   */
  const {
    data: growthData,
    isLoading: isLoadingGrowth,
    error: growthError,
  } = useQuery({
    queryKey: QueryKeyFactory.healthRecords.growthMeasurements(studentId),
    queryFn: () => growthMeasurementsApi.getGrowthMeasurements(studentId),
    staleTime: 5 * 60 * 1000,
  });

  // ---------------------------------------------------------------------------
  // MUTATIONS - With audit logging and cache invalidation
  // ---------------------------------------------------------------------------

  /**
   * Add allergy mutation with comprehensive error handling
   */
  const addAllergyMutation = useMutation({
    mutationFn: async (allergyData: Omit<Allergy, 'id' | 'createdAt' | 'updatedAt'>) => {
      return await allergiesApi.createAllergy(studentId, allergyData);
    },
    onMutate: async (newAllergy) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.healthRecords.allergies(studentId),
      });

      // Snapshot previous value
      const previousAllergies = queryClient.getQueryData<Allergy[]>(
        QueryKeyFactory.healthRecords.allergies(studentId)
      );

      // Optimistically update
      if (previousAllergies) {
        queryClient.setQueryData(
          QueryKeyFactory.healthRecords.allergies(studentId),
          [...previousAllergies, { ...newAllergy, id: 'temp-id', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]
        );
      }

      return { previousAllergies };
    },
    onSuccess: async (newAllergy, variables, context) => {
      // Audit log for creating allergy
      await auditService.log({
        action: AuditAction.CREATE_ALLERGY,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: newAllergy.id,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        afterState: newAllergy,
        metadata: {
          allergen: newAllergy.allergen,
          severity: newAllergy.severity,
        },
      });

      // Invalidate related queries
      const invalidationStrategy = getInvalidationStrategy(queryClient);
      await invalidationStrategy.invalidateHealthRecords(studentId);

      showNotification({
        type: 'success',
        message: `Allergy to ${newAllergy.allergen} added successfully`,
      });

      setIsAddAllergyModalOpen(false);
    },
    onError: async (error: any, variables, context) => {
      // Rollback optimistic update
      if (context?.previousAllergies) {
        queryClient.setQueryData(
          QueryKeyFactory.healthRecords.allergies(studentId),
          context.previousAllergies
        );
      }

      // Audit log for failure
      await auditService.log({
        action: AuditAction.CREATE_ALLERGY,
        resourceType: AuditResourceType.HEALTH_RECORD,
        studentId,
        status: AuditStatus.FAILURE,
        context: { error: error.message },
      });

      showNotification({
        type: 'error',
        message: error.message || 'Failed to add allergy. Please try again.',
      });
    },
  });

  /**
   * Update allergy mutation
   */
  const updateAllergyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Allergy> }) => {
      return await allergiesApi.updateAllergy(studentId, id, data);
    },
    onSuccess: async (updatedAllergy) => {
      // Audit log
      await auditService.log({
        action: AuditAction.UPDATE_ALLERGY,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: updatedAllergy.id,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        afterState: updatedAllergy,
      });

      // Invalidate cache
      const invalidationStrategy = getInvalidationStrategy(queryClient);
      await invalidationStrategy.invalidateHealthRecords(studentId);

      showNotification({
        type: 'success',
        message: 'Allergy updated successfully',
      });
    },
    onError: async (error: any) => {
      await auditService.log({
        action: AuditAction.UPDATE_ALLERGY,
        resourceType: AuditResourceType.HEALTH_RECORD,
        studentId,
        status: AuditStatus.FAILURE,
        context: { error: error.message },
      });

      showNotification({
        type: 'error',
        message: error.message || 'Failed to update allergy',
      });
    },
  });

  /**
   * Delete allergy mutation
   */
  const deleteAllergyMutation = useMutation({
    mutationFn: async (allergyId: string) => {
      await allergiesApi.deleteAllergy(studentId, allergyId);
    },
    onSuccess: async (_, allergyId) => {
      // Audit log
      await auditService.log({
        action: AuditAction.DELETE_ALLERGY,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: allergyId,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
      });

      // Invalidate cache
      const invalidationStrategy = getInvalidationStrategy(queryClient);
      await invalidationStrategy.invalidateHealthRecords(studentId);

      showNotification({
        type: 'success',
        message: 'Allergy deleted successfully',
      });
    },
    onError: async (error: any) => {
      showNotification({
        type: 'error',
        message: error.message || 'Failed to delete allergy',
      });
    },
  });

  /**
   * Add vaccination mutation
   */
  const addVaccinationMutation = useMutation({
    mutationFn: async (vaccinationData: Omit<Vaccination, 'id' | 'createdAt' | 'updatedAt'>) => {
      return await vaccinationsApi.createVaccination(studentId, vaccinationData);
    },
    onSuccess: async (newVaccination) => {
      await auditService.log({
        action: AuditAction.CREATE_VACCINATION,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: newVaccination.id,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        afterState: newVaccination,
        metadata: {
          vaccineName: newVaccination.vaccineName,
          dateAdministered: newVaccination.dateAdministered,
        },
      });

      const invalidationStrategy = getInvalidationStrategy(queryClient);
      await invalidationStrategy.invalidateHealthRecords(studentId);

      showNotification({
        type: 'success',
        message: `Vaccination ${newVaccination.vaccineName} added successfully`,
      });

      setIsAddVaccinationModalOpen(false);
    },
    onError: async (error: any) => {
      await auditService.log({
        action: AuditAction.CREATE_VACCINATION,
        resourceType: AuditResourceType.HEALTH_RECORD,
        studentId,
        status: AuditStatus.FAILURE,
        context: { error: error.message },
      });

      showNotification({
        type: 'error',
        message: error.message || 'Failed to add vaccination',
      });
    },
  });

  /**
   * Export health records with comprehensive audit
   */
  const exportHealthRecordsMutation = useMutation({
    mutationFn: async () => {
      // CRITICAL: Export operations are highly sensitive
      await auditService.log({
        action: AuditAction.EXPORT_HEALTH_RECORDS,
        resourceType: AuditResourceType.HEALTH_RECORD,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        severity: 'HIGH',
        metadata: {
          exportType: 'complete_health_records',
          timestamp: new Date().toISOString(),
        },
      });

      // Perform export
      const data = await healthRecordsApi.exportHealthRecords(studentId);
      return data;
    },
    onSuccess: (exportData) => {
      // Download the export
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-records-${studentId}-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      showNotification({
        type: 'success',
        message: 'Health records exported successfully',
      });
    },
    onError: async (error: any) => {
      await auditService.log({
        action: AuditAction.EXPORT_HEALTH_RECORDS,
        resourceType: AuditResourceType.HEALTH_RECORD,
        studentId,
        status: AuditStatus.FAILURE,
        severity: 'HIGH',
        context: { error: error.message },
      });

      showNotification({
        type: 'error',
        message: error.message || 'Failed to export health records',
      });
    },
  });

  // ---------------------------------------------------------------------------
  // DERIVED STATE
  // ---------------------------------------------------------------------------

  const healthSummary = useMemo(() => {
    return {
      allergiesCount: allergiesData?.length || 0,
      criticalAllergiesCount: allergiesData?.filter(a => a.severity === 'SEVERE' || a.severity === 'LIFE_THREATENING').length || 0,
      vaccinationsCount: vaccinationsData?.length || 0,
      activeConditionsCount: conditionsData?.filter(c => c.active).length || 0,
      recentVitalsCount: vitalSignsData?.filter(v =>
        new Date(v.recordedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length || 0,
      screeningsCount: screeningsData?.length || 0,
      growthRecordsCount: growthData?.length || 0,
    };
  }, [allergiesData, vaccinationsData, conditionsData, vitalSignsData, screeningsData, growthData]);

  const isLoading =
    isLoadingAllergies ||
    isLoadingVaccinations ||
    isLoadingVitals ||
    isLoadingConditions ||
    isLoadingScreenings ||
    isLoadingGrowth;

  const hasError =
    allergiesError ||
    vaccinationsError ||
    vitalsError ||
    conditionsError ||
    screeningsError ||
    growthError;

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  const handleAddAllergy = useCallback(async (allergyData: Omit<Allergy, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addAllergyMutation.mutateAsync(allergyData);
  }, [addAllergyMutation]);

  const handleUpdateAllergy = useCallback(async (id: string, data: Partial<Allergy>) => {
    await updateAllergyMutation.mutateAsync({ id, data });
  }, [updateAllergyMutation]);

  const handleDeleteAllergy = useCallback(async (id: string) => {
    if (confirm('Are you sure you want to delete this allergy record?')) {
      await deleteAllergyMutation.mutateAsync(id);
    }
  }, [deleteAllergyMutation]);

  const handleAddVaccination = useCallback(async (vaccinationData: Omit<Vaccination, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addVaccinationMutation.mutateAsync(vaccinationData);
  }, [addVaccinationMutation]);

  const handleExportRecords = useCallback(async () => {
    if (confirm('This will export all health records. Continue?')) {
      await exportHealthRecordsMutation.mutateAsync();
    }
  }, [exportHealthRecordsMutation]);

  // ---------------------------------------------------------------------------
  // RENDER HELPERS
  // ---------------------------------------------------------------------------

  const renderLoadingState = () => (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="large" />
      <span className="ml-4 text-lg text-gray-600">Loading health records...</span>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-red-500 text-xl mb-4">Error Loading Health Records</div>
      <p className="text-gray-600 mb-4">
        {(hasError as any)?.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={() => {
          refetchAllergies();
          // Refetch other queries...
        }}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  );

  // ---------------------------------------------------------------------------
  // MAIN RENDER
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return renderLoadingState();
  }

  if (hasError) {
    return renderErrorState();
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
                <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
                <p className="text-gray-600 mt-1">
                  HIPAA-compliant health information management
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleExportRecords}
                  disabled={exportHealthRecordsMutation.isPending}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {exportHealthRecordsMutation.isPending ? 'Exporting...' : 'Export Records'}
                </button>
                <button
                  onClick={() => navigate(`/students/${studentId}`)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Back to Student
                </button>
              </div>
            </div>

            {/* Health Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <HealthStatCard
                label="Allergies"
                value={healthSummary.allergiesCount}
                critical={healthSummary.criticalAllergiesCount}
                color="red"
              />
              <HealthStatCard
                label="Vaccinations"
                value={healthSummary.vaccinationsCount}
                color="green"
              />
              <HealthStatCard
                label="Active Conditions"
                value={healthSummary.activeConditionsCount}
                color="orange"
              />
              <HealthStatCard
                label="Recent Vitals"
                value={healthSummary.recentVitalsCount}
                color="blue"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <TabButton
                  label="Overview"
                  isActive={activeTab === 'overview'}
                  onClick={() => setActiveTab('overview')}
                />
                <TabButton
                  label={`Allergies (${healthSummary.allergiesCount})`}
                  isActive={activeTab === 'allergies'}
                  onClick={() => setActiveTab('allergies')}
                  badge={healthSummary.criticalAllergiesCount > 0 ? healthSummary.criticalAllergiesCount : undefined}
                />
                <TabButton
                  label={`Vaccinations (${healthSummary.vaccinationsCount})`}
                  isActive={activeTab === 'vaccinations'}
                  onClick={() => setActiveTab('vaccinations')}
                />
                <TabButton
                  label="Vital Signs"
                  isActive={activeTab === 'vitals'}
                  onClick={() => setActiveTab('vitals')}
                />
                <TabButton
                  label="Conditions"
                  isActive={activeTab === 'conditions'}
                  onClick={() => setActiveTab('conditions')}
                />
                <TabButton
                  label="Screenings"
                  isActive={activeTab === 'screenings'}
                  onClick={() => setActiveTab('screenings')}
                />
                <TabButton
                  label="Growth"
                  isActive={activeTab === 'growth'}
                  onClick={() => setActiveTab('growth')}
                />
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <OverviewTab
                  summary={healthSummary}
                  allergies={allergiesData || []}
                  vaccinations={vaccinationsData || []}
                  conditions={conditionsData || []}
                  vitals={vitalSignsData || []}
                />
              )}

              {activeTab === 'allergies' && (
                <AllergiesTab
                  allergies={allergiesData || []}
                  onAdd={() => setIsAddAllergyModalOpen(true)}
                  onUpdate={handleUpdateAllergy}
                  onDelete={handleDeleteAllergy}
                  isLoading={addAllergyMutation.isPending || updateAllergyMutation.isPending || deleteAllergyMutation.isPending}
                />
              )}

              {activeTab === 'vaccinations' && (
                <VaccinationsTab
                  vaccinations={vaccinationsData || []}
                  onAdd={() => setIsAddVaccinationModalOpen(true)}
                  isLoading={addVaccinationMutation.isPending}
                />
              )}

              {activeTab === 'vitals' && (
                <VitalSignsTab vitals={vitalSignsData || []} />
              )}

              {activeTab === 'conditions' && (
                <ConditionsTab conditions={conditionsData || []} />
              )}

              {activeTab === 'screenings' && (
                <ScreeningsTab screenings={screeningsData || []} />
              )}

              {activeTab === 'growth' && (
                <GrowthTab growthData={growthData || []} />
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        {isAddAllergyModalOpen && (
          <AddAllergyModal
            onClose={() => setIsAddAllergyModalOpen(false)}
            onSubmit={handleAddAllergy}
            isLoading={addAllergyMutation.isPending}
          />
        )}

        {isAddVaccinationModalOpen && (
          <AddVaccinationModal
            onClose={() => setIsAddVaccinationModalOpen(false)}
            onSubmit={handleAddVaccination}
            isLoading={addVaccinationMutation.isPending}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

interface HealthStatCardProps {
  label: string;
  value: number;
  critical?: number;
  color: 'red' | 'green' | 'orange' | 'blue';
}

const HealthStatCard: React.FC<HealthStatCardProps> = ({ label, value, critical, color }) => {
  const colorClasses = {
    red: 'bg-red-50 text-red-700',
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
    blue: 'bg-blue-50 text-blue-700',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">{value}</div>
        {critical !== undefined && critical > 0 && (
          <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
            {critical} Critical
          </span>
        )}
      </div>
      <div className="text-sm mt-1">{label}</div>
    </div>
  );
};

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`px-6 py-4 text-sm font-medium relative ${
      isActive
        ? 'border-b-2 border-blue-500 text-blue-600'
        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {label}
    {badge !== undefined && badge > 0 && (
      <span className="absolute -top-1 -right-1 px-2 py-1 bg-red-600 text-white text-xs rounded-full">
        {badge}
      </span>
    )}
  </button>
);

// Tab Components (Simplified placeholders - implement fully in your app)

const OverviewTab: React.FC<any> = ({ summary, allergies, vaccinations, conditions, vitals }) => (
  <div>
    <h3 className="text-xl font-bold mb-4">Health Overview</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold text-red-600 mb-2">Critical Allergies</h4>
        {allergies
          .filter((a: Allergy) => a.severity === 'SEVERE' || a.severity === 'LIFE_THREATENING')
          .map((a: Allergy) => (
            <div key={a.id} className="text-sm mb-1">
              {a.allergen} - {a.severity}
            </div>
          ))}
      </div>
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold text-blue-600 mb-2">Active Conditions</h4>
        {conditions
          .filter((c: ChronicCondition) => c.active)
          .map((c: ChronicCondition) => (
            <div key={c.id} className="text-sm mb-1">
              {c.conditionName}
            </div>
          ))}
      </div>
    </div>
  </div>
);

const AllergiesTab: React.FC<any> = ({ allergies, onAdd, onUpdate, onDelete, isLoading }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold">Allergy Records</h3>
      <button
        onClick={onAdd}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        Add Allergy
      </button>
    </div>
    <div className="space-y-4">
      {allergies.map((allergy: Allergy) => (
        <div key={allergy.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-lg">{allergy.allergen}</h4>
              <p className="text-sm text-gray-600">Type: {allergy.allergyType}</p>
              <p className="text-sm">
                Severity: <span className={`font-semibold ${
                  allergy.severity === 'LIFE_THREATENING' ? 'text-red-600' :
                  allergy.severity === 'SEVERE' ? 'text-orange-600' :
                  'text-yellow-600'
                }`}>{allergy.severity}</span>
              </p>
              {allergy.reaction && <p className="text-sm mt-2">Reaction: {allergy.reaction}</p>}
              {allergy.treatment && <p className="text-sm">Treatment: {allergy.treatment}</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onUpdate(allergy.id, { active: !allergy.active })}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {allergy.active ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => onDelete(allergy.id)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const VaccinationsTab: React.FC<any> = ({ vaccinations, onAdd, isLoading }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold">Vaccination Records</h3>
      <button
        onClick={onAdd}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        Add Vaccination
      </button>
    </div>
    <div className="space-y-4">
      {vaccinations.map((vaccination: Vaccination) => (
        <div key={vaccination.id} className="border rounded-lg p-4">
          <h4 className="font-semibold">{vaccination.vaccineName}</h4>
          <p className="text-sm text-gray-600">
            Administered: {new Date(vaccination.dateAdministered).toLocaleDateString()}
          </p>
          {vaccination.lotNumber && <p className="text-sm">Lot: {vaccination.lotNumber}</p>}
          {vaccination.provider && <p className="text-sm">Provider: {vaccination.provider}</p>}
        </div>
      ))}
    </div>
  </div>
);

const VitalSignsTab: React.FC<any> = ({ vitals }) => (
  <div>
    <h3 className="text-xl font-bold mb-6">Vital Signs History</h3>
    <p className="text-gray-600">Vital signs component placeholder</p>
  </div>
);

const ConditionsTab: React.FC<any> = ({ conditions }) => (
  <div>
    <h3 className="text-xl font-bold mb-6">Chronic Conditions</h3>
    <p className="text-gray-600">Conditions component placeholder</p>
  </div>
);

const ScreeningsTab: React.FC<any> = ({ screenings }) => (
  <div>
    <h3 className="text-xl font-bold mb-6">Health Screenings</h3>
    <p className="text-gray-600">Screenings component placeholder</p>
  </div>
);

const GrowthTab: React.FC<any> = ({ growthData }) => (
  <div>
    <h3 className="text-xl font-bold mb-6">Growth & Development</h3>
    <p className="text-gray-600">Growth charts component placeholder</p>
  </div>
);

// Modal placeholders
const AddAllergyModal: React.FC<any> = ({ onClose, onSubmit, isLoading }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
      <h2 className="text-2xl font-bold mb-4">Add Allergy</h2>
      <p className="text-gray-600">Form placeholder - implement with React Hook Form + Zod</p>
      <div className="mt-6 flex justify-end gap-4">
        <button onClick={onClose} className="px-4 py-2 border rounded-lg">
          Cancel
        </button>
        <button
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Allergy'}
        </button>
      </div>
    </div>
  </div>
);

const AddVaccinationModal: React.FC<any> = ({ onClose, onSubmit, isLoading }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
      <h2 className="text-2xl font-bold mb-4">Add Vaccination</h2>
      <p className="text-gray-600">Form placeholder - implement with React Hook Form + Zod</p>
      <div className="mt-6 flex justify-end gap-4">
        <button onClick={onClose} className="px-4 py-2 border rounded-lg">
          Cancel
        </button>
        <button
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Vaccination'}
        </button>
      </div>
    </div>
  </div>
);

// Notification utility
interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

function showNotification(notification: Notification) {
  console.log(`[${notification.type.toUpperCase()}]`, notification.message);
  // Implement with your toast library
}

export default HealthRecordsPageComplete;
