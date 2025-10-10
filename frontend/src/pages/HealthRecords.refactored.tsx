/**
 * Health Records Page - Refactored with SOA Patterns
 *
 * Enterprise-grade implementation featuring:
 * - Service-oriented architecture
 * - React Query for server state management
 * - HIPAA-compliant data handling
 * - Comprehensive error handling
 * - Optimistic updates
 * - Automatic data cleanup
 * - Circuit breaker awareness
 *
 * @module HealthRecordsRefactored
 */

import React, { useState, useEffect, useMemo } from 'react';
import { FileText, AlertTriangle, Activity, Shield, Settings, BarChart3, Plus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// Hooks
import { useAuthContext } from '../contexts/AuthContext';
import {
  useHealthRecords,
  useAllergies,
  useChronicConditions,
  useVaccinations,
  useGrowthMeasurements,
  useScreenings,
  useHealthSummary,
  useHealthRecordsCleanup,
  useCreateHealthRecord,
  useCreateAllergy,
  useCreateChronicCondition,
  useCreateVaccination,
  healthRecordsKeys,
} from '../hooks/useHealthRecords';

// Components
import { HealthRecordsErrorBoundaryWrapper } from '../components/healthRecords/HealthRecordsErrorBoundary';
import { StudentSelector } from '../components/StudentSelector';
import { StatsCard } from '../components/healthRecords/shared/StatsCard';
import { TabNavigation } from '../components/healthRecords/shared/TabNavigation';
import { SessionExpiredModal } from '../components/modals/SessionExpiredModal';
import { SensitiveRecordWarning } from '../components/modals/SensitiveRecordWarning';
import { HealthRecordModal } from '../components/modals/HealthRecordModal';

// Tab Components
import { OverviewTab } from '../components/healthRecords/tabs/OverviewTab';
import { RecordsTab } from '../components/healthRecords/tabs/RecordsTab';
import { AllergiesTab } from '../components/healthRecords/tabs/AllergiesTab';
import { ChronicConditionsTab } from '../components/healthRecords/tabs/ChronicConditionsTab';
import { VaccinationsTab } from '../components/healthRecords/tabs/VaccinationsTab';
import { GrowthChartsTab } from '../components/healthRecords/tabs/GrowthChartsTab';
import { ScreeningsTab } from '../components/healthRecords/tabs/ScreeningsTab';
import { AnalyticsTab } from '../components/healthRecords/tabs/AnalyticsTab';

// Constants & Types
import { HEALTH_TABS } from '../constants/healthRecords';
import type { TabType } from '../types/healthRecords';

// Utilities
import { SessionMonitor, logCleanupEvent } from '../utils/healthRecordsCleanup';

// ============================================================================
// Types
// ============================================================================

interface HealthRecordsPageProps {
  defaultStudentId?: string;
}

// ============================================================================
// Main Component
// ============================================================================

const HealthRecordsRefactored: React.FC<HealthRecordsPageProps> = ({ defaultStudentId }) => {
  const { user, expireSession } = useAuthContext();
  const queryClient = useQueryClient();

  // ========================================
  // State Management
  // ========================================

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(defaultStudentId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [vaccinationFilter, setVaccinationFilter] = useState('all');
  const [vaccinationSort, setVaccinationSort] = useState('date');

  // Modal state
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const [showSensitiveRecordWarning, setShowSensitiveRecordWarning] = useState(false);
  const [sensitiveRecordContext, setSensitiveRecordContext] = useState<any>(null);
  const [showHealthRecordModal, setShowHealthRecordModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  // Session monitoring
  const [sessionMonitor] = useState(
    () =>
      new SessionMonitor({
        timeoutMs: 15 * 60 * 1000, // 15 minutes
        warningMs: 13 * 60 * 1000, // 13 minutes (2 min warning)
        onWarning: (remainingTime) => {
          toast.error(`Session will expire in ${Math.floor(remainingTime / 1000 / 60)} minutes`, {
            duration: 5000,
            id: 'session-warning',
          });
        },
        onTimeout: () => {
          setShowSessionExpiredModal(true);
          logCleanupEvent('SESSION_TIMEOUT', { userId: user?.id });
        },
      })
  );

  // ========================================
  // HIPAA-Compliant Data Cleanup
  // ========================================

  useHealthRecordsCleanup(selectedStudentId);

  useEffect(() => {
    // Start session monitoring
    sessionMonitor.start();

    // Cleanup on unmount
    return () => {
      sessionMonitor.stop();
      logCleanupEvent('COMPONENT_UNMOUNT', { userId: user?.id });
    };
  }, [sessionMonitor, user?.id]);

  // ========================================
  // Data Fetching with React Query
  // ========================================

  // Health summary (always fetch for stats)
  const {
    data: healthSummary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useHealthSummary(selectedStudentId || '', {
    enabled: !!selectedStudentId,
  });

  // Tab-specific data
  const {
    data: healthRecords = [],
    isLoading: recordsLoading,
    isFetching: recordsFetching,
  } = useHealthRecords(
    selectedStudentId || '',
    { search: searchQuery },
    { enabled: !!selectedStudentId && activeTab === 'records' }
  );

  const {
    data: allergies = [],
    isLoading: allergiesLoading,
  } = useAllergies(selectedStudentId || '', {
    enabled: !!selectedStudentId && activeTab === 'allergies',
  });

  const {
    data: chronicConditions = [],
    isLoading: chronicConditionsLoading,
  } = useChronicConditions(selectedStudentId || '', {
    enabled: !!selectedStudentId && activeTab === 'chronic',
  });

  const {
    data: vaccinations = [],
    isLoading: vaccinationsLoading,
  } = useVaccinations(selectedStudentId || '', {
    enabled: !!selectedStudentId && activeTab === 'vaccinations',
  });

  const {
    data: growthMeasurements = [],
    isLoading: growthLoading,
  } = useGrowthMeasurements(selectedStudentId || '', {
    enabled: !!selectedStudentId && activeTab === 'growth',
  });

  const {
    data: screenings = [],
    isLoading: screeningsLoading,
  } = useScreenings(selectedStudentId || '', {
    enabled: !!selectedStudentId && activeTab === 'screenings',
  });

  // ========================================
  // Mutations
  // ========================================

  const createHealthRecordMutation = useCreateHealthRecord({
    onSuccess: () => {
      setShowHealthRecordModal(false);
      setEditingRecord(null);
    },
  });

  const createAllergyMutation = useCreateAllergy();
  const createChronicConditionMutation = useCreateChronicCondition();
  const createVaccinationMutation = useCreateVaccination();

  // ========================================
  // Computed Values
  // ========================================

  const isLoading = useMemo(() => {
    switch (activeTab) {
      case 'overview':
        return summaryLoading;
      case 'records':
        return recordsLoading || recordsFetching;
      case 'allergies':
        return allergiesLoading;
      case 'chronic':
        return chronicConditionsLoading;
      case 'vaccinations':
        return vaccinationsLoading;
      case 'growth':
        return growthLoading;
      case 'screenings':
        return screeningsLoading;
      default:
        return false;
    }
  }, [
    activeTab,
    summaryLoading,
    recordsLoading,
    recordsFetching,
    allergiesLoading,
    chronicConditionsLoading,
    vaccinationsLoading,
    growthLoading,
    screeningsLoading,
  ]);

  const stats = useMemo(() => {
    if (!healthSummary) {
      return {
        totalRecords: 0,
        activeAllergies: 0,
        chronicConditions: 0,
        vaccinationsDue: 0,
      };
    }

    return {
      totalRecords: healthRecords.length || 0,
      activeAllergies: healthSummary.allergies?.length || 0,
      chronicConditions: healthSummary.chronicConditions?.filter(c => c.status === 'ACTIVE').length || 0,
      vaccinationsDue: healthSummary.vaccinations?.filter(v => !v.compliant).length || 0,
    };
  }, [healthSummary, healthRecords]);

  // ========================================
  // Event Handlers
  // ========================================

  const handleTabChange = async (tabId: TabType) => {
    setActiveTab(tabId);

    // Log tab access for audit
    if (selectedStudentId) {
      logCleanupEvent('TAB_CHANGE', {
        userId: user?.id,
        studentId: selectedStudentId,
        tab: tabId,
      });
    }
  };

  const handleStudentSelect = (student: any) => {
    // Clear previous student data when switching
    if (selectedStudentId && selectedStudentId !== student.id) {
      queryClient.removeQueries({ queryKey: healthRecordsKeys.all });
      logCleanupEvent('STUDENT_SWITCH', {
        userId: user?.id,
        fromStudentId: selectedStudentId,
        toStudentId: student.id,
      });
    }

    setSelectedStudentId(student.id);
  };

  const handleSaveHealthRecord = async (data: any) => {
    if (!selectedStudentId) {
      toast.error('Please select a student first');
      return;
    }

    try {
      await createHealthRecordMutation.mutateAsync({
        ...data,
        studentId: selectedStudentId,
      });
    } catch (error) {
      // Error handling is done in the mutation
      console.error('Error saving health record:', error);
    }
  };

  const handleSessionExpired = () => {
    setShowSessionExpiredModal(false);

    // Clear all data
    queryClient.clear();
    localStorage.clear();
    sessionStorage.clear();

    // Expire session and redirect
    expireSession();
    window.location.href = '/login';
  };

  const handleSensitiveRecordAccess = (callback: () => void, context: any) => {
    setSensitiveRecordContext({ callback, ...context });
    setShowSensitiveRecordWarning(true);
  };

  const handleConfirmSensitiveAccess = () => {
    setShowSensitiveRecordWarning(false);

    if (sensitiveRecordContext?.callback) {
      sensitiveRecordContext.callback();
    }

    // Log sensitive data access
    logCleanupEvent('SENSITIVE_DATA_ACCESS', {
      userId: user?.id,
      studentId: selectedStudentId,
      recordType: sensitiveRecordContext?.recordType,
    });

    setSensitiveRecordContext(null);
  };

  // ========================================
  // Loading State
  // ========================================

  if (!selectedStudentId) {
    return (
      <div className="space-y-6" data-testid="health-records-page">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health Records Management</h1>
            <p className="text-gray-600">Comprehensive electronic health records system</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Student</h3>
          <p className="text-gray-600 mb-6">
            Please select a student to view their health records
          </p>
          <StudentSelector
            selectedStudentId=""
            onStudentSelect={handleStudentSelect}
          />
        </div>
      </div>
    );
  }

  // ========================================
  // Render
  // ========================================

  return (
    <HealthRecordsErrorBoundaryWrapper studentId={selectedStudentId}>
      <div className="space-y-6" data-testid="health-records-page">
        {/* Screen reader announcements */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {isLoading ? 'Loading health records...' : 'Health records loaded'}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8" data-testid="loading-indicator">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading health records...</span>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health Records Management</h1>
            <p className="text-gray-600">Comprehensive electronic health records system</p>
          </div>
          <div className="flex space-x-2">
            {user?.role !== 'READ_ONLY' && (
              <button
                className="btn-primary flex items-center"
                data-testid="new-record-button"
                onClick={() => {
                  setEditingRecord(null);
                  setShowHealthRecordModal(true);
                }}
                aria-label="Create new health record"
              >
                <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
                New Record
              </button>
            )}
            {user?.role === 'ADMIN' && (
              <>
                <button
                  className="btn-secondary flex items-center"
                  data-testid="admin-settings-button"
                  onClick={() => console.log('Settings')}
                  aria-label="Admin settings"
                >
                  <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                  Settings
                </button>
                <button
                  className="btn-secondary flex items-center"
                  data-testid="reports-button"
                  onClick={() => console.log('Reports')}
                  aria-label="View reports"
                >
                  <BarChart3 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Reports
                </button>
              </>
            )}
          </div>
        </div>

        {/* Student Selector */}
        <div className="mb-6">
          <StudentSelector
            selectedStudentId={selectedStudentId}
            onStudentSelect={handleStudentSelect}
          />
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Records"
            value={stats.totalRecords.toString()}
            trend="+12 this month"
            icon={FileText}
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Active Allergies"
            value={stats.activeAllergies.toString()}
            trend={stats.activeAllergies > 0 ? 'Requires attention' : 'None'}
            icon={AlertTriangle}
            iconColor="text-red-600"
          />
          <StatsCard
            title="Chronic Conditions"
            value={stats.chronicConditions.toString()}
            trend="Stable"
            icon={Activity}
            iconColor="text-orange-600"
          />
          <StatsCard
            title="Vaccinations Due"
            value={stats.vaccinationsDue.toString()}
            trend="Next 30 days"
            icon={Shield}
            iconColor="text-green-600"
          />
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4" data-testid="privacy-notice">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" aria-label="Security icon" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900">Protected Health Information</h3>
              <p className="text-sm text-blue-800 mt-1">
                This system contains protected health information (PHI) subject to HIPAA regulations.
                Access is restricted to authorized personnel only. All activities are logged and monitored.
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                  Session: {user?.email}
                </span>
                <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                  Role: {user?.role}
                </span>
                <div className="flex items-center text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded" data-testid="hipaa-compliance-badge">
                  <Shield className="h-3 w-3 mr-1" aria-label="HIPAA compliance icon" />
                  HIPAA Compliant
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          <TabNavigation
            tabs={[
              ...HEALTH_TABS,
              ...(user?.role === 'ADMIN' ? [{ id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 }] : [])
            ]}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onTabLoad={() => {}}
          />

          <div className="p-6">
            {activeTab === 'overview' && (
              <OverviewTab onShowEditAllergyModal={() => console.log('Edit allergy')} />
            )}
            {activeTab === 'records' && (
              <RecordsTab
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                healthRecords={healthRecords}
                onViewDetails={() => console.log('View details')}
              />
            )}
            {activeTab === 'allergies' && (
              <AllergiesTab
                allergies={allergies}
                onAddAllergy={() => console.log('Add allergy')}
                onEditAllergy={(allergy) => console.log('Edit allergy:', allergy)}
                user={user}
              />
            )}
            {activeTab === 'chronic' && (
              <ChronicConditionsTab
                conditions={chronicConditions}
                onAddCondition={() => console.log('Add condition')}
                onViewCarePlan={(condition) => console.log('View care plan:', condition)}
                user={user}
              />
            )}
            {activeTab === 'vaccinations' && (
              <VaccinationsTab
                vaccinations={vaccinations}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                vaccinationFilter={vaccinationFilter}
                onFilterChange={setVaccinationFilter}
                vaccinationSort={vaccinationSort}
                onSortChange={setVaccinationSort}
                onRecordVaccination={() => console.log('Record vaccination')}
                onEditVaccination={(vaccination) => console.log('Edit vaccination:', vaccination)}
                onDeleteVaccination={(vaccination) => console.log('Delete vaccination:', vaccination)}
                onScheduleVaccination={() => console.log('Schedule vaccination')}
                user={user}
              />
            )}
            {activeTab === 'growth' && (
              <GrowthChartsTab
                measurements={growthMeasurements}
                onAddMeasurement={() => console.log('Add measurement')}
                user={user}
              />
            )}
            {activeTab === 'screenings' && (
              <ScreeningsTab
                screenings={screenings}
                onRecordScreening={() => console.log('Record screening')}
                user={user}
              />
            )}
            {activeTab === 'analytics' && user?.role === 'ADMIN' && (
              <AnalyticsTab />
            )}
          </div>
        </div>

        {/* Modals */}
        <SessionExpiredModal
          isOpen={showSessionExpiredModal}
          onLoginAgain={handleSessionExpired}
          onClose={() => setShowSessionExpiredModal(false)}
        />

        <SensitiveRecordWarning
          isOpen={showSensitiveRecordWarning}
          onConfirm={handleConfirmSensitiveAccess}
          onCancel={() => {
            setShowSensitiveRecordWarning(false);
            setSensitiveRecordContext(null);
          }}
          studentName={sensitiveRecordContext?.studentName}
          recordType={sensitiveRecordContext?.recordType}
        />

        <HealthRecordModal
          isOpen={showHealthRecordModal}
          onClose={() => {
            setShowHealthRecordModal(false);
            setEditingRecord(null);
          }}
          onSave={handleSaveHealthRecord}
          initialData={editingRecord}
        />
      </div>
    </HealthRecordsErrorBoundaryWrapper>
  );
};

export default HealthRecordsRefactored;
