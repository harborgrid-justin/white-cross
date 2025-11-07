import { AuditAction } from '@/audit';

/**
 * Interface for creating audit log entries
 */
export interface IAuditLogEntry {
  userId?: string;
  action: AuditAction | string;
  entityType: string;
  entityId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
  errorMessage?: string;
}
