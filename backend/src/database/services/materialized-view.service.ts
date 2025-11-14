import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize, QueryTypes } from 'sequelize-typescript';
import { Cron, CronExpression } from '@nestjs/schedule';

import { BaseService } from '../../common/base';
/**
 * Materialized View Service
 *
 * Manages refresh operations for materialized views created in the database.
 * Provides both on-demand and scheduled refresh capabilities with monitoring
 * and logging.
 *
 * Materialized Views:
 * - mv_student_health_summary: Student health dashboard data
 * - mv_compliance_status: Vaccination and screening compliance
 * - mv_medication_schedule: Active medication administration schedule
 * - mv_allergy_summary: Allergy alerts and EpiPen tracking
 * - mv_appointment_statistics: Appointment analytics
 *
 * Refresh Strategy:
 * - CONCURRENTLY: Allows queries during refresh (requires unique index)
 * - Non-blocking: Application continues to serve stale data during refresh
 * - Error handling: Logs failures without interrupting service
 *
 * Usage:
 * ```typescript
 * // On-demand refresh
 * await materializedViewService.refreshStudentHealthSummary();
 *
 * // Refresh all views
 * await materializedViewService.refreshAll();
 *
 * // Get last refresh timestamp
 * const timestamp = await materializedViewService.getLastRefreshTime('mv_student_health_summary');
 * ```
 *
 * Scheduled Refresh (via NestJS @Cron):
 * - Dashboard views: Every hour (top of the hour)
 * - Compliance views: Every 6 hours
 * - Statistics views: Daily at 2 AM
 *
 * Migration: 20251107000003-create-materialized-views.js
 * Task Tracking: .temp/task-status-DB6C9F.json
 */
