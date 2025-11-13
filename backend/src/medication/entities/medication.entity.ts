/**
 * Medication Entity
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model and interfaces
export {
  Medication,
  Medication as MedicationEntity,
} from '@/database/models';

export { } from '@/database/models';

export { } from '@/database/models';

// Import for local interface definitions
import type { MedicationAttributes as MedicationAttrs } from '@/database/models';
import type { StudentMedication } from '@/database/models';

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
  medications: StudentMedication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
