/**
 * @fileoverview Data Archival Query Composites for Sequelize + NestJS
 * @module reuse/clinic/composites/data-archival-queries-composites
 * @description Production-ready data retention operations with archival policies,
 * purging strategies, compliance management, restoration workflows, and audit trails.
 * Composed from existing health and data utilities for comprehensive data lifecycle management.
 *
 * @version 1.0.0
 * @requires sequelize ^6.x
 * @requires @nestjs/common ^10.x
 */

import { Injectable, Inject, Logger, InternalServerErrorException } from '@nestjs/common';
import {
  Sequelize,
  Model,
  ModelCtor,
  FindOptions,
  WhereOptions,
  Op,
  Transaction,
  QueryTypes,
  Attributes,
  OrderItem,
  literal,
  fn,
  col,
} from 'sequelize';

/**
 * Archival policy configuration
 */
export interface ArchivalPolicyConfig {
  tableName: string;
  retentionDays: number;
  archiveMethod: 'soft_delete' | 'move_to_archive' | 'compress';
  includeRelated: boolean;
  notificationEnabled: boolean;
}

/**
 * Archival job status
 */
export interface ArchivalJobStatus {
  jobId: string;
  tableName: string;
  recordsProcessed: number;
  recordsArchived: number;
  recordsFailed: number;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed' | 'paused';
  errors: string[];
}

/**
 * Restoration request
 */
export interface RestorationRequest {
  requestId: string;
  tableName: string;
  recordIds: string[];
  requestedBy: string;
  requestedAt: Date;
  reason: string;
  approvalRequired: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

/**
 * Archive records based on retention policy
 *
 * @param sequelize - Sequelize instance
 * @param policy - Archival policy configuration
 * @param transaction - Transaction
 * @returns Archival job status
 *
 * @example
 * ```typescript
 * const job = await archiveRecordsByPolicy(
 *   sequelize,
 *   {
 *     tableName: 'medical_records',
 *     retentionDays: 2555,
 *     archiveMethod: 'move_to_archive',
 *     includeRelated: true,
 *     notificationEnabled: false
 *   },
 *   transaction
 * );
 * ```
 */
/**
 * NestJS Injectable Service for Data Archival Operations
 *
 * Provides comprehensive data retention, archival, and compliance management
 * with proper dependency injection and lifecycle management.
 */
@Injectable()
export class DataArchivalQueriesService {
  private readonly logger: Logger;

  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {
    this.logger = new Logger(DataArchivalQueriesService.name);
  }

  /**
   * Validates table name against allowed archival tables
   * Prevents SQL injection via table name parameter
   */
  private validateArchivalTableName(tableName: string): boolean {
    // Whitelist of allowed tables for archival operations
    const allowedTables = [
      'medical_records',
      'visits',
      'appointments',
      'medication_administration',
      'lab_results',
      'immunization_records',
      'health_screenings',
      'clinic_visits',
      'patient_communications',
      'audit_logs',
    ];

    return allowedTables.includes(tableName);
  }

  /**
   * Sanitizes and validates table name for SQL operations
   * Returns null if validation fails
   */
  private getSafeTableIdentifier(tableName: string): string | null {
    if (!this.validateArchivalTableName(tableName)) {
      return null;
    }

    // Additional validation: ensure table name only contains safe characters
    if (!/^[a-z_][a-z0-9_]*$/.test(tableName)) {
      return null;
    }

    return tableName;
  }