@Injectable()
export class MaterializedViewService extends BaseService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {
    super("MaterializedViewService");
  }

  /**
   * Refresh student health summary materialized view
   * Contains: health records, allergies, medications, conditions, vaccinations
   * Refresh frequency: Hourly (dashboard critical)
   */
  async refreshStudentHealthSummary(): Promise<void> {
    const startTime = Date.now();
    try {
      this.logInfo('Refreshing mv_student_health_summary...');

      await this.sequelize.query(
        'REFRESH MATERIALIZED VIEW CONCURRENTLY "mv_student_health_summary";',
      );

      const duration = Date.now() - startTime;
      this.logInfo(
        `mv_student_health_summary refreshed successfully in ${duration}ms`,
      );
    } catch (error) {
      this.logError(
        `Failed to refresh mv_student_health_summary: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Refresh compliance status materialized view
   * Contains: vaccination compliance, screening compliance, overdue items
   * Refresh frequency: Every 6 hours (compliance tracking)
   */
  async refreshComplianceStatus(): Promise<void> {
    const startTime = Date.now();
    try {
      this.logInfo('Refreshing mv_compliance_status...');

      await this.sequelize.query(
        'REFRESH MATERIALIZED VIEW CONCURRENTLY "mv_compliance_status";',
      );

      const duration = Date.now() - startTime;
      this.logInfo(
        `mv_compliance_status refreshed successfully in ${duration}ms`,
      );
    } catch (error) {
      this.logError(
        `Failed to refresh mv_compliance_status: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Refresh medication schedule materialized view
   * Contains: active medications, scheduled times, administration tracking
   * Refresh frequency: Hourly (medication administration critical)
   */
  async refreshMedicationSchedule(): Promise<void> {
    const startTime = Date.now();
    try {
      this.logInfo('Refreshing mv_medication_schedule...');

      await this.sequelize.query(
        'REFRESH MATERIALIZED VIEW CONCURRENTLY "mv_medication_schedule";',
      );

      const duration = Date.now() - startTime;
      this.logInfo(
        `mv_medication_schedule refreshed successfully in ${duration}ms`,
      );
    } catch (error) {
      this.logError(
        `Failed to refresh mv_medication_schedule: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Refresh allergy summary materialized view
   * Contains: active allergies, severity levels, EpiPen locations
   * Refresh frequency: Hourly (safety critical)
   */
  async refreshAllergySummary(): Promise<void> {
    const startTime = Date.now();
    try {
      this.logInfo('Refreshing mv_allergy_summary...');

      await this.sequelize.query(
        'REFRESH MATERIALIZED VIEW CONCURRENTLY "mv_allergy_summary";',
      );

      const duration = Date.now() - startTime;
      this.logInfo(
        `mv_allergy_summary refreshed successfully in ${duration}ms`,
      );
    } catch (error) {
      this.logError(
        `Failed to refresh mv_allergy_summary: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Refresh appointment statistics materialized view
   * Contains: appointment counts, completion rates, duration stats
   * Refresh frequency: Daily (reporting/analytics)
   */
  async refreshAppointmentStatistics(): Promise<void> {
    const startTime = Date.now();
    try {
      this.logInfo('Refreshing mv_appointment_statistics...');

      await this.sequelize.query(
        'REFRESH MATERIALIZED VIEW CONCURRENTLY "mv_appointment_statistics";',
      );

      const duration = Date.now() - startTime;
      this.logInfo(
        `mv_appointment_statistics refreshed successfully in ${duration}ms`,
      );
    } catch (error) {
      this.logError(
        `Failed to refresh mv_appointment_statistics: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Refresh all materialized views
   * Used for: Manual refresh, system maintenance, after bulk data imports
   */
  async refreshAll(): Promise<{
    success: string[];
    failed: string[];
    totalDuration: number;
  }> {
    const startTime = Date.now();
    const results = {
      success: [] as string[],
      failed: [] as string[],
      totalDuration: 0,
    };

    this.logInfo('Starting refresh of all materialized views...');

    const refreshOperations = [
      { name: 'student_health_summary', fn: () => this.refreshStudentHealthSummary() },
      { name: 'compliance_status', fn: () => this.refreshComplianceStatus() },
      { name: 'medication_schedule', fn: () => this.refreshMedicationSchedule() },
      { name: 'allergy_summary', fn: () => this.refreshAllergySummary() },
      { name: 'appointment_statistics', fn: () => this.refreshAppointmentStatistics() },
    ];

    for (const operation of refreshOperations) {
      try {
        await operation.fn();
        results.success.push(operation.name);
      } catch (error) {
        this.logError(
          `Failed to refresh ${operation.name}: ${error.message}`,
        );
        results.failed.push(operation.name);
      }
    }

    results.totalDuration = Date.now() - startTime;

    this.logInfo(
      `Materialized view refresh complete: ${results.success.length} succeeded, ${results.failed.length} failed, ${results.totalDuration}ms total`,
    );

    return results;
  }

  /**
   * Get last refresh time for a materialized view
   * Useful for monitoring and displaying data freshness
   */
  async getLastRefreshTime(viewName: string): Promise<Date | null> {
    try {
      const result = await this.sequelize.query<{ last_refresh: Date }>(
        `
        SELECT pg_stat_get_last_vacuum_time(oid) AS last_refresh
        FROM pg_class
        WHERE relname = :viewName;
        `,
        {
          replacements: { viewName },
          type: Sequelize.QueryTypes.SELECT,
        },
      );

      return result[0]?.last_refresh || null;
    } catch (error) {
      this.logError(
        `Failed to get last refresh time for ${viewName}: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * Get materialized view statistics
   * Returns: size, row count, last refresh time
   */
  async getViewStatistics(viewName: string): Promise<{
    viewName: string;
    sizeBytes: number;
    sizePretty: string;
    rowCount: number;
    lastRefresh: Date | null;
  } | null> {
    try {
      const result = await this.sequelize.query<{
        view_name: string;
        size_bytes: number;
        size_pretty: string;
        row_count: number;
      }>(
        `
        SELECT
          schemaname || '.' || matviewname AS view_name,
          pg_total_relation_size(schemaname || '.' || matviewname) AS size_bytes,
          pg_size_pretty(pg_total_relation_size(schemaname || '.' || matviewname)) AS size_pretty,
          (SELECT n_live_tup FROM pg_stat_user_tables WHERE schemaname || '.' || relname = :viewName) AS row_count
        FROM pg_matviews
        WHERE matviewname = :viewName;
        `,
        {
          replacements: { viewName },
          type: Sequelize.QueryTypes.SELECT,
        },
      );

      if (!result[0]) {
        return null;
      }

      const lastRefresh = await this.getLastRefreshTime(viewName);

      return {
        viewName: result[0].view_name,
        sizeBytes: result[0].size_bytes,
        sizePretty: result[0].size_pretty,
        rowCount: result[0].row_count,
        lastRefresh,
      };
    } catch (error) {
      this.logError(
        `Failed to get statistics for ${viewName}: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * Get statistics for all materialized views
   */
  async getAllViewStatistics(): Promise<Array<{
    viewName: string;
    sizeBytes: number;
    sizePretty: string;
    rowCount: number;
    lastRefresh: Date | null;
  }>> {
    const views = [
      'mv_student_health_summary',
      'mv_compliance_status',
      'mv_medication_schedule',
      'mv_allergy_summary',
      'mv_appointment_statistics',
    ];

    const statistics = await Promise.all(
      views.map(view => this.getViewStatistics(view)),
    );

    return statistics.filter(stat => stat !== null);
  }

  // =====================================================
  // SCHEDULED REFRESH JOBS
  // =====================================================

  /**
   * Scheduled refresh: Hourly for dashboard-critical views
   * Runs at: 0 minutes past every hour
   */
  @Cron(CronExpression.EVERY_HOUR)
  async scheduledHourlyRefresh(): Promise<void> {
    this.logInfo('Starting scheduled hourly refresh...');

    try {
      await Promise.all([
        this.refreshStudentHealthSummary(),
        this.refreshMedicationSchedule(),
        this.refreshAllergySummary(),
      ]);

      this.logInfo('Scheduled hourly refresh completed successfully');
    } catch (error) {
      this.logError(
        `Scheduled hourly refresh failed: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Scheduled refresh: Every 6 hours for compliance views
   * Runs at: 0:00, 6:00, 12:00, 18:00
   */
  @Cron('0 */6 * * *')
  async scheduledComplianceRefresh(): Promise<void> {
    this.logInfo('Starting scheduled compliance refresh...');

    try {
      await this.refreshComplianceStatus();

      this.logInfo('Scheduled compliance refresh completed successfully');
    } catch (error) {
      this.logError(
        `Scheduled compliance refresh failed: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Scheduled refresh: Daily for statistics/reporting views
   * Runs at: 2:00 AM (low-traffic period)
   */
  @Cron('0 2 * * *')
  async scheduledDailyRefresh(): Promise<void> {
    this.logInfo('Starting scheduled daily refresh...');

    try {
      await this.refreshAppointmentStatistics();

      this.logInfo('Scheduled daily refresh completed successfully');
    } catch (error) {
      this.logError(
        `Scheduled daily refresh failed: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Health check: Verify all materialized views exist and have data
   */
  async healthCheck(): Promise<{
    healthy: boolean;
    views: Array<{ name: string; exists: boolean; hasData: boolean }>;
  }> {
    const views = [
      'mv_student_health_summary',
      'mv_compliance_status',
      'mv_medication_schedule',
      'mv_allergy_summary',
      'mv_appointment_statistics',
    ];

    const checks = await Promise.all(
      views.map(async (viewName) => {
        try {
          const result = await this.sequelize.query<{ count: number }>(
            `SELECT COUNT(*) as count FROM "${viewName}";`,
            { type: Sequelize.QueryTypes.SELECT },
          );

          return {
            name: viewName,
            exists: true,
            hasData: result[0].count > 0,
          };
        } catch (error) {
          return {
            name: viewName,
            exists: false,
            hasData: false,
          };
        }
      }),
    );

    const healthy = checks.every(check => check.exists);

    return { healthy, views: checks };
  }
}
