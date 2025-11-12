/**
 * WF-COMP-315 | administration-backups.ts - Backup Management Type Definitions
 * Purpose: Type definitions for backup and recovery operations
 * Upstream: administration-enums.ts | Dependencies: None
 * Downstream: Backup management components | Called by: Admin backup UI
 * Related: administration-audit.ts (backup operations are audited)
 * Exports: Backup entity types, backup operation interfaces
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Backup operations and monitoring
 * LLM Context: Type definitions for backup logging and management
 */

import type { BackupType, BackupStatus } from './administration-enums';

/**
 * Backup and Recovery Types
 *
 * Type definitions for:
 * - Backup log entities
 * - Backup operation requests
 * - Backup status tracking
 */

// ==================== BACKUP TYPES ====================

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
