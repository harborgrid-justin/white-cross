/**
 * Medication Entity
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model and interfaces
export {
  Medication
} from '../../database/models/medication.model';

export type {
  MedicationAttributes
} from '../../database/models/medication.model';

// Import for local interface definitions
import type { MedicationAttributes as MedicationAttrs } from '../../database/models/medication.model';

/**
 * Medication list item with student context
 * Used when listing medications for a specific student
 */
export interface MedicationWithStudentContext extends MedicationAttrs {
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
  medications: MedicationAttrs[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
