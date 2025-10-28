/**
 * Medication Entity
 *
 * Represents a medication in the healthcare platform's formulary.
 *
 * Relations:
 * - OneToMany with StudentMedication (student prescriptions)
 * - OneToMany with MedicationInventory (stock tracking)
 *
 * Indexes:
 * - name (for search queries)
 * - ndc (for NDC code lookups)
 * - isActive (for filtering active medications)
 * - isControlled (for controlled substance tracking)
 */
export interface MedicationEntity {
  id: string;
  name: string;
  genericName?: string;
  dosageForm: string; // Tablet, Capsule, Solution, etc.
  strength: string;
  strengthUnit?: string; // mg, mcg, mL, units
  manufacturer?: string;
  ndc?: string; // National Drug Code
  isControlled: boolean;
  deaSchedule?: string; // II, III, IV, V for controlled substances
  routeOfAdministration?: string; // Oral, IV, IM, Topical, etc.
  warnings?: string;
  sideEffects?: string;
  contraindications?: string;
  isActive: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations (populated when needed)
  studentMedications?: any[]; // StudentMedication entities
  inventory?: any; // MedicationInventory entity
}

/**
 * Medication list item with student context
 * Used when listing medications for a specific student
 */
export interface MedicationWithStudentContext extends MedicationEntity {
  studentId: string;
  studentName?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  prescribedBy?: string;
  startDate?: Date;
  endDate?: Date;
  instructions?: string;
}

/**
 * Paginated medication response
 */
export interface PaginatedMedicationResponse {
  medications: MedicationEntity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
