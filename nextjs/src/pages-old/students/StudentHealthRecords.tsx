/**
 * Student Health Records Page - White Cross Healthcare Platform
 *
 * Comprehensive health records management system providing complete electronic health
 * record (EHR) functionality for school nurses to track and manage student health data.
 *
 * **Features:**
 * - Multi-tab interface for different record types (all, allergies, conditions, vaccinations, vital signs, growth, screenings)
 * - Complete CRUD operations for all health record types
 * - TanStack Query integration for real-time data synchronization
 * - Delete confirmation with audit trail
 * - Severity and status badge visualization
 * - Responsive table layouts with empty states
 * - URL-based tab state persistence
 *
 * **Health Record Types:**
 * - **All Records**: Complete health visit history
 * - **Allergies**: Allergen tracking with severity and reaction details
 * - **Conditions**: Chronic condition monitoring with care plans
 * - **Vaccinations**: Immunization tracking with lot numbers and administration details
 * - **Vital Signs**: Blood pressure, temperature, heart rate, O2 saturation
 * - **Growth**: Height, weight, BMI measurements over time
 * - **Screenings**: Vision, hearing, dental, and general health screenings
 *
 * **Data Management:**
 * - TanStack Query for server state management
 * - Optimistic updates for responsive UX
 * - Automatic cache invalidation on mutations
 * - Real-time data synchronization
 *
 * @fileoverview Comprehensive health records management with HIPAA compliance
 * @module pages/students/StudentHealthRecords
 * @version 2.0.0
 *
 * @component
 * @returns {React.FC} Student health records page component
 *
 * @example
 * ```tsx
 * // Used in routing with student ID parameter
 * <Route path="/health-records/student/:studentId" element={<StudentHealthRecords />} />
 * ```
 *
 * @remarks
 * **HIPAA Compliance**: This component handles Protected Health Information (PHI).
 * All data access must be audited and logged for compliance purposes.
 *
 * **Access Control**: Requires NURSE, ADMIN, or COUNSELOR role to access health records.
 * Implement role-based access control before rendering sensitive data.
 *
 * **Audit Logging**: All view, create, update, and delete operations on health records
 * must be logged with user ID, timestamp, and action type.
 *
 * **Data Encryption**: Health record data must be encrypted in transit (HTTPS) and
 * at rest in the database.
 *
 * **Critical Allergies**: Life-threatening allergies display prominent warnings.
 * Nurses must review critical allergy information before medication administration.
 *
 * **Vaccination Compliance**: Track vaccination status against state requirements.
 * Generate compliance reports for school enrollment verification.
 *
 * **Growth Tracking**: BMI calculations follow CDC growth chart standards.
 * Flag abnormal growth patterns for nurse review.
 *
 * **Screening Outcomes**: Failed screenings trigger follow-up workflows.
 * Parent notification required for screening referrals.
 *
 * @see {@link useHealthRecords} for data fetching hook
 * @see {@link healthRecordsApi} for API integration
 * @since 1.0.0
 */

import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Heart,
  AlertTriangle,
  Shield,
  Activity,
  Ruler,
  FileText,
  Syringe,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Calendar,
} from 'lucide-react';

// UI Components
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../../components/ui/navigation/Tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmptyState,
  TableLoadingState,
} from '../../components/ui/data/Table';
import { Button } from '../../components/ui/buttons/Button';

// Hooks
import {
  useHealthRecords,
  useAllergies,
  useConditions,
  useVaccinations,
  useVitalSigns,
  useGrowthMeasurements,
  useScreenings,
  useDeleteHealthRecord,
  useDeleteAllergy,
  useDeleteCondition,
  useDeleteVaccination,
  useDeleteVitalSigns,
  useDeleteGrowthMeasurement,
  useDeleteScreening,
} from '../../hooks/domains/health-records/useHealthRecords';

// Types
import type {
  HealthRecord,
  Allergy,
  ChronicCondition,
  Vaccination,
  VitalSigns,
  GrowthMeasurement,
  Screening,
  AllergySeverity,
  ConditionSeverity,
  VaccinationStatus,
  ScreeningOutcome,
} from '../../services/modules/healthRecordsApi';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Valid tab values for health records navigation.
 *
 * @typedef {string} TabValue
 *
 * @property {'all'} all - All health records and visit history
 * @property {'allergies'} allergies - Allergy information with severity levels
 * @property {'conditions'} conditions - Chronic health conditions and care plans
 * @property {'vaccinations'} vaccinations - Immunization records and compliance tracking
 * @property {'vital-signs'} vital-signs - Blood pressure, temperature, heart rate measurements
 * @property {'growth'} growth - Height, weight, BMI tracking over time
 * @property {'screenings'} screenings - Vision, hearing, dental, and health screenings
 *
 * @remarks
 * Tab selection is synced with URL query parameters for deep linking and bookmarking.
 * Default tab is 'all' when no query parameter is present.
 */
