/**
 * @fileoverview BackupLog repository interface.
 * Auto-generated repository interface for BackupLog data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * BackupLog repository interface
 * Extends base repository with BackupLog-specific operations
 */
export interface IBackupLogRepository extends IRepository<any, any, any> {
  // Add BackupLog-specific methods here if needed
}

/**
 * Create BackupLog DTO
 */
export interface CreateBackupLogDTO {
  [key: string]: any;
}

/**
 * Update BackupLog DTO
 */
export interface UpdateBackupLogDTO {
  [key: string]: any;
}
