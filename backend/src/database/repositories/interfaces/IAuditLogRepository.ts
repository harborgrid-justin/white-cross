/**
 * LOC: 7A400E814A
 * WC-GEN-109 | IAuditLogRepository.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - IRepository.ts (database/repositories/interfaces/IRepository.ts)
 *   - IAuditLogger.ts (database/audit/IAuditLogger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - RepositoryFactory.ts (database/repositories/RepositoryFactory.ts)
 *   - IUnitOfWork.ts (database/uow/IUnitOfWork.ts)
 *   - SequelizeUnitOfWork.ts (database/uow/SequelizeUnitOfWork.ts)
 */

/**
 * WC-GEN-109 | IAuditLogRepository.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ./IRepository, ../../audit/IAuditLogger | Dependencies: ./IRepository, ../../audit/IAuditLogger
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

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
