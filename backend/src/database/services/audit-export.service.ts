/**
 * Audit Export Service
 * Handles exporting audit logs to various formats (CSV, JSON)
 */

import { Injectable, Logger } from '@nestjs/common';
import { AuditLog } from '../models/audit-log.model';
import { AuditQueryService, AuditLogFilters } from './audit-query.service';

/**
 * Audit Export Service
 *
 * Provides export functionality:
 * - CSV export with configurable detail level
 * - JSON export with configurable detail level
 * - Large dataset handling (up to 10,000 records)
 */
@Injectable()
export class AuditExportService {
  private readonly logger = new Logger(AuditExportService.name);

  constructor(
    private readonly auditQuery: AuditQueryService,
  ) {}

  /**
   * Export audit logs to CSV format
   *
   * @param filters - Filters to apply to audit logs
   * @param includeFullDetails - Whether to include all fields or summary only
   * @returns CSV string representation of audit logs
   */
  async exportToCSV(
    filters: AuditLogFilters = {},
    includeFullDetails: boolean = false,
  ): Promise<string> {
    try {
      const result = await this.auditQuery.queryAuditLogs(filters, { limit: 10000 });
      const logs = result.logs;

      if (logs.length === 0) {
        return 'No audit logs found matching the filters';
      }

      // CSV headers
      const headers = includeFullDetails
        ? [
            'ID',
            'Timestamp',
            'Action',
            'Entity Type',
            'Entity ID',
            'User ID',
            'User Name',
            'IP Address',
            'Is PHI',
            'Compliance Type',
            'Severity',
            'Success',
            'Error Message',
            'Changes',
          ]
        : [
            'ID',
            'Timestamp',
            'Action',
            'Entity Type',
            'Entity ID',
            'User Name',
            'Is PHI',
            'Compliance Type',
            'Success',
          ];

      let csv = headers.join(',') + '\n';

      // CSV rows
      for (const log of logs) {
        const row = includeFullDetails
          ? [
              log.id,
              log.createdAt!.toISOString(),
              log.action,
              log.entityType,
              log.entityId || '',
              log.userId || '',
              log.userName || '',
              log.ipAddress || '',
              log.isPHI,
              log.complianceType,
              log.severity,
              log.success,
              log.errorMessage
                ? `"${log.errorMessage.replace(/"/g, '""')}"`
                : '',
              log.changes
                ? `"${JSON.stringify(log.changes).replace(/"/g, '""')}"`
                : '',
            ]
          : [
              log.id,
              log.createdAt!.toISOString(),
              log.action,
              log.entityType,
              log.entityId || '',
              log.userName || '',
              log.isPHI,
              log.complianceType,
              log.success,
            ];

        csv += row.join(',') + '\n';
      }

      return csv;
    } catch (error) {
      this.logger.error(
        `Failed to export audit logs to CSV: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Export audit logs to JSON format
   *
   * @param filters - Filters to apply to audit logs
   * @param includeFullDetails - Whether to include all fields or summary only
   * @returns JSON string representation of audit logs
   */
  async exportToJSON(
    filters: AuditLogFilters = {},
    includeFullDetails: boolean = false,
  ): Promise<string> {
    try {
      const result = await this.auditQuery.queryAuditLogs(filters, { limit: 10000 });
      const logs = result.logs.map((log) =>
        log.toExportObject(includeFullDetails),
      );

      return JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          total: logs.length,
          filters,
          logs,
        },
        null,
        2,
      );
    } catch (error) {
      this.logger.error(
        `Failed to export audit logs to JSON: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
