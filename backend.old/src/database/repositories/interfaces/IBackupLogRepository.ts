/**
 * @fileoverview BackupLog repository interface.
 * Repository interface for BackupLog data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * BackupLog repository interface
 * Extends base repository with BackupLog-specific operations
 */
export interface IBackupLogRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create BackupLog DTO
 */
export interface CreateBackupLogDTO {
  // Properties defined by BackupLog model
  id?: string;
}

/**
 * Update BackupLog DTO
 */
export interface UpdateBackupLogDTO {
  // Properties defined by BackupLog model  
  id?: string;
}