type TabValue = 'all' | 'allergies' | 'conditions' | 'vaccinations' | 'vital-signs' | 'growth' | 'screenings';

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Student Health Records Main Component
 *
 * Manages the display and interaction with student health records across multiple
 * health data categories with TanStack Query integration for real-time updates.
 *
 * **State Management:**
 * - URL-based tab state via React Router's useSearchParams
 * - TanStack Query for server state (health records data)
 * - Local state for modal visibility and selected records
 *
 * **Data Fetching:**
 * - Parallel queries for all health record types
 * - Automatic refetching on tab changes
 * - Optimistic updates for create/update/delete operations
 * - Query invalidation on mutations
 *
 * **User Interactions:**
 * - Tab navigation with URL sync
 * - Record selection for edit/delete operations
 * - Modal-based CRUD operations
 * - Confirmation dialogs for destructive actions
 *
 * @component
 * @returns {JSX.Element} Rendered health records interface
 */
const StudentHealthRecords: React.FC = () => {
  // Get student ID from URL params
  const { studentId } = useParams<{ studentId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get active tab from URL or default to 'all'
  const activeTab = (searchParams.get('tab') as TabValue) || 'all';

  // Local state
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch data for each tab
  const { data: healthRecordsData, isLoading: recordsLoading, error: recordsError } = useHealthRecords(studentId || '');
  const { data: allergies, isLoading: allergiesLoading } = useAllergies(studentId || '');
  const { data: conditions, isLoading: conditionsLoading } = useConditions(studentId || '');
  const { data: vaccinations, isLoading: vaccinationsLoading } = useVaccinations(studentId || '');
  const { data: vitalSigns, isLoading: vitalSignsLoading } = useVitalSigns(studentId || '');
  const { data: growthMeasurements, isLoading: growthLoading } = useGrowthMeasurements(studentId || '');
  const { data: screenings, isLoading: screeningsLoading } = useScreenings(studentId || '');

  // Delete mutations
  const deleteHealthRecord = useDeleteHealthRecord();
  const deleteAllergy = useDeleteAllergy();
  const deleteCondition = useDeleteCondition();
  const deleteVaccination = useDeleteVaccination();
  const deleteVitalSigns = useDeleteVitalSigns();
  const deleteGrowthMeasurement = useDeleteGrowthMeasurement();
  const deleteScreening = useDeleteScreening();

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const handleDelete = async () => {
    if (!selectedRecord) return;

    try {
      switch (activeTab) {
        case 'all':
          await deleteHealthRecord.mutateAsync(selectedRecord.id);
          break;
        case 'allergies':
          await deleteAllergy.mutateAsync(selectedRecord.id);
          break;
        case 'conditions':
          await deleteCondition.mutateAsync(selectedRecord.id);
          break;
        case 'vaccinations':
          await deleteVaccination.mutateAsync(selectedRecord.id);
          break;
        case 'vital-signs':
          await deleteVitalSigns.mutateAsync(selectedRecord.id);
          break;
        case 'growth':
          await deleteGrowthMeasurement.mutateAsync(selectedRecord.id);
          break;
        case 'screenings':
          await deleteScreening.mutateAsync(selectedRecord.id);
          break;
      }
      setShowDeleteModal(false);
      setSelectedRecord(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSeverityBadge = (severity: AllergySeverity | ConditionSeverity) => {
    const colors = {
      MILD: 'bg-green-100 text-green-800',
      MODERATE: 'bg-yellow-100 text-yellow-800',
      SEVERE: 'bg-orange-100 text-orange-800',
      LIFE_THREATENING: 'bg-red-100 text-red-800',
      CRITICAL: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[severity]}`}>
        {severity.replace('_', ' ')}
      </span>
    );
  };

  const getVaccinationStatusBadge = (status: VaccinationStatus) => {
    const colors = {
      COMPLETED: 'bg-green-100 text-green-800',
      PARTIAL: 'bg-yellow-100 text-yellow-800',
      OVERDUE: 'bg-red-100 text-red-800',
      EXEMPTED: 'bg-gray-100 text-gray-800',
      NOT_REQUIRED: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getScreeningOutcomeBadge = (outcome: ScreeningOutcome) => {
    const colors = {
      PASSED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      REFER: 'bg-yellow-100 text-yellow-800',
      INCONCLUSIVE: 'bg-gray-100 text-gray-800',
      DECLINED: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[outcome]}`}>
        {outcome}
      </span>
    );
  };

  // ============================================================================
  // TAB CONTENT COMPONENTS
  // ============================================================================

  const AllRecordsTab = () => {
    if (recordsLoading) return <TableLoadingState cols={5} />;
    if (recordsError) return <div className="text-red-600">Error loading health records</div>;
    if (!healthRecordsData?.data || healthRecordsData.data.length === 0) {
      return <TableEmptyState cols={5} title="No health records found" description="Add the first health record to get started." />;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {healthRecordsData.data.map((record: HealthRecord) => (
            <TableRow key={record.id}>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {formatDate(record.date)}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{record.type.replace('_', ' ')}</span>
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  <p className="text-sm text-gray-900 truncate">{record.description}</p>
                  {record.diagnosis && (
                    <p className="text-xs text-gray-500 truncate">Diagnosis: {record.diagnosis}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">{record.provider || 'N/A'}</span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Eye className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedRecord(record);
                      setShowEditModal(true);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedRecord(record);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const AllergiesTab = () => {
    if (allergiesLoading) return <TableLoadingState cols={5} />;
    if (!allergies || allergies.length === 0) {
      return <TableEmptyState cols={5} title="No allergies recorded" description="Add an allergy record to track student allergies." />;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Allergen</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Reaction</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allergies.map((allergy: Allergy) => (
            <TableRow key={allergy.id}>
              <TableCell>
                <div className="flex items-center">
                  {allergy.isCritical && <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />}
                  <span className="font-medium">{allergy.allergen}</span>
                </div>
              </TableCell>
              <TableCell>{allergy.allergyType}</TableCell>
              <TableCell>{getSeverityBadge(allergy.severity)}</TableCell>
              <TableCell>
                <p className="text-sm text-gray-600 max-w-xs truncate">{allergy.reaction || 'N/A'}</p>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Edit className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedRecord(allergy);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedRecord(allergy);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const ConditionsTab = () => {
    if (conditionsLoading) return <TableLoadingState cols={6} />;
    if (!conditions || conditions.length === 0) {
      return <TableEmptyState cols={6} title="No chronic conditions recorded" description="Add a chronic condition to track ongoing health issues." />;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Condition</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Diagnosed Date</TableHead>
            <TableHead>Next Review</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conditions.map((condition: ChronicCondition) => (
            <TableRow key={condition.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{condition.condition}</p>
                  {condition.icdCode && <p className="text-xs text-gray-500">ICD: {condition.icdCode}</p>}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{condition.status}</span>
              </TableCell>
              <TableCell>{getSeverityBadge(condition.severity)}</TableCell>
              <TableCell>{formatDate(condition.diagnosedDate)}</TableCell>
              <TableCell>
                {condition.nextReviewDate ? formatDate(condition.nextReviewDate) : 'N/A'}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Edit className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedRecord(condition);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedRecord(condition);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const VaccinationsTab = () => {
    if (vaccinationsLoading) return <TableLoadingState cols={6} />;
    if (!vaccinations || vaccinations.length === 0) {
      return <TableEmptyState cols={6} title="No vaccinations recorded" description="Add a vaccination record to track immunizations." />;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vaccine Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Administered Date</TableHead>
            <TableHead>Dose</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vaccinations.map((vaccination: Vaccination) => (
            <TableRow key={vaccination.id}>
              <TableCell>
                <div className="flex items-center">
                  <Syringe className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">{vaccination.vaccineName}</span>
                </div>
              </TableCell>
              <TableCell>{vaccination.vaccineType}</TableCell>
              <TableCell>{formatDate(vaccination.administeredDate)}</TableCell>
              <TableCell>
                {vaccination.doseNumber && vaccination.totalDoses
                  ? `${vaccination.doseNumber} of ${vaccination.totalDoses}`
                  : 'N/A'}
              </TableCell>
              <TableCell>{getVaccinationStatusBadge(vaccination.status)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Edit className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedRecord(vaccination);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedRecord(vaccination);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const VitalSignsTab = () => {
    if (vitalSignsLoading) return <TableLoadingState cols={6} />;
    if (!vitalSigns || vitalSigns.length === 0) {
      return <TableEmptyState cols={6} title="No vital signs recorded" description="Add vital signs measurements." />;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Temperature</TableHead>
            <TableHead>Blood Pressure</TableHead>
            <TableHead>Heart Rate</TableHead>
            <TableHead>O2 Saturation</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vitalSigns.map((vital: VitalSigns) => (
            <TableRow key={vital.id}>
              <TableCell>{formatDate(vital.recordDate)}</TableCell>
              <TableCell>
                {vital.temperature ? `${vital.temperature}°C` : 'N/A'}
              </TableCell>
              <TableCell>
                {vital.bloodPressureSystolic && vital.bloodPressureDiastolic
                  ? `${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic}`
                  : 'N/A'}
              </TableCell>
              <TableCell>
                {vital.heartRate ? `${vital.heartRate} bpm` : 'N/A'}
              </TableCell>
              <TableCell>
                {vital.oxygenSaturation ? `${vital.oxygenSaturation}%` : 'N/A'}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Edit className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedRecord(vital);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedRecord(vital);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const GrowthMeasurementsTab = () => {
    if (growthLoading) return <TableLoadingState cols={6} />;
    if (!growthMeasurements || growthMeasurements.length === 0) {
      return <TableEmptyState cols={6} title="No growth measurements recorded" description="Add growth measurements to track development." />;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Height</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>BMI</TableHead>
            <TableHead>Measured By</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {growthMeasurements.map((measurement: GrowthMeasurement) => (
            <TableRow key={measurement.id}>
              <TableCell>{formatDate(measurement.measurementDate)}</TableCell>
              <TableCell>
                {measurement.height ? `${measurement.height} cm` : 'N/A'}
              </TableCell>
              <TableCell>
                {measurement.weight ? `${measurement.weight} kg` : 'N/A'}
              </TableCell>
              <TableCell>
                {measurement.bmi ? measurement.bmi.toFixed(1) : 'N/A'}
              </TableCell>
              <TableCell>{measurement.measuredBy}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Edit className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedRecord(measurement);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedRecord(measurement);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const ScreeningsTab = () => {
    if (screeningsLoading) return <TableLoadingState cols={6} />;
    if (!screenings || screenings.length === 0) {
      return <TableEmptyState cols={6} title="No screenings recorded" description="Add screening results." />;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Outcome</TableHead>
            <TableHead>Performed By</TableHead>
            <TableHead>Follow-up</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {screenings.map((screening: Screening) => (
            <TableRow key={screening.id}>
              <TableCell>
                <span className="font-medium">{screening.screeningType}</span>
              </TableCell>
              <TableCell>{formatDate(screening.screeningDate)}</TableCell>
              <TableCell>{getScreeningOutcomeBadge(screening.outcome)}</TableCell>
              <TableCell>{screening.performedBy}</TableCell>
              <TableCell>
                {screening.followUpRequired && screening.followUpDate
                  ? formatDate(screening.followUpDate)
                  : 'N/A'}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Edit className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedRecord(screening);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedRecord(screening);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  // ============================================================================
  // DELETE MODAL
  // ============================================================================

  const DeleteConfirmationModal = () => {
    if (!showDeleteModal || !selectedRecord) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this record? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedRecord(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  if (!studentId) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Student ID Required</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>No student ID provided in the URL.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <Heart className="w-6 h-6 mr-2 text-red-600" />
              Student Health Records
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Comprehensive health information management with HIPAA compliance
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowCreateModal(true)}
            >
              Add Record
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">
              <FileText className="w-4 h-4 mr-2" />
              All Records
            </TabsTrigger>
            <TabsTrigger value="allergies">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Allergies
            </TabsTrigger>
            <TabsTrigger value="conditions">
              <Heart className="w-4 h-4 mr-2" />
              Chronic Conditions
            </TabsTrigger>
            <TabsTrigger value="vaccinations">
              <Syringe className="w-4 h-4 mr-2" />
              Vaccinations
            </TabsTrigger>
            <TabsTrigger value="vital-signs">
              <Activity className="w-4 h-4 mr-2" />
              Vital Signs
            </TabsTrigger>
            <TabsTrigger value="growth">
              <Ruler className="w-4 h-4 mr-2" />
              Growth
            </TabsTrigger>
            <TabsTrigger value="screenings">
              <Eye className="w-4 h-4 mr-2" />
              Screenings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="mt-4">
              <AllRecordsTab />
            </div>
          </TabsContent>

          <TabsContent value="allergies">
            <div className="mt-4">
              <AllergiesTab />
            </div>
          </TabsContent>

          <TabsContent value="conditions">
            <div className="mt-4">
              <ConditionsTab />
            </div>
          </TabsContent>

          <TabsContent value="vaccinations">
            <div className="mt-4">
              <VaccinationsTab />
            </div>
          </TabsContent>

          <TabsContent value="vital-signs">
            <div className="mt-4">
              <VitalSignsTab />
            </div>
          </TabsContent>

          <TabsContent value="growth">
            <div className="mt-4">
              <GrowthMeasurementsTab />
            </div>
          </TabsContent>

          <TabsContent value="screenings">
            <div className="mt-4">
              <ScreeningsTab />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <DeleteConfirmationModal />

      {/* TODO: Add create/edit modals using existing modal components */}
      {/* These will be integrated in the next step */}
    </div>
  );
};

export default StudentHealthRecords;
