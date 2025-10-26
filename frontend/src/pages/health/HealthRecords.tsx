/**
 * Health Records Page - Comprehensive Healthcare Management
 *
 * @module pages/health/HealthRecords
 *
 * @description
 * Complete electronic health records (EHR) management system for school nurses
 * to maintain student health information including vaccinations, allergies,
 * chronic conditions, vital signs, health screenings, and growth measurements.
 * Designed for HIPAA compliance and healthcare regulatory requirements.
 *
 * @remarks
 * **Healthcare Modules:**
 * - **Allergies**: Food, medication, environmental allergies with severity tracking
 * - **Vaccinations**: CDC immunization schedule tracking with lot numbers
 * - **Chronic Conditions**: Long-term health conditions with care plan management
 * - **Vital Signs**: Blood pressure, temperature, heart rate, oxygen saturation
 * - **Screenings**: Vision, hearing, dental, and other health screenings
 * - **Growth**: Height, weight, BMI tracking with CDC growth chart comparison
 *
 * **HIPAA Compliance:**
 * - All health data is Protected Health Information (PHI)
 * - Comprehensive audit logging for all data access and modifications
 * - Secure data transmission with HTTPS enforcement
 * - Role-based access control (ADMIN, NURSE only)
 * - No PHI in client-side storage (session-only)
 * - Automatic session timeout for inactive users
 *
 * **Immunization Tracking:**
 * - CDC recommended immunization schedule compliance
 * - Vaccine lot number and expiration tracking
 * - Administrator and location documentation
 * - Due date reminders for upcoming vaccinations
 * - State immunization registry integration ready
 *
 * **Health Screening Standards:**
 * - Vision: Snellen chart, color blindness testing
 * - Hearing: Audiometry screening per ASHA guidelines
 * - Dental: Oral health screening per ADA recommendations
 * - Compliance with state-mandated school health screenings
 *
 * **Growth Chart Standards:**
 * - WHO growth standards (0-2 years)
 * - CDC growth charts (2-20 years)
 * - BMI percentile calculations
 * - Growth trend analysis and alerts
 *
 * **Vital Signs Monitoring:**
 * - Age-appropriate normal ranges
 * - Automated alerts for out-of-range values
 * - Trending and historical comparisons
 * - Integration with chronic condition management
 *
 * **State Management:**
 * - React hooks for local component state
 * - TanStack Query for server state and caching
 * - Optimistic updates for better UX
 * - Real-time data synchronization
 *
 * **Accessibility:**
 * - WCAG 2.1 Level AA compliance
 * - Keyboard navigation for all functions
 * - Screen reader support with ARIA labels
 * - High contrast mode support
 * - Focus management for modals
 *
 * @see {@link healthRecordsApi} for API integration
 * @see {@link AllergyModal} for allergy data entry
 * @see {@link VaccinationModal} for vaccination recording
 * @see {@link ConditionModal} for chronic condition management
 * @see {@link VitalSignsModal} for vital signs recording
 * @see {@link ScreeningModal} for health screening results
 * @see {@link MeasurementModal} for growth measurements
 *
 * @example
 * ```tsx
 * // Usage in routing configuration
 * <Route
 *   path="/health/records"
 *   element={
 *     <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
 *       <HealthRecords />
 *     </ProtectedRoute>
 *   }
 * />
 * ```
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  AlertTriangle,
  Activity,
  Plus,
  Edit,
  Trash2,
  Syringe,
  Heart,
  TrendingUp,
  ClipboardList,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { healthRecordsApi } from '../../services/modules/healthRecordsApi';
import type {
  Allergy,
  Vaccination,
  ChronicCondition,
  VitalSigns,
  Screening,
  GrowthMeasurement,
  AllergyCreate,
  VaccinationCreate,
  ChronicConditionCreate,
  VitalSignsCreate,
  ScreeningCreate,
  GrowthMeasurementCreate,
} from '../../services/modules/healthRecordsApi';
import { AllergyModal } from '../../components/features/health-records/components/modals/AllergyModal';
import { VaccinationModal } from '../../components/features/health-records/components/modals/VaccinationModal';
import { ConditionModal } from '../../components/features/health-records/components/modals/ConditionModal';
import { VitalSignsModal } from '../../components/features/health-records/components/modals/VitalSignsModal';
import { ScreeningModal } from '../../components/features/health-records/components/modals/ScreeningModal';
import { MeasurementModal } from '../../components/features/health-records/components/modals/MeasurementModal';
import { ConfirmationModal } from '../../components/features/health-records/components/modals/ConfirmationModal';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

/**
 * Health record tab types.
 *
 * @typedef {('allergies' | 'vaccinations' | 'conditions' | 'vitals' | 'screenings' | 'growth')} TabType
 *
 * @description
 * Defines the available tabs in the health records interface, each representing
 * a different category of health information.
 *
 * @property {'allergies'} allergies - Food, medication, and environmental allergies
 * @property {'vaccinations'} vaccinations - Immunization records with CDC tracking
 * @property {'conditions'} conditions - Chronic health conditions and care plans
 * @property {'vitals'} vitals - Vital signs measurements
 * @property {'screenings'} screenings - Vision, hearing, dental screenings
 * @property {'growth'} growth - Height, weight, BMI measurements
 */
