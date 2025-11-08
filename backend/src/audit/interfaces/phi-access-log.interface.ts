import { IAuditLogEntry } from './audit-log-entry.interface';
import { PHIAccessType } from '../enums/phi-access-type.enum';
import { PHIDataCategory } from '../enums/phi-data-category.enum';

/**
 * Interface for PHI (Protected Health Information) access logs
 * HIPAA Compliance: Tracks all access to protected health information
 */
export interface IPHIAccessLog extends IAuditLogEntry {
  studentId: string;
  accessType: PHIAccessType;
  dataCategory: PHIDataCategory;
}
