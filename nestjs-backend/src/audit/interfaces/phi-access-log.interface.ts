import { IAuditLogEntry } from './audit-log-entry.interface';
import { PHIAccessType, PHIDataCategory } from '../enums';

/**
 * Interface for PHI (Protected Health Information) access logs
 * HIPAA Compliance: Tracks all access to protected health information
 */
export interface IPHIAccessLog extends IAuditLogEntry {
  studentId: string;
  accessType: PHIAccessType;
  dataCategory: PHIDataCategory;
}
