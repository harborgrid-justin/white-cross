/**
 * WF-IDX-126 | index.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: types, named exports | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Hooks Index
 *
 * Central export point for all custom React hooks used in the White Cross application.
 * Includes optimistic update hooks, data fetching hooks, and utility hooks.
 *
 * @module hooks
 */

// ======================
// OPTIMISTIC UPDATE HOOKS
// ======================

export {
  // Student Management
  useOptimisticStudentCreate,
  useOptimisticStudentUpdate,
  useOptimisticStudentDeactivate,
  useOptimisticStudentReactivate,
  useOptimisticStudentTransfer,
  useOptimisticStudentPermanentDelete,
  useOptimisticStudents,
  studentKeys,
} from './useOptimisticStudents';

export {
  // Medication Management
  useOptimisticMedicationCreate,
  useOptimisticMedicationUpdate,
  useOptimisticMedicationDelete,
  useOptimisticPrescriptionCreate,
  useOptimisticPrescriptionDeactivate,
  useOptimisticMedicationAdministration,
  useOptimisticInventoryAdd,
  useOptimisticInventoryUpdate,
  useOptimisticAdverseReactionReport,
  useOptimisticMedications,
  medicationKeys,
} from './useOptimisticMedications';

export {
  // Incident Management
  useOptimisticIncidentCreate,
  useOptimisticIncidentUpdate,
  useOptimisticIncidentDelete,
  useOptimisticIncidents,

  // Witness Statements
  useOptimisticWitnessCreate,
  useOptimisticWitnessUpdate,
  useOptimisticWitnessVerify,
  useOptimisticWitnessStatements,

  // Follow-up Actions
  useOptimisticFollowUpCreate,
  useOptimisticFollowUpUpdate,
  useOptimisticFollowUpComplete,
  useOptimisticFollowUpActions,

  incidentKeys,
} from './useOptimisticIncidents';

// ======================
// DATA FETCHING HOOKS
// ======================

export { useStudents } from './useStudents';
export { useStudentManagement } from './useStudentManagement';
export { useMedicationsData } from './useMedicationsData';
export { useMedicationAdministration } from './useMedicationAdministration';
export { useHealthRecords } from './useHealthRecords';
export { useHealthRecordsData } from './useHealthRecordsData';
export { useEmergencyContacts } from './useEmergencyContacts';
export { useAppointments } from './useAppointments';
export { useInventory } from './useInventory';
export { useInventoryManagement } from './useInventoryManagement';

// ======================
// UTILITY HOOKS
// ======================

export { useToast } from './useToast';
export { useMedicationToast } from './useMedicationToast';
export { useFormValidation } from './useFormValidation';
export { useMedicationFormValidation } from './useMedicationFormValidation';
export { useRouteState } from './useRouteState';
export { useReminderManagement } from './useReminderManagement';
export { useCommunicationOptions } from './useCommunicationOptions';

// ======================
// TYPE EXPORTS
// ======================

// Re-export commonly used types from hooks
export type {
  Student,
  CreateStudentData,
  UpdateStudentData,
  TransferStudentRequest,
} from '@/types/student.types';

export type {
  Medication,
  StudentMedication,
  MedicationLog,
  InventoryItem,
  AdverseReaction,
  MedicationAdministrationData,
  StudentMedicationFormData,
  AdverseReactionData,
} from '@/types/medications';

export type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  CreateIncidentReportRequest,
  UpdateIncidentReportRequest,
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
  CreateFollowUpActionRequest,
  UpdateFollowUpActionRequest,
} from '@/types/incidents';
