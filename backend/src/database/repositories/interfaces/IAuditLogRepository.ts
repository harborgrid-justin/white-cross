/**
 * Audit Log Repository Interface
 */

import { IRepository } from './IRepository';
import { AuditLogEntry } from '../../audit/IAuditLogger';

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  changes: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export interface CreateAuditLogDTO {
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  changes: any;
  ipAddress: string | null;
  userAgent: string | null;
}

export interface UpdateAuditLogDTO {
  // Audit logs are immutable - no updates allowed
}

export interface IAuditLogRepository
  extends IRepository<AuditLog, CreateAuditLogDTO, UpdateAuditLogDTO> {
  /**
   * Find audit logs for specific entity
   */
  findByEntity(entityType: string, entityId: string): Promise<AuditLog[]>;

  /**
   * Find audit logs by user
   */
  findByUser(userId: string, limit?: number): Promise<AuditLog[]>;

  /**
   * Find audit logs by action
   */
  findByAction(action: string, limit?: number): Promise<AuditLog[]>;

  /**
   * Find audit logs within date range
   */
  findByDateRange(startDate: Date, endDate: Date, filters?: any): Promise<AuditLog[]>;

  /**
   * Create multiple audit logs at once (batch insert)
   */
  createMany(entries: CreateAuditLogDTO[]): Promise<void>;
}