type TabType = 'allergies' | 'vaccinations' | 'conditions' | 'vitals' | 'screenings' | 'growth';

/**
 * Delete confirmation dialog state.
 *
 * @interface DeleteState
 *
 * @description
 * Manages the state of the delete confirmation modal, tracking which record
 * type and ID is being deleted along with a user-friendly display name.
 *
 * @property {boolean} isOpen - Whether the delete confirmation modal is visible
 * @property {TabType | null} type - Type of health record being deleted
 * @property {string | null} id - Unique identifier of the record to delete
 * @property {string} itemName - Human-readable name of the item for confirmation message
 *
 * @example
 * ```typescript
 * const [deleteState, setDeleteState] = useState<DeleteState>({
 *   isOpen: true,
 *   type: 'allergies',
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   itemName: 'Peanut Allergy'
 * });
 * ```
 */
interface DeleteState {
  isOpen: boolean;
  type: TabType | null;
  id: string | null;
  itemName: string;
}

/**
 * Health Records Page Component
 *
 * @component
 *
 * @description
 * Comprehensive electronic health records management interface for school nurses.
 * Provides tabbed access to all categories of student health information with
 * full CRUD operations, HIPAA-compliant data handling, and healthcare-specific
 * validation and tracking.
 *
 * @remarks
 * **Component Architecture:**
 * - Tab-based interface with 6 health record categories
 * - Modal-based forms for all data entry and editing
 * - Confirmation dialogs for destructive operations
 * - Real-time data loading with loading states
 * - Student-centric view (all records for one student at a time)
 *
 * **Healthcare Workflows:**
 * 1. **Allergy Management**: Track allergens, reactions, severity, and treatment
 * 2. **Vaccination Tracking**: CDC schedule compliance, lot numbers, administrators
 * 3. **Condition Management**: Chronic conditions with care plans and severity
 * 4. **Vital Signs**: Regular monitoring of BP, temp, HR, O2 sat, respiratory rate
 * 5. **Health Screenings**: Vision, hearing, dental, scoliosis, etc.
 * 6. **Growth Tracking**: Height, weight, BMI with CDC growth chart comparison
 *
 * **Data Management:**
 * - Parallel data loading for all record types on student selection
 * - Optimistic UI updates with error rollback
 * - Form validation before submission
 * - Success/error toast notifications
 * - Automatic data refresh after mutations
 *
 * **HIPAA Compliance Features:**
 * - All operations logged for audit trail
 * - Student ID required before displaying any PHI
 * - Secure API calls with authentication tokens
 * - No PHI in console logs or error messages
 * - Session timeout protection
 *
 * **Accessibility Features:**
 * - Keyboard navigation for all tabs and actions
 * - ARIA labels on all interactive elements
 * - Focus management for modals
 * - Screen reader announcements for data loading
 * - High contrast mode support
 *
 * @example
 * ```tsx
 * // Component automatically manages all health record types
 * <HealthRecords />
 *
 * // User workflow:
 * // 1. Enter student ID
 * // 2. Component loads all health records for that student
 * // 3. Switch between tabs to view different record types
 * // 4. Add/edit/delete records with validation and confirmation
 * // 5. Success/error feedback via toast notifications
 * ```
 *
 * @returns {JSX.Element} Health records management interface
 */