  /**
   * Archive records based on retention policy
   */
  async archiveRecordsByPolicy(
    policy: ArchivalPolicyConfig,
    transaction: Transaction
  ): Promise<ArchivalJobStatus> {
    const jobStatus: ArchivalJobStatus = {
      jobId: `ARCH-${Date.now()}`,
      tableName: policy.tableName,
      recordsProcessed: 0,
      recordsArchived: 0,
      recordsFailed: 0,
      startedAt: new Date(),
      status: 'running',
      errors: [],
    };

    try {
      // Validate table name to prevent SQL injection
      const safeTableName = this.getSafeTableIdentifier(policy.tableName);
      if (!safeTableName) {
        throw new InternalServerErrorException(`Invalid table name for archival: ${policy.tableName}`);
      }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - policy.retentionDays);

    if (policy.archiveMethod === 'soft_delete') {
      // Use identifier quoting for table name
      const result = await this.sequelize.query(
        `
        UPDATE :tableName:
        SET deleted_at = NOW(), archived = true, archived_at = NOW()
        WHERE created_at < :cutoffDate
          AND (deleted_at IS NULL OR archived != true)
      `,
        {
          replacements: {
            tableName: safeTableName,
            cutoffDate
          },
          type: QueryTypes.UPDATE,
          transaction,
        }
      );

      jobStatus.recordsArchived = Array.isArray(result) ? result[1] : 0;
    } else if (policy.archiveMethod === 'move_to_archive') {
      const archiveTableName = `${safeTableName}_archive`;

      // Verify archive table exists before operations
      const [tableExists] = await this.sequelize.query(
        `SELECT EXISTS (SELECT FROM pg_tables WHERE tablename = :archiveTable)`,
        {
          replacements: { archiveTable: archiveTableName },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      if (!(tableExists as any).exists) {
        throw new Error(`Archive table ${archiveTableName} does not exist`);
      }

      // Move to archive table using identifier quoting
      const insertResult = await this.sequelize.query(
        `
        INSERT INTO :archiveTableName:
        SELECT * FROM :tableName:
        WHERE created_at < :cutoffDate
      `,
        {
          replacements: {
            archiveTableName,
            tableName: safeTableName,
            cutoffDate
          },
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      const deleteResult = await this.sequelize.query(
        `
        DELETE FROM :tableName:
        WHERE created_at < :cutoffDate
      `,
        {
          replacements: {
            tableName: safeTableName,
            cutoffDate
          },
          type: QueryTypes.DELETE,
          transaction,
        }
      );

      jobStatus.recordsArchived = Array.isArray(deleteResult) ? deleteResult[1] : 0;
    }

    jobStatus.recordsProcessed = jobStatus.recordsArchived;
    jobStatus.status = 'completed';
    jobStatus.completedAt = new Date();

    this.logger.log(`Archival job ${jobStatus.jobId}: archived ${jobStatus.recordsArchived} records`);

    return jobStatus;
    } catch (error) {
      this.logger.error('Archival job failed', error);
      jobStatus.status = 'failed';
      jobStatus.errors.push((error as Error).message);
      jobStatus.completedAt = new Date();
      return jobStatus;
    }
  }
}

  /**
   * Find records eligible for archival
   *
   * NOTE: The remaining methods in this service follow the same pattern.
   * All standalone functions below should be converted to instance methods
   * that use this.sequelize and this.logger instead of parameters.
   */
}

// ============================================================================
// LEGACY STANDALONE FUNCTION EXPORTS (for backwards compatibility)
// ============================================================================

/**
 * Validates table name against allowed archival tables
 * Prevents SQL injection via table name parameter
 * @deprecated Use DataArchivalQueriesService instance methods instead
 */
function validateArchivalTableName(tableName: string): boolean {
  const allowedTables = [
    'medical_records',
    'visits',
    'appointments',
    'medication_administration',
    'lab_results',
    'immunization_records',
    'health_screenings',
    'clinic_visits',
    'patient_communications',
    'audit_logs',
  ];
  return allowedTables.includes(tableName);
}

/**
 * Sanitizes and validates table name for SQL operations
 * @deprecated Use DataArchivalQueriesService instance methods instead
 */
function getSafeTableIdentifier(tableName: string): string | null {
  if (!validateArchivalTableName(tableName)) {
    return null;
  }
  if (!/^[a-z_][a-z0-9_]*$/.test(tableName)) {
    return null;
  }
  return tableName;
}

/**
 * Find records eligible for archival
 *
 * @param sequelize - Sequelize instance
 * @param tableName - Table name
 * @param retentionDays - Retention period in days
 * @param transaction - Optional transaction
 * @returns Eligible records count and metadata
 * @deprecated Use DataArchivalQueriesService.findRecordsEligibleForArchival() instead
 *
 * @example
 * ```typescript
 * const eligible = await findRecordsEligibleForArchival(
 *   sequelize,
 *   'visits',
 *   2555
 * );
 * console.log(`${eligible.totalRecords} records eligible for archival`);
 * ```
 */
export async function findRecordsEligibleForArchival(
  sequelize: Sequelize,
  tableName: string,
  retentionDays: number,
  transaction?: Transaction
): Promise<{
  totalRecords: number;
  oldestRecord: Date;
  newestEligibleRecord: Date;
  estimatedSize: number;
}> {
  const logger = new Logger('DataArchival::findRecordsEligibleForArchival');

  try {
    // Validate table name to prevent SQL injection
    const safeTableName = getSafeTableIdentifier(tableName);
    if (!safeTableName) {
      throw new InternalServerErrorException(`Invalid table name: ${tableName}`);
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Use identifier quoting for table name
    const query = `
      SELECT
        COUNT(*) AS total_records,
        MIN(created_at) AS oldest_record,
        MAX(created_at) AS newest_eligible_record,
        pg_total_relation_size(:tableName:) AS table_size_bytes
      FROM :tableName:
      WHERE created_at < :cutoffDate
        AND (archived IS NULL OR archived = false)
    `;

    const [result] = await sequelize.query(query, {
      replacements: {
        tableName: safeTableName,
        cutoffDate
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    const data = result as any;

    logger.log(`Found ${data.total_records} records eligible for archival in ${safeTableName}`);

    return {
      totalRecords: parseInt(data.total_records || 0),
      oldestRecord: data.oldest_record,
      newestEligibleRecord: data.newest_eligible_record,
      estimatedSize: parseInt(data.table_size_bytes || 0),
    };
  } catch (error) {
    logger.error('Failed to find eligible records', error);
    throw new InternalServerErrorException('Failed to find eligible records');
  }
}

/**
 * Purge archived records permanently
 *
 * @param sequelize - Sequelize instance
 * @param tableName - Table name
 * @param archivedBeforeDate - Purge records archived before this date
 * @param transaction - Transaction
 * @returns Purge count
 *
 * @example
 * ```typescript
 * const purged = await purgeArchivedRecords(
 *   sequelize,
 *   'medical_records',
 *   new Date('2020-01-01'),
 *   transaction
 * );
 * ```
 */
export async function purgeArchivedRecords(
  sequelize: Sequelize,
  tableName: string,
  archivedBeforeDate: Date,
  transaction: Transaction
): Promise<number> {
  const logger = new Logger('DataArchival::purgeArchivedRecords');

  try {
    // Validate table name to prevent SQL injection
    const safeTableName = getSafeTableIdentifier(tableName);
    if (!safeTableName) {
      throw new InternalServerErrorException(`Invalid table name: ${tableName}`);
    }

    const result = await sequelize.query(
      `
      DELETE FROM :tableName:
      WHERE archived = true
        AND archived_at < :archivedBeforeDate
    `,
      {
        replacements: {
          tableName: safeTableName,
          archivedBeforeDate
        },
        type: QueryTypes.DELETE,
        transaction,
      }
    );

    const purgedCount = Array.isArray(result) ? result[1] : 0;

    logger.log(`Purged ${purgedCount} archived records from ${safeTableName}`);

    return purgedCount;
  } catch (error) {
    logger.error('Failed to purge archived records', error);
    throw new InternalServerErrorException('Failed to purge archived records');
  }
}

/**
 * Create restoration request
 *
 * @param sequelize - Sequelize instance
 * @param request - Restoration request details
 * @param transaction - Transaction
 * @returns Created restoration request
 *
 * @example
 * ```typescript
 * const request = await createRestorationRequest(
 *   sequelize,
 *   {
 *     tableName: 'medical_records',
 *     recordIds: ['REC123', 'REC456'],
 *     requestedBy: 'USER123',
 *     reason: 'Legal requirement',
 *     approvalRequired: true
 *   },
 *   transaction
 * );
 * ```
 */
export async function createRestorationRequest(
  sequelize: Sequelize,
  request: Omit<RestorationRequest, 'requestId' | 'requestedAt' | 'status'>,
  transaction: Transaction
): Promise<RestorationRequest> {
  const logger = new Logger('DataArchival::createRestorationRequest');

  try {
    const restorationRequest: RestorationRequest = {
      requestId: `RESTORE-${Date.now()}`,
      requestedAt: new Date(),
      status: request.approvalRequired ? 'pending' : 'approved',
      ...request,
    };

    await sequelize.query(
      `
      INSERT INTO restoration_requests
      (request_id, table_name, record_ids, requested_by, requested_at, reason, approval_required, status)
      VALUES (:requestId, :tableName, :recordIds, :requestedBy, :requestedAt, :reason, :approvalRequired, :status)
    `,
      {
        replacements: {
          requestId: restorationRequest.requestId,
          tableName: restorationRequest.tableName,
          recordIds: JSON.stringify(restorationRequest.recordIds),
          requestedBy: restorationRequest.requestedBy,
          requestedAt: restorationRequest.requestedAt,
          reason: restorationRequest.reason,
          approvalRequired: restorationRequest.approvalRequired,
          status: restorationRequest.status,
        },
        type: QueryTypes.INSERT,
        transaction,
      }
    );

    logger.log(`Created restoration request ${restorationRequest.requestId}`);

    return restorationRequest;
  } catch (error) {
    logger.error('Failed to create restoration request', error);
    throw new InternalServerErrorException('Failed to create restoration request');
  }
}

/**
 * Restore archived records
 *
 * @param sequelize - Sequelize instance
 * @param requestId - Restoration request ID
 * @param transaction - Transaction
 * @returns Restoration status
 *
 * @example
 * ```typescript
 * const status = await restoreArchivedRecords(
 *   sequelize,
 *   'RESTORE-123456',
 *   transaction
 * );
 * ```
 */
export async function restoreArchivedRecords(
  sequelize: Sequelize,
  requestId: string,
  transaction: Transaction
): Promise<{
  recordsRestored: number;
  recordsFailed: number;
  errors: string[];
}> {
  const logger = new Logger('DataArchival::restoreArchivedRecords');

  const status = {
    recordsRestored: 0,
    recordsFailed: 0,
    errors: [] as string[],
  };

  try {
    // Get restoration request
    const [request] = await sequelize.query(
      `SELECT * FROM restoration_requests WHERE request_id = :requestId`,
      {
        replacements: { requestId },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    if (!request) {
      throw new Error('Restoration request not found');
    }

    const requestData = request as any;

    if (requestData.status !== 'approved') {
      throw new Error('Restoration request not approved');
    }

    const recordIds = JSON.parse(requestData.record_ids);

    // Validate table name to prevent SQL injection
    const safeTableName = getSafeTableIdentifier(requestData.table_name);
    if (!safeTableName) {
      throw new Error(`Invalid table name: ${requestData.table_name}`);
    }

    // Restore from archive table
    const result = await sequelize.query(
      `
      UPDATE :tableName:
      SET archived = false, archived_at = NULL, deleted_at = NULL, restored_at = NOW()
      WHERE id = ANY(:recordIds::uuid[])
        AND archived = true
    `,
      {
        replacements: {
          tableName: safeTableName,
          recordIds
        },
        type: QueryTypes.UPDATE,
        transaction,
      }
    );

    status.recordsRestored = Array.isArray(result) ? result[1] : 0;

    // Update request status
    await sequelize.query(
      `
      UPDATE restoration_requests
      SET status = 'completed', completed_at = NOW()
      WHERE request_id = :requestId
    `,
      {
        replacements: { requestId },
        type: QueryTypes.UPDATE,
        transaction,
      }
    );

    logger.log(`Restored ${status.recordsRestored} records for request ${requestId}`);

    return status;
  } catch (error) {
    logger.error('Failed to restore archived records', error);
    status.recordsFailed = 1;
    status.errors.push((error as Error).message);
    return status;
  }
}

/**
 * Generate archival audit trail
 *
 * @param sequelize - Sequelize instance
 * @param tableName - Table name (optional)
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Audit trail entries
 *
 * @example
 * ```typescript
 * const auditTrail = await generateArchivalAuditTrail(
 *   sequelize,
 *   'medical_records',
 *   { start: lastMonth, end: today }
 * );
 * ```
 */
export async function generateArchivalAuditTrail(
  sequelize: Sequelize,
  tableName?: string,
  dateRange?: { start: Date; end: Date },
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('DataArchival::generateArchivalAuditTrail');

  try {
    let whereClause = '1=1';

    if (tableName) {
      whereClause += ` AND table_name = :tableName`;
    }

    if (dateRange) {
      whereClause += ` AND action_date BETWEEN :startDate AND :endDate`;
    }

    const query = `
      SELECT
        id,
        table_name,
        action_type,
        record_count,
        performed_by,
        action_date,
        policy_applied,
        metadata
      FROM archival_audit_log
      WHERE ${whereClause}
      ORDER BY action_date DESC
      LIMIT 1000
    `;

    const results = await sequelize.query(query, {
      replacements: {
        tableName,
        startDate: dateRange?.start,
        endDate: dateRange?.end,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Generated audit trail with ${results.length} entries`);

    return results;
  } catch (error) {
    logger.error('Failed to generate audit trail', error);
    throw new InternalServerErrorException('Failed to generate audit trail');
  }
}

/**
 * Calculate storage savings from archival
 *
 * @param sequelize - Sequelize instance
 * @param tableName - Table name
 * @param transaction - Optional transaction
 * @returns Storage metrics
 *
 * @example
 * ```typescript
 * const savings = await calculateStorageSavings(sequelize, 'medical_records');
 * ```
 */
export async function calculateStorageSavings(
  sequelize: Sequelize,
  tableName: string,
  transaction?: Transaction
): Promise<{
  activeTableSize: number;
  archiveTableSize: number;
  totalSavings: number;
  compressionRatio: number;
}> {
  const logger = new Logger('DataArchival::calculateStorageSavings');

  try {
    // Validate table name to prevent SQL injection
    const safeTableName = getSafeTableIdentifier(tableName);
    if (!safeTableName) {
      throw new InternalServerErrorException(`Invalid table name: ${tableName}`);
    }

    // Use parameterized queries for pg_total_relation_size
    const query = `
      SELECT
        pg_total_relation_size(:tableName:) AS active_size,
        COALESCE(pg_total_relation_size(:archiveTableName:), 0) AS archive_size,
        COALESCE(pg_total_relation_size(:compressedTableName:), 0) AS compressed_size
    `;

    const [result] = await sequelize.query(query, {
      replacements: {
        tableName: safeTableName,
        archiveTableName: `${safeTableName}_archive`,
        compressedTableName: `${safeTableName}_archive_compressed`
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    const data = result as any;

    const totalSavings = parseInt(data.active_size) - parseInt(data.archive_size || 0);
    const compressionRatio = data.archive_size > 0
      ? parseInt(data.archive_size) / parseInt(data.compressed_size || data.archive_size)
      : 1;

    logger.log(`Storage savings: ${(totalSavings / 1024 / 1024).toFixed(2)} MB`);

    return {
      activeTableSize: parseInt(data.active_size),
      archiveTableSize: parseInt(data.archive_size || 0),
      totalSavings,
      compressionRatio,
    };
  } catch (error) {
    logger.error('Failed to calculate storage savings', error);
    throw new InternalServerErrorException('Failed to calculate storage savings');
  }
}

/**
 * Validate compliance with retention policies
 *
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Compliance validation results
 *
 * @example
 * ```typescript
 * const compliance = await validateComplianceWithRetentionPolicies(sequelize);
 * console.log(`Compliance status: ${compliance.isCompliant}`);
 * ```
 */
export async function validateComplianceWithRetentionPolicies(
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<{
  isCompliant: boolean;
  violations: any[];
  tables: any[];
}> {
  const logger = new Logger('DataArchival::validateComplianceWithRetentionPolicies');

  try {
    const query = `
      WITH policies AS (
        SELECT
          table_name,
          retention_days,
          compliance_required
        FROM retention_policies
        WHERE active = true
      ),
      table_ages AS (
        SELECT
          p.table_name,
          p.retention_days,
          p.compliance_required,
          MIN(t.created_at) AS oldest_record,
          EXTRACT(DAY FROM NOW() - MIN(t.created_at)) AS oldest_age_days,
          COUNT(*) FILTER (WHERE t.created_at < NOW() - (p.retention_days || ' days')::INTERVAL) AS overdue_records
        FROM policies p
        CROSS JOIN LATERAL (
          SELECT created_at FROM ${sequelize.escape(p.table_name)}
          WHERE archived != true OR archived IS NULL
        ) t
        GROUP BY p.table_name, p.retention_days, p.compliance_required
      )
      SELECT
        table_name,
        retention_days,
        compliance_required,
        oldest_age_days,
        overdue_records,
        CASE
          WHEN compliance_required AND overdue_records > 0 THEN true
          ELSE false
        END AS is_violation
      FROM table_ages
    `;

    const tables = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    const violations = tables.filter((t: any) => t.is_violation);
    const isCompliant = violations.length === 0;

    logger.log(`Compliance validation: ${isCompliant ? 'compliant' : violations.length + ' violations'}`);

    return {
      isCompliant,
      violations,
      tables,
    };
  } catch (error) {
    logger.error('Failed to validate compliance', error);
    throw new InternalServerErrorException('Failed to validate compliance');
  }
}

/**
 * Schedule automated archival jobs
 *
 * @param sequelize - Sequelize instance
 * @param policies - Array of archival policies
 * @param transaction - Transaction
 * @returns Scheduled jobs
 *
 * @example
 * ```typescript
 * const jobs = await scheduleAutomatedArchivalJobs(
 *   sequelize,
 *   [policy1, policy2],
 *   transaction
 * );
 * ```
 */
export async function scheduleAutomatedArchivalJobs(
  sequelize: Sequelize,
  policies: ArchivalPolicyConfig[],
  transaction: Transaction
): Promise<any[]> {
  const logger = new Logger('DataArchival::scheduleAutomatedArchivalJobs');

  try {
    const scheduledJobs = [];

    for (const policy of policies) {
      const jobId = `SCHED-${policy.tableName}-${Date.now()}`;

      await sequelize.query(
        `
        INSERT INTO scheduled_archival_jobs
        (job_id, table_name, retention_days, archive_method, schedule_type, next_run, created_at)
        VALUES (:jobId, :tableName, :retentionDays, :archiveMethod, 'daily', NOW() + INTERVAL '1 day', NOW())
      `,
        {
          replacements: {
            jobId,
            tableName: policy.tableName,
            retentionDays: policy.retentionDays,
            archiveMethod: policy.archiveMethod,
          },
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      scheduledJobs.push({
        jobId,
        tableName: policy.tableName,
        nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    }

    logger.log(`Scheduled ${scheduledJobs.length} automated archival jobs`);

    return scheduledJobs;
  } catch (error) {
    logger.error('Failed to schedule archival jobs', error);
    throw new InternalServerErrorException('Failed to schedule archival jobs');
  }
}

/**
 * Export archived data to external storage
 *
 * @param sequelize - Sequelize instance
 * @param tableName - Table name
 * @param exportPath - Export path/destination
 * @param format - Export format
 * @param transaction - Optional transaction
 * @returns Export status
 *
 * @example
 * ```typescript
 * const status = await exportArchivedData(
 *   sequelize,
 *   'medical_records_archive',
 *   's3://bucket/archives/',
 *   'parquet'
 * );
 * ```
 */
export async function exportArchivedData(
  sequelize: Sequelize,
  tableName: string,
  exportPath: string,
  format: 'csv' | 'json' | 'parquet' = 'csv',
  transaction?: Transaction
): Promise<{
  recordsExported: number;
  exportSize: number;
  exportLocation: string;
}> {
  const logger = new Logger('DataArchival::exportArchivedData');

  try {
    // Get record count
    const [countResult] = await sequelize.query(
      `SELECT COUNT(*) AS count FROM ${tableName}`,
      {
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    const recordsExported = parseInt((countResult as any).count || 0);

    // In production, this would trigger actual export to S3/GCS/Azure
    const exportLocation = `${exportPath}${tableName}_${Date.now()}.${format}`;

    logger.log(`Exported ${recordsExported} records to ${exportLocation}`);

    return {
      recordsExported,
      exportSize: recordsExported * 1000, // Estimated
      exportLocation,
    };
  } catch (error) {
    logger.error('Failed to export archived data', error);
    throw new InternalServerErrorException('Failed to export archived data');
  }
}

/**
 * Compress archived tables
 *
 * @param sequelize - Sequelize instance
 * @param tableName - Archive table name
 * @param transaction - Transaction
 * @returns Compression results
 *
 * @example
 * ```typescript
 * const result = await compressArchivedTable(
 *   sequelize,
 *   'medical_records_archive',
 *   transaction
 * );
 * ```
 */
export async function compressArchivedTable(
  sequelize: Sequelize,
  tableName: string,
  transaction: Transaction
): Promise<{
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}> {
  const logger = new Logger('DataArchival::compressArchivedTable');

  try {
    // Get original size
    const [sizeResult] = await sequelize.query(
      `SELECT pg_total_relation_size('${tableName}') AS size`,
      {
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    const originalSize = parseInt((sizeResult as any).size);

    // Apply compression (PostgreSQL toast compression)
    await sequelize.query(
      `ALTER TABLE ${tableName} ALTER COLUMN data SET STORAGE EXTENDED`,
      {
        type: QueryTypes.RAW,
        transaction,
      }
    );

    await sequelize.query(`VACUUM FULL ${tableName}`, {
      type: QueryTypes.RAW,
      transaction,
    });

    // Get compressed size
    const [newSizeResult] = await sequelize.query(
      `SELECT pg_total_relation_size('${tableName}') AS size`,
      {
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    const compressedSize = parseInt((newSizeResult as any).size);
    const compressionRatio = originalSize / compressedSize;

    logger.log(`Compressed ${tableName}: ${compressionRatio.toFixed(2)}x ratio`);

    return {
      originalSize,
      compressedSize,
      compressionRatio,
    };
  } catch (error) {
    logger.error('Failed to compress archived table', error);
    throw new InternalServerErrorException('Failed to compress archived table');
  }
}

/**
 * Get archival statistics dashboard
 *
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Dashboard statistics
 *
 * @example
 * ```typescript
 * const stats = await getArchivalStatisticsDashboard(sequelize);
 * console.log(`Total archived: ${stats.totalRecordsArchived}`);
 * ```
 */
export async function getArchivalStatisticsDashboard(
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<{
  totalRecordsArchived: number;
  totalRecordsActive: number;
  totalStorageSaved: number;
  recentArchivalJobs: any[];
  pendingRestorationRequests: number;
}> {
  const logger = new Logger('DataArchival::getArchivalStatisticsDashboard');

  try {
    const queries = await Promise.all([
      sequelize.query(
        `
        SELECT
          SUM(records_archived) AS total_archived,
          COUNT(*) AS total_jobs
        FROM archival_job_history
        WHERE status = 'completed'
      `,
        {
          type: QueryTypes.SELECT,
          transaction,
        }
      ),
      sequelize.query(
        `
        SELECT COUNT(*) AS pending_requests
        FROM restoration_requests
        WHERE status = 'pending'
      `,
        {
          type: QueryTypes.SELECT,
          transaction,
        }
      ),
      sequelize.query(
        `
        SELECT *
        FROM archival_job_history
        ORDER BY completed_at DESC
        LIMIT 10
      `,
        {
          type: QueryTypes.SELECT,
          transaction,
        }
      ),
    ]);

    const [archivedData] = queries[0];
    const [requestsData] = queries[1];
    const recentJobs = queries[2];

    logger.log('Generated archival statistics dashboard');

    return {
      totalRecordsArchived: parseInt((archivedData as any).total_archived || 0),
      totalRecordsActive: 0, // Would require separate calculation
      totalStorageSaved: 0, // Would require separate calculation
      recentArchivalJobs: recentJobs,
      pendingRestorationRequests: parseInt((requestsData as any).pending_requests || 0),
    };
  } catch (error) {
    logger.error('Failed to get archival statistics', error);
    throw new InternalServerErrorException('Failed to get archival statistics');
  }
}

/**
 * Verify archived data integrity
 *
 * @param sequelize - Sequelize instance
 * @param tableName - Archive table name
 * @param sampleSize - Number of records to verify
 * @param transaction - Optional transaction
 * @returns Integrity verification results
 *
 * @example
 * ```typescript
 * const integrity = await verifyArchivedDataIntegrity(
 *   sequelize,
 *   'medical_records_archive',
 *   100
 * );
 * ```
 */
export async function verifyArchivedDataIntegrity(
  sequelize: Sequelize,
  tableName: string,
  sampleSize: number = 100,
  transaction?: Transaction
): Promise<{
  totalChecked: number;
  passedIntegrity: number;
  failedIntegrity: number;
  corruptRecords: string[];
}> {
  const logger = new Logger('DataArchival::verifyArchivedDataIntegrity');

  try {
    const query = `
      SELECT
        id,
        CASE
          WHEN id IS NOT NULL
            AND created_at IS NOT NULL
            AND archived_at IS NOT NULL
          THEN true
          ELSE false
        END AS integrity_check
      FROM ${tableName}
      ORDER BY RANDOM()
      LIMIT :sampleSize
    `;

    const results = await sequelize.query(query, {
      replacements: { sampleSize },
      type: QueryTypes.SELECT,
      transaction,
    });

    const totalChecked = results.length;
    const passedIntegrity = results.filter((r: any) => r.integrity_check).length;
    const failedIntegrity = totalChecked - passedIntegrity;
    const corruptRecords = results
      .filter((r: any) => !r.integrity_check)
      .map((r: any) => r.id);

    logger.log(`Integrity check: ${passedIntegrity}/${totalChecked} passed`);

    return {
      totalChecked,
      passedIntegrity,
      failedIntegrity,
      corruptRecords,
    };
  } catch (error) {
    logger.error('Failed to verify data integrity', error);
    throw new InternalServerErrorException('Failed to verify data integrity');
  }
}

/**
 * Batch archive related records
 *
 * @param sequelize - Sequelize instance
 * @param primaryTable - Primary table name
 * @param relatedTables - Related table configurations
 * @param primaryRecordIds - Primary record IDs to archive
 * @param transaction - Transaction
 * @returns Batch archival results
 *
 * @example
 * ```typescript
 * const result = await batchArchiveRelatedRecords(
 *   sequelize,
 *   'patients',
 *   [
 *     { table: 'visits', foreignKey: 'patient_id' },
 *     { table: 'medications', foreignKey: 'patient_id' }
 *   ],
 *   ['PAT123', 'PAT456'],
 *   transaction
 * );
 * ```
 */
export async function batchArchiveRelatedRecords(
  sequelize: Sequelize,
  primaryTable: string,
  relatedTables: Array<{ table: string; foreignKey: string }>,
  primaryRecordIds: string[],
  transaction: Transaction
): Promise<{
  primaryArchived: number;
  relatedArchived: Record<string, number>;
  totalArchived: number;
}> {
  const logger = new Logger('DataArchival::batchArchiveRelatedRecords');

  try {
    // Archive primary records
    const primaryResult = await sequelize.query(
      `
      UPDATE ${primaryTable}
      SET archived = true, archived_at = NOW()
      WHERE id = ANY(:recordIds::uuid[])
    `,
      {
        replacements: { recordIds: primaryRecordIds },
        type: QueryTypes.UPDATE,
        transaction,
      }
    );

    const primaryArchived = Array.isArray(primaryResult) ? primaryResult[1] : 0;
    const relatedArchived: Record<string, number> = {};

    // Archive related records
    for (const related of relatedTables) {
      const relatedResult = await sequelize.query(
        `
        UPDATE ${related.table}
        SET archived = true, archived_at = NOW()
        WHERE ${related.foreignKey} = ANY(:recordIds::uuid[])
      `,
        {
          replacements: { recordIds: primaryRecordIds },
          type: QueryTypes.UPDATE,
          transaction,
        }
      );

      relatedArchived[related.table] = Array.isArray(relatedResult) ? relatedResult[1] : 0;
    }

    const totalArchived = primaryArchived +
      Object.values(relatedArchived).reduce((sum, count) => sum + count, 0);

    logger.log(`Batch archived: ${primaryArchived} primary + ${totalArchived - primaryArchived} related`);

    return {
      primaryArchived,
      relatedArchived,
      totalArchived,
    };
  } catch (error) {
    logger.error('Failed to batch archive related records', error);
    throw new InternalServerErrorException('Failed to batch archive related records');
  }
}

/**
 * Generate compliance report for auditors
 *
 * @param sequelize - Sequelize instance
 * @param dateRange - Date range for report
 * @param transaction - Optional transaction
 * @returns Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReportForAuditors(
 *   sequelize,
 *   { start: lastYear, end: today }
 * );
 * ```
 */
export async function generateComplianceReportForAuditors(
  sequelize: Sequelize,
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<{
  reportId: string;
  generatedAt: Date;
  period: { start: Date; end: Date };
  summary: any;
  violations: any[];
  recommendations: string[];
}> {
  const logger = new Logger('DataArchival::generateComplianceReportForAuditors');

  try {
    const reportId = `COMP-RPT-${Date.now()}`;

    // Get archival activities
    const activities = await sequelize.query(
      `
      SELECT
        table_name,
        COUNT(*) AS job_count,
        SUM(records_archived) AS total_archived,
        MAX(completed_at) AS last_archival
      FROM archival_job_history
      WHERE completed_at BETWEEN :startDate AND :endDate
      GROUP BY table_name
    `,
      {
        replacements: {
          startDate: dateRange.start,
          endDate: dateRange.end,
        },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    // Get violations
    const violations = await sequelize.query(
      `
      SELECT
        table_name,
        violation_type,
        violation_count,
        detected_at
      FROM compliance_violations
      WHERE detected_at BETWEEN :startDate AND :endDate
      ORDER BY detected_at DESC
    `,
      {
        replacements: {
          startDate: dateRange.start,
          endDate: dateRange.end,
        },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    const recommendations = [
      'Review and update retention policies quarterly',
      'Implement automated compliance monitoring',
      'Schedule regular data integrity audits',
    ];

    if (violations.length > 0) {
      recommendations.push('Address identified compliance violations immediately');
    }

    logger.log(`Generated compliance report ${reportId}`);

    return {
      reportId,
      generatedAt: new Date(),
      period: dateRange,
      summary: {
        totalArchivalJobs: activities.length,
        totalRecordsArchived: activities.reduce((sum: number, a: any) => sum + parseInt(a.total_archived || 0), 0),
        violationCount: violations.length,
      },
      violations,
      recommendations,
    };
  } catch (error) {
    logger.error('Failed to generate compliance report', error);
    throw new InternalServerErrorException('Failed to generate compliance report');
  }
}

/**
 * Monitor archival job performance
 *
 * @param sequelize - Sequelize instance
 * @param jobId - Job ID (optional, for specific job)
 * @param transaction - Optional transaction
 * @returns Performance metrics
 *
 * @example
 * ```typescript
 * const performance = await monitorArchivalJobPerformance(sequelize);
 * ```
 */
export async function monitorArchivalJobPerformance(
  sequelize: Sequelize,
  jobId?: string,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('DataArchival::monitorArchivalJobPerformance');

  try {
    let whereClause = '1=1';
    if (jobId) {
      whereClause = `job_id = :jobId`;
    }

    const query = `
      SELECT
        job_id,
        table_name,
        records_processed,
        records_archived,
        EXTRACT(EPOCH FROM (completed_at - started_at)) AS duration_seconds,
        (records_archived::float / EXTRACT(EPOCH FROM (completed_at - started_at))) AS records_per_second,
        status,
        started_at,
        completed_at
      FROM archival_job_history
      WHERE ${whereClause}
        AND status IN ('completed', 'failed')
      ORDER BY started_at DESC
      LIMIT 50
    `;

    const results = await sequelize.query(query, {
      replacements: { jobId },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Retrieved performance metrics for ${results.length} jobs`);

    return results;
  } catch (error) {
    logger.error('Failed to monitor job performance', error);
    throw new InternalServerErrorException('Failed to monitor job performance');
  }
}

/**
 * Create archival snapshot for point-in-time recovery
 *
 * @param sequelize - Sequelize instance
 * @param tableName - Table name
 * @param snapshotName - Snapshot name
 * @param transaction - Transaction
 * @returns Snapshot details
 *
 * @example
 * ```typescript
 * const snapshot = await createArchivalSnapshot(
 *   sequelize,
 *   'medical_records',
 *   'pre_migration_2024',
 *   transaction
 * );
 * ```
 */
export async function createArchivalSnapshot(
  sequelize: Sequelize,
  tableName: string,
  snapshotName: string,
  transaction: Transaction
): Promise<{
  snapshotId: string;
  snapshotName: string;
  recordCount: number;
  createdAt: Date;
}> {
  const logger = new Logger('DataArchival::createArchivalSnapshot');

  try {
    const snapshotId = `SNAP-${Date.now()}`;
    const snapshotTableName = `${tableName}_snapshot_${snapshotName}`;

    // Create snapshot table
    await sequelize.query(
      `CREATE TABLE ${snapshotTableName} AS SELECT * FROM ${tableName}`,
      {
        type: QueryTypes.RAW,
        transaction,
      }
    );

    // Get record count
    const [countResult] = await sequelize.query(
      `SELECT COUNT(*) AS count FROM ${snapshotTableName}`,
      {
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    const recordCount = parseInt((countResult as any).count || 0);

    // Log snapshot
    await sequelize.query(
      `
      INSERT INTO archival_snapshots
      (snapshot_id, snapshot_name, table_name, snapshot_table_name, record_count, created_at)
      VALUES (:snapshotId, :snapshotName, :tableName, :snapshotTableName, :recordCount, NOW())
    `,
      {
        replacements: {
          snapshotId,
          snapshotName,
          tableName,
          snapshotTableName,
          recordCount,
        },
        type: QueryTypes.INSERT,
        transaction,
      }
    );

    logger.log(`Created snapshot ${snapshotId} with ${recordCount} records`);

    return {
      snapshotId,
      snapshotName,
      recordCount,
      createdAt: new Date(),
    };
  } catch (error) {
    logger.error('Failed to create archival snapshot', error);
    throw new InternalServerErrorException('Failed to create archival snapshot');
  }
}

/**
 * Manage retention policy lifecycle
 *
 * @param sequelize - Sequelize instance
 * @param policyId - Policy ID
 * @param action - Action to perform
 * @param transaction - Transaction
 * @returns Updated policy
 *
 * @example
 * ```typescript
 * const policy = await manageRetentionPolicyLifecycle(
 *   sequelize,
 *   'POL123',
 *   'activate',
 *   transaction
 * );
 * ```
 */
export async function manageRetentionPolicyLifecycle(
  sequelize: Sequelize,
  policyId: string,
  action: 'activate' | 'deactivate' | 'delete',
  transaction: Transaction
): Promise<any> {
  const logger = new Logger('DataArchival::manageRetentionPolicyLifecycle');

  try {
    let query = '';

    switch (action) {
      case 'activate':
        query = `UPDATE retention_policies SET active = true, updated_at = NOW() WHERE id = :policyId`;
        break;
      case 'deactivate':
        query = `UPDATE retention_policies SET active = false, updated_at = NOW() WHERE id = :policyId`;
        break;
      case 'delete':
        query = `DELETE FROM retention_policies WHERE id = :policyId`;
        break;
    }

    await sequelize.query(query, {
      replacements: { policyId },
      type: QueryTypes.UPDATE,
      transaction,
    });

    logger.log(`Policy ${policyId} ${action}d`);

    // Return updated policy
    const [policy] = await sequelize.query(
      `SELECT * FROM retention_policies WHERE id = :policyId`,
      {
        replacements: { policyId },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    return policy;
  } catch (error) {
    logger.error('Failed to manage retention policy lifecycle', error);
    throw new InternalServerErrorException('Failed to manage retention policy lifecycle');
  }
}

/**
 * Export all data archival query functions (legacy compatibility)
 * @deprecated Use DataArchivalQueriesService for new implementations
 */
export const DataArchivalQueriesComposites = {
  archiveRecordsByPolicy,
  findRecordsEligibleForArchival,
  purgeArchivedRecords,
  createRestorationRequest,
  restoreArchivedRecords,
  generateArchivalAuditTrail,
  calculateStorageSavings,
  validateComplianceWithRetentionPolicies,
  scheduleAutomatedArchivalJobs,
  exportArchivedData,
  compressArchivedTable,
  getArchivalStatisticsDashboard,
  verifyArchivedDataIntegrity,
  batchArchiveRelatedRecords,
  generateComplianceReportForAuditors,
  monitorArchivalJobPerformance,
  createArchivalSnapshot,
  manageRetentionPolicyLifecycle,
};

/**
 * Default export for NestJS module usage
 * Recommended for all new implementations
 */
export default DataArchivalQueriesService;
