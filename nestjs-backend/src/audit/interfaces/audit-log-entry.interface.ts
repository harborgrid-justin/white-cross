import { AuditAction } from '../enums';

/**
 * Interface for creating audit log entries
 */
export interface IAuditLogEntry {
  userId?: string;
  action: AuditAction | string;
  entityType: string;
  entityId?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
  errorMessage?: string;
}