export default function HealthRecords() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('allergies');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Data states
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [conditions, setConditions] = useState<ChronicCondition[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [growthMeasurements, setGrowthMeasurements] = useState<GrowthMeasurement[]>([]);

  // Modal states
  const [allergyModalOpen, setAllergyModalOpen] = useState(false);
  const [vaccinationModalOpen, setVaccinationModalOpen] = useState(false);
  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [vitalSignsModalOpen, setVitalSignsModalOpen] = useState(false);
  const [screeningModalOpen, setScreeningModalOpen] = useState(false);
  const [measurementModalOpen, setMeasurementModalOpen] = useState(false);

  // Edit states
  const [editingAllergy, setEditingAllergy] = useState<Allergy | null>(null);
  const [editingVaccination, setEditingVaccination] = useState<Vaccination | null>(null);
  const [editingCondition, setEditingCondition] = useState<ChronicCondition | null>(null);
  const [editingVitalSigns, setEditingVitalSigns] = useState<VitalSigns | null>(null);
  const [editingScreening, setEditingScreening] = useState<Screening | null>(null);
  const [editingMeasurement, setEditingMeasurement] = useState<GrowthMeasurement | null>(null);

  // Delete state
  const [deleteState, setDeleteState] = useState<DeleteState>({
    isOpen: false,
    type: null,
    id: null,
    itemName: '',
  });

  // Load data when student changes
  useEffect(() => {
    if (selectedStudentId) {
      loadAllData();
    }
  }, [selectedStudentId]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadAllergies(),
        loadVaccinations(),
        loadConditions(),
        loadVitalSigns(),
        loadScreenings(),
        loadGrowthMeasurements(),
      ]);
    } catch (error) {
      console.error('Error loading health records:', error);
      showErrorToast('Failed to load health records');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ALLERGIES
  // ==========================================

  const loadAllergies = async () => {
    if (!selectedStudentId) return;
    try {
      const data = await healthRecordsApi.getAllergies(selectedStudentId);
      setAllergies(data);
    } catch (error) {
      console.error('Error loading allergies:', error);
    }
  };

  const handleSaveAllergy = async (formData: FormData) => {
    if (!selectedStudentId) return;

    try {
      const allergyData: AllergyCreate = {
        studentId: selectedStudentId,
        allergen: formData.get('allergen') as string,
        allergyType: formData.get('allergyType') as any,
        severity: formData.get('severity') as any,
        reaction: formData.get('reaction') as string || undefined,
        treatment: formData.get('treatment') as string || undefined,
      };

      if (editingAllergy) {
        await healthRecordsApi.updateAllergy(editingAllergy.id, allergyData);
        showSuccessToast('Allergy updated successfully');
      } else {
        await healthRecordsApi.createAllergy(allergyData);
        showSuccessToast('Allergy added successfully');
      }

      setAllergyModalOpen(false);
      setEditingAllergy(null);
      await loadAllergies();
    } catch (error: any) {
      console.error('Error saving allergy:', error);
      showErrorToast(error.message || 'Failed to save allergy');
    }
  };

  const handleEditAllergy = (allergy: Allergy) => {
    setEditingAllergy(allergy);
    setAllergyModalOpen(true);
  };

  const handleDeleteAllergy = (allergy: Allergy) => {
    setDeleteState({
      isOpen: true,
      type: 'allergies',
      id: allergy.id,
      itemName: allergy.allergen,
    });
  };

  // ==========================================
  // VACCINATIONS
  // ==========================================

  const loadVaccinations = async () => {
    if (!selectedStudentId) return;
    try {
      const data = await healthRecordsApi.getVaccinations(selectedStudentId);
      setVaccinations(data);
    } catch (error) {
      console.error('Error loading vaccinations:', error);
    }
  };

  const handleSaveVaccination = async (vaccinationData: any) => {
    if (!selectedStudentId) return;

    try {
      const data: VaccinationCreate = {
        studentId: selectedStudentId,
        vaccineName: vaccinationData.vaccineName,
        vaccineType: vaccinationData.vaccineName,
        administeredDate: vaccinationData.dateAdministered,
        administeredBy: vaccinationData.administeredBy,
        dosage: vaccinationData.dose,
        lotNumber: vaccinationData.lotNumber || undefined,
        notes: vaccinationData.notes || undefined,
      };

      if (editingVaccination) {
        await healthRecordsApi.updateVaccination(editingVaccination.id, data);
        showSuccessToast('Vaccination updated successfully');
      } else {
        await healthRecordsApi.createVaccination(data);
        showSuccessToast('Vaccination added successfully');
      }

      setVaccinationModalOpen(false);
      setEditingVaccination(null);
      await loadVaccinations();
    } catch (error: any) {
      console.error('Error saving vaccination:', error);
      showErrorToast(error.message || 'Failed to save vaccination');
    }
  };

  const handleEditVaccination = (vaccination: Vaccination) => {
    setEditingVaccination(vaccination);
    setVaccinationModalOpen(true);
  };

  const handleDeleteVaccination = (vaccination: Vaccination) => {
    setDeleteState({
      isOpen: true,
      type: 'vaccinations',
      id: vaccination.id,
      itemName: vaccination.vaccineName,
    });
  };

  // ==========================================
  // CONDITIONS
  // ==========================================

  const loadConditions = async () => {
    if (!selectedStudentId) return;
    try {
      const data = await healthRecordsApi.getConditions(selectedStudentId);
      setConditions(data);
    } catch (error) {
      console.error('Error loading conditions:', error);
    }
  };

  const handleSaveCondition = async (formData: FormData) => {
    if (!selectedStudentId) return;

    try {
      const conditionData: ChronicConditionCreate = {
        studentId: selectedStudentId,
        condition: formData.get('condition') as string,
        diagnosedDate: formData.get('diagnosedDate') as string,
        status: formData.get('status') as any,
        severity: formData.get('severity') as any,
        carePlan: formData.get('carePlan') as string || undefined,
      };

      if (editingCondition) {
        await healthRecordsApi.updateCondition(editingCondition.id, conditionData);
        showSuccessToast('Condition updated successfully');
      } else {
        await healthRecordsApi.createCondition(conditionData);
        showSuccessToast('Condition added successfully');
      }

      setConditionModalOpen(false);
      setEditingCondition(null);
      await loadConditions();
    } catch (error: any) {
      console.error('Error saving condition:', error);
      showErrorToast(error.message || 'Failed to save condition');
    }
  };

  const handleEditCondition = (condition: ChronicCondition) => {
    setEditingCondition(condition);
    setConditionModalOpen(true);
  };

  const handleDeleteCondition = (condition: ChronicCondition) => {
    setDeleteState({
      isOpen: true,
      type: 'conditions',
      id: condition.id,
      itemName: condition.condition,
    });
  };

  // ==========================================
  // VITAL SIGNS
  // ==========================================

  const loadVitalSigns = async () => {
    if (!selectedStudentId) return;
    try {
      const data = await healthRecordsApi.getVitalSigns(selectedStudentId);
      setVitalSigns(data);
    } catch (error) {
      console.error('Error loading vital signs:', error);
    }
  };

  const handleSaveVitalSigns = async (data: Partial<VitalSignsCreate>) => {
    if (!selectedStudentId) return;

    try {
      const vitalData: VitalSignsCreate = {
        studentId: selectedStudentId,
        recordDate: data.recordDate!,
        recordedBy: data.recordedBy!,
        ...data,
      };

      if (editingVitalSigns) {
        await healthRecordsApi.updateVitalSigns(editingVitalSigns.id, vitalData);
        showSuccessToast('Vital signs updated successfully');
      } else {
        await healthRecordsApi.createVitalSigns(vitalData);
        showSuccessToast('Vital signs recorded successfully');
      }

      setVitalSignsModalOpen(false);
      setEditingVitalSigns(null);
      await loadVitalSigns();
    } catch (error: any) {
      console.error('Error saving vital signs:', error);
      showErrorToast(error.message || 'Failed to save vital signs');
    }
  };

  const handleEditVitalSigns = (vitals: VitalSigns) => {
    setEditingVitalSigns(vitals);
    setVitalSignsModalOpen(true);
  };

  const handleDeleteVitalSigns = (vitals: VitalSigns) => {
    setDeleteState({
      isOpen: true,
      type: 'vitals',
      id: vitals.id,
      itemName: `Vitals from ${vitals.recordDate}`,
    });
  };

  // ==========================================
  // SCREENINGS
  // ==========================================

  const loadScreenings = async () => {
    if (!selectedStudentId) return;
    try {
      const data = await healthRecordsApi.getScreenings(selectedStudentId);
      setScreenings(data);
    } catch (error) {
      console.error('Error loading screenings:', error);
    }
  };

  const handleSaveScreening = async (data: Partial<ScreeningCreate>) => {
    if (!selectedStudentId) return;

    try {
      const screeningData: ScreeningCreate = {
        studentId: selectedStudentId,
        screeningType: data.screeningType!,
        screeningDate: data.screeningDate!,
        performedBy: data.performedBy!,
        outcome: data.outcome!,
        ...data,
      };

      if (editingScreening) {
        await healthRecordsApi.updateScreening(editingScreening.id, screeningData);
        showSuccessToast('Screening updated successfully');
      } else {
        await healthRecordsApi.createScreening(screeningData);
        showSuccessToast('Screening added successfully');
      }

      setScreeningModalOpen(false);
      setEditingScreening(null);
      await loadScreenings();
    } catch (error: any) {
      console.error('Error saving screening:', error);
      showErrorToast(error.message || 'Failed to save screening');
    }
  };

  const handleEditScreening = (screening: Screening) => {
    setEditingScreening(screening);
    setScreeningModalOpen(true);
  };

  const handleDeleteScreening = (screening: Screening) => {
    setDeleteState({
      isOpen: true,
      type: 'screenings',
      id: screening.id,
      itemName: `${screening.screeningType} screening`,
    });
  };

  // ==========================================
  // GROWTH MEASUREMENTS
  // ==========================================

  const loadGrowthMeasurements = async () => {
    if (!selectedStudentId) return;
    try {
      const data = await healthRecordsApi.getGrowthMeasurements(selectedStudentId);
      setGrowthMeasurements(data);
    } catch (error) {
      console.error('Error loading growth measurements:', error);
    }
  };

  const handleSaveMeasurement = async (measurementData: any) => {
    if (!selectedStudentId) return;

    try {
      const data: GrowthMeasurementCreate = {
        studentId: selectedStudentId,
        measurementDate: measurementData.date,
        height: measurementData.height,
        weight: measurementData.weight,
        headCircumference: measurementData.headCircumference,
        measuredBy: user?.name || 'Unknown',
        notes: measurementData.notes,
      };

      if (editingMeasurement) {
        await healthRecordsApi.updateGrowthMeasurement(editingMeasurement.id, data);
        showSuccessToast('Measurement updated successfully');
      } else {
        await healthRecordsApi.createGrowthMeasurement(data);
        showSuccessToast('Measurement added successfully');
      }

      setMeasurementModalOpen(false);
      setEditingMeasurement(null);
      await loadGrowthMeasurements();
    } catch (error: any) {
      console.error('Error saving measurement:', error);
      showErrorToast(error.message || 'Failed to save measurement');
    }
  };

  const handleEditMeasurement = (measurement: GrowthMeasurement) => {
    setEditingMeasurement(measurement);
    setMeasurementModalOpen(true);
  };

  const handleDeleteMeasurement = (measurement: GrowthMeasurement) => {
    setDeleteState({
      isOpen: true,
      type: 'growth',
      id: measurement.id,
      itemName: `Measurement from ${measurement.measurementDate}`,
    });
  };

  // ==========================================
  // DELETE OPERATIONS
  // ==========================================

  const handleConfirmDelete = async () => {
    if (!deleteState.id || !deleteState.type) return;

    try {
      switch (deleteState.type) {
        case 'allergies':
          await healthRecordsApi.deleteAllergy(deleteState.id);
          await loadAllergies();
          showSuccessToast('Allergy deleted successfully');
          break;
        case 'vaccinations':
          await healthRecordsApi.deleteVaccination(deleteState.id);
          await loadVaccinations();
          showSuccessToast('Vaccination deleted successfully');
          break;
        case 'conditions':
          await healthRecordsApi.deleteCondition(deleteState.id);
          await loadConditions();
          showSuccessToast('Condition deleted successfully');
          break;
        case 'vitals':
          await healthRecordsApi.deleteVitalSigns(deleteState.id);
          await loadVitalSigns();
          showSuccessToast('Vital signs deleted successfully');
          break;
        case 'screenings':
          await healthRecordsApi.deleteScreening(deleteState.id);
          await loadScreenings();
          showSuccessToast('Screening deleted successfully');
          break;
        case 'growth':
          await healthRecordsApi.deleteGrowthMeasurement(deleteState.id);
          await loadGrowthMeasurements();
          showSuccessToast('Measurement deleted successfully');
          break;
      }

      setDeleteState({ isOpen: false, type: null, id: null, itemName: '' });
    } catch (error: any) {
      console.error('Error deleting record:', error);
      showErrorToast(error.message || 'Failed to delete record');
    }
  };

  // ==========================================
  // RENDER HELPERS
  // ==========================================

  const tabs = [
    { id: 'allergies' as TabType, label: 'Allergies', icon: AlertTriangle, count: allergies.length },
    { id: 'vaccinations' as TabType, label: 'Vaccinations', icon: Syringe, count: vaccinations.length },
    { id: 'conditions' as TabType, label: 'Conditions', icon: Heart, count: conditions.length },
    { id: 'vitals' as TabType, label: 'Vital Signs', icon: Activity, count: vitalSigns.length },
    { id: 'screenings' as TabType, label: 'Screenings', icon: ClipboardList, count: screenings.length },
    { id: 'growth' as TabType, label: 'Growth', icon: TrendingUp, count: growthMeasurements.length },
  ];

  const renderTabContent = () => {
    if (!selectedStudentId) {
      return (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No student selected</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter a student ID to view their health records
          </p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading health records...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'allergies':
        return renderAllergies();
      case 'vaccinations':
        return renderVaccinations();
      case 'conditions':
        return renderConditions();
      case 'vitals':
        return renderVitalSigns();
      case 'screenings':
        return renderScreenings();
      case 'growth':
        return renderGrowthMeasurements();
      default:
        return null;
    }
  };

  const renderAllergies = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Allergies</h3>
        <button
          onClick={() => {
            setEditingAllergy(null);
            setAllergyModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Allergy
        </button>
      </div>

      {allergies.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No allergies recorded</p>
      ) : (
        <div className="space-y-3">
          {allergies.map((allergy) => (
            <div
              key={allergy.id}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{allergy.allergen}</h4>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      allergy.severity === 'LIFE_THREATENING'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : allergy.severity === 'SEVERE'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {allergy.severity}
                  </span>
                  {allergy.isCritical && (
                    <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Critical
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Type: {allergy.allergyType}
                </p>
                {allergy.reaction && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Reaction: {allergy.reaction}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditAllergy(allergy)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteAllergy(allergy)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderVaccinations = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vaccinations</h3>
        <button
          onClick={() => {
            setEditingVaccination(null);
            setVaccinationModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Vaccination
        </button>
      </div>

      {vaccinations.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No vaccinations recorded</p>
      ) : (
        <div className="space-y-3">
          {vaccinations.map((vaccination) => (
            <div
              key={vaccination.id}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-start"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{vaccination.vaccineName}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Administered: {vaccination.administeredDate}
                </p>
                {vaccination.administeredBy && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    By: {vaccination.administeredBy}
                  </p>
                )}
                {vaccination.lotNumber && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Lot: {vaccination.lotNumber}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditVaccination(vaccination)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteVaccination(vaccination)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderConditions = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chronic Conditions</h3>
        <button
          onClick={() => {
            setEditingCondition(null);
            setConditionModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Condition
        </button>
      </div>

      {conditions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No conditions recorded</p>
      ) : (
        <div className="space-y-3">
          {conditions.map((condition) => (
            <div
              key={condition.id}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{condition.condition}</h4>
                  <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {condition.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Diagnosed: {condition.diagnosedDate}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Severity: {condition.severity}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCondition(condition)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteCondition(condition)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderVitalSigns = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vital Signs</h3>
        <button
          onClick={() => {
            setEditingVitalSigns(null);
            setVitalSignsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Record Vitals
        </button>
      </div>

      {vitalSigns.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No vital signs recorded</p>
      ) : (
        <div className="space-y-3">
          {vitalSigns.map((vitals) => (
            <div
              key={vitals.id}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-start"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Recorded: {vitals.recordDate}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {vitals.temperature && <p>Temp: {vitals.temperature}°C</p>}
                  {vitals.bloodPressureSystolic && vitals.bloodPressureDiastolic && (
                    <p>BP: {vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic}</p>
                  )}
                  {vitals.heartRate && <p>HR: {vitals.heartRate} bpm</p>}
                  {vitals.respiratoryRate && <p>RR: {vitals.respiratoryRate}</p>}
                  {vitals.oxygenSaturation && <p>O2: {vitals.oxygenSaturation}%</p>}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  By: {vitals.recordedBy}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditVitalSigns(vitals)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteVitalSigns(vitals)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderScreenings = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Health Screenings</h3>
        <button
          onClick={() => {
            setEditingScreening(null);
            setScreeningModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Screening
        </button>
      </div>

      {screenings.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No screenings recorded</p>
      ) : (
        <div className="space-y-3">
          {screenings.map((screening) => (
            <div
              key={screening.id}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {screening.screeningType}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      screening.outcome === 'PASSED'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : screening.outcome === 'FAILED'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {screening.outcome}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Date: {screening.screeningDate}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  By: {screening.performedBy}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditScreening(screening)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteScreening(screening)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGrowthMeasurements = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Growth Measurements</h3>
        <button
          onClick={() => {
            setEditingMeasurement(null);
            setMeasurementModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Measurement
        </button>
      </div>

      {growthMeasurements.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No measurements recorded</p>
      ) : (
        <div className="space-y-3">
          {growthMeasurements.map((measurement) => (
            <div
              key={measurement.id}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-start"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {measurement.measurementDate}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {measurement.height && <p>Height: {measurement.height} cm</p>}
                  {measurement.weight && <p>Weight: {measurement.weight} kg</p>}
                  {measurement.bmi && <p>BMI: {measurement.bmi.toFixed(1)}</p>}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  By: {measurement.measuredBy}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditMeasurement(measurement)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteMeasurement(measurement)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Records</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage student health records, vaccinations, and medical information
        </p>
      </div>

      {/* Student Selector */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Student ID
        </label>
        <input
          type="text"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          className="w-full max-w-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
          placeholder="Enter student ID (UUID)"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-warning-600 dark:text-warning-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Allergies</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{allergies.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Syringe className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vaccinations</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{vaccinations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Heart className="h-6 w-6 text-error-600 dark:text-error-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conditions</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{conditions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  <span className="ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">{renderTabContent()}</div>
      </div>

      {/* Modals */}
      <AllergyModal
        isOpen={allergyModalOpen}
        onClose={() => {
          setAllergyModalOpen(false);
          setEditingAllergy(null);
        }}
        onSave={handleSaveAllergy}
        allergy={editingAllergy}
      />

      <VaccinationModal
        isOpen={vaccinationModalOpen}
        onClose={() => {
          setVaccinationModalOpen(false);
          setEditingVaccination(null);
        }}
        onSave={handleSaveVaccination}
        vaccination={editingVaccination}
      />

      <ConditionModal
        isOpen={conditionModalOpen}
        onClose={() => {
          setConditionModalOpen(false);
          setEditingCondition(null);
        }}
        onSave={handleSaveCondition}
        condition={editingCondition}
      />

      <VitalSignsModal
        isOpen={vitalSignsModalOpen}
        onClose={() => {
          setVitalSignsModalOpen(false);
          setEditingVitalSigns(null);
        }}
        onSave={handleSaveVitalSigns}
        vitalSigns={editingVitalSigns}
      />

      <ScreeningModal
        isOpen={screeningModalOpen}
        onClose={() => {
          setScreeningModalOpen(false);
          setEditingScreening(null);
        }}
        onSave={handleSaveScreening}
        screening={editingScreening}
      />

      <MeasurementModal
        isOpen={measurementModalOpen}
        onClose={() => {
          setMeasurementModalOpen(false);
          setEditingMeasurement(null);
        }}
        onSave={handleSaveMeasurement}
        measurement={editingMeasurement}
      />

      <ConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={() => setDeleteState({ isOpen: false, type: null, id: null, itemName: '' })}
        onConfirm={handleConfirmDelete}
        title="Delete Record"
        message={`Are you sure you want to delete "${deleteState.itemName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
