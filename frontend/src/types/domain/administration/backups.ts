/**
 * WF-COMP-315 | administration/backups.ts - Type definitions
 * Purpose: Backup and recovery type definitions for administration module
 * Upstream: enums.ts | Dependencies: BackupType, BackupStatus
 * Downstream: Backup management components | Called by: React components
 * Related: Other administration type files
 * Exports: Interfaces | Key Features: Type definitions
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type definitions for backup and recovery operations
 * LLM Context: Backup management types with status tracking
 */

import type { BackupType, BackupStatus } from './enums';

/**
 * Backup and Recovery Types
 *
 * Type definitions for backup operations including:
 * - Backup log entities aligned with backend models
 * - Create request types
 * - Status tracking
 */

// ==================== BACKUP & RECOVERY TYPES ====================

/**
 * Backup log entity
 *
 * @aligned_with backend/src/database/models/administration/BackupLog.ts
 * @note Backend has timestamps: false, so no updatedAt field
 */
export interface BackupLog {
  id: string;
  type: BackupType;
  status: BackupStatus;
  fileName?: string;
  fileSize?: number;
  location?: string;
  startedAt: string;
  completedAt?: string;
  error?: string;
  triggeredBy?: string;
  createdAt: string;
}

/**
 * Create backup request
 */
export interface CreateBackupData {
  type: BackupType;
  triggeredBy?: string;
}
