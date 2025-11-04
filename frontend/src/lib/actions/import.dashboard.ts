/**
 * @fileoverview Import Dashboard Functions
 * @module lib/actions/import.dashboard
 *
 * Dashboard statistics and data aggregation for import operations.
 * Provides comprehensive metrics and analytics for monitoring import processes.
 */

'use server';

import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Cache functions
import { getImportJobs } from './import.cache';

// ==========================================
// DASHBOARD STATISTICS
// ==========================================

/**
 * Get comprehensive import statistics for dashboard
 * @returns Promise<ImportStats> Statistics object with import processing metrics
 */
export async function getImportStats(): Promise<{
  totalJobs: number;
  completedJobs: number;
  processingJobs: number;
  failedJobs: number;
  pendingJobs: number;
  totalRecordsProcessed: number;
  totalRecordsImported: number;
  totalRecordsRejected: number;
  averageProcessingTimeMs: number;
  successRate: number;
  importsByFormat: {
    students: number;
    medications: number;
    inventory: number;
    staff: number;
    immunizations: number;
    incidents: number;
    custom: number;
  };
}> {
  try {
    console.log('[Import] Loading import statistics');

    // Get import jobs data
    const jobs = await getImportJobs();

    // Calculate statistics based on actual ImportJob schema properties
    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(j => j.status === 'completed').length;
    const processingJobs = jobs.filter(j => ['validating', 'processing'].includes(j.status)).length;
    const failedJobs = jobs.filter(j => j.status === 'failed').length;
    const pendingJobs = jobs.filter(j => j.status === 'pending').length;

    // Calculate record statistics using correct properties
    const totalRecordsProcessed = jobs.reduce((sum, j) => sum + (j.processedRecords || 0), 0);
    const totalRecordsImported = jobs.reduce((sum, j) => sum + (j.importedRecords || 0), 0);
    const totalRecordsRejected = jobs.reduce((sum, j) => sum + (j.errorRecords || 0), 0);

    // Calculate average processing time from completed jobs
    const completedJobsWithTime = jobs.filter(j =>
      j.status === 'completed' && j.startedAt && j.completedAt
    );

    let averageProcessingTimeMs = 0;
    if (completedJobsWithTime.length > 0) {
      const totalTimeMs = completedJobsWithTime.reduce((sum, j) => {
        const startTime = new Date(j.startedAt!).getTime();
        const endTime = new Date(j.completedAt!).getTime();
        return sum + (endTime - startTime);
      }, 0);
      averageProcessingTimeMs = totalTimeMs / completedJobsWithTime.length;
    }

    // Calculate success rate
    const successRate = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;

    // Calculate imports by format (using the correct property)
    const importsByFormat = {
      students: jobs.filter(j => j.format === 'students').length,
      medications: jobs.filter(j => j.format === 'medications').length,
      inventory: jobs.filter(j => j.format === 'inventory').length,
      staff: jobs.filter(j => j.format === 'staff').length,
      immunizations: jobs.filter(j => j.format === 'immunizations').length,
      incidents: jobs.filter(j => j.format === 'incidents').length,
      custom: jobs.filter(j => j.format === 'custom').length,
    };

    const stats = {
      totalJobs,
      completedJobs,
      processingJobs,
      failedJobs,
      pendingJobs,
      totalRecordsProcessed,
      totalRecordsImported,
      totalRecordsRejected,
      averageProcessingTimeMs,
      successRate,
      importsByFormat,
    };

    console.log('[Import] Statistics calculated:', stats);

    await auditLog({
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'import_dashboard_stats',
      details: 'Retrieved import dashboard statistics'
    });

    return stats;
  } catch (error) {
    console.error('[Import] Error calculating stats:', error);
    return {
      totalJobs: 0,
      completedJobs: 0,
      processingJobs: 0,
      failedJobs: 0,
      pendingJobs: 0,
      totalRecordsProcessed: 0,
      totalRecordsImported: 0,
      totalRecordsRejected: 0,
      averageProcessingTimeMs: 0,
      successRate: 0,
      importsByFormat: {
        students: 0,
        medications: 0,
        inventory: 0,
        staff: 0,
        immunizations: 0,
        incidents: 0,
        custom: 0,
      },
    };
  }
}

/**
 * Get import dashboard data with recent jobs and processing insights
 * @returns Promise<ImportDashboardData> Dashboard data with import job analytics
 */
export async function getImportDashboardData(): Promise<{
  recentJobs: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    totalRecords: number;
    importedRecords: number;
    rejectedRecords: number;
    createdBy: string;
    timestamp: string;
    processingTime?: number;
  }>;
  failedJobs: Array<{
    id: string;
    name: string;
    type: string;
    errorMessage: string;
    failedAt: string;
    totalRecords: number;
    createdBy: string;
  }>;
  processingQueue: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    totalRecords: number;
    progress: number;
    estimatedCompletion?: string;
  }>;
  processingTrends: {
    thisWeek: { completed: number; failed: number; total: number; };
    lastWeek: { completed: number; failed: number; total: number; };
    thisMonth: { completed: number; failed: number; total: number; };
  };
  dataQuality: {
    validRecords: number;
    invalidRecords: number;
    duplicateRecords: number;
    qualityScore: number;
  };
  stats: {
    totalJobs: number;
    completedJobs: number;
    processingJobs: number;
    failedJobs: number;
    pendingJobs: number;
    totalRecordsProcessed: number;
    totalRecordsImported: number;
    totalRecordsRejected: number;
    averageProcessingTimeMs: number;
    successRate: number;
    importsByFormat: {
      students: number;
      medications: number;
      inventory: number;
      staff: number;
      immunizations: number;
      incidents: number;
      custom: number;
    };
  };
}> {
  try {
    // Get stats and import jobs data
    const stats = await getImportStats();
    const jobs = await getImportJobs();

    // Sort jobs by date descending and get recent jobs (last 10)
    const sortedJobs = jobs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const recentJobs = sortedJobs.map(job => ({
      id: job.id,
      name: job.name,
      type: job.type,
      status: job.status,
      totalRecords: job.totalRecords || 0,
      importedRecords: job.importedRecords || 0,
      rejectedRecords: job.errorRecords || 0,
      createdBy: job.createdByName || 'System',
      timestamp: job.createdAt,
      processingTime: job.startedAt && job.completedAt
        ? new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()
        : undefined,
    }));

    // Get failed jobs
    const failedJobs = jobs
      .filter(j => j.status === 'failed')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(job => ({
        id: job.id,
        name: job.name,
        type: job.type,
        errorMessage: job.errorMessage || 'Unknown error',
        failedAt: job.updatedAt,
        totalRecords: job.totalRecords || 0,
        createdBy: job.createdByName || 'System',
      }));

    // Get processing queue
    const processingQueue = jobs
      .filter(j => ['pending', 'validating', 'processing'].includes(j.status))
      .slice(0, 5)
      .map(job => ({
        id: job.id,
        name: job.name,
        type: job.type,
        status: job.status,
        totalRecords: job.totalRecords || 0,
        progress: job.processedRecords > 0 && job.totalRecords > 0
          ? Math.round((job.processedRecords / job.totalRecords) * 100)
          : 0,
        estimatedCompletion: job.startedAt
          ? new Date(new Date(job.startedAt).getTime() + stats.averageProcessingTimeMs).toISOString()
          : undefined,
      }));

    // Calculate processing trends
    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const processingTrends = {
      thisWeek: {
        completed: jobs.filter(j =>
          j.status === 'completed' &&
          new Date(j.completedAt || j.updatedAt) >= thisWeekStart
        ).length,
        failed: jobs.filter(j =>
          j.status === 'failed' &&
          new Date(j.updatedAt) >= thisWeekStart
        ).length,
        total: jobs.filter(j =>
          new Date(j.createdAt) >= thisWeekStart
        ).length,
      },
      lastWeek: {
        completed: jobs.filter(j =>
          j.status === 'completed' &&
          new Date(j.completedAt || j.updatedAt) >= lastWeekStart &&
          new Date(j.completedAt || j.updatedAt) < lastWeekEnd
        ).length,
        failed: jobs.filter(j =>
          j.status === 'failed' &&
          new Date(j.updatedAt) >= lastWeekStart &&
          new Date(j.updatedAt) < lastWeekEnd
        ).length,
        total: jobs.filter(j =>
          new Date(j.createdAt) >= lastWeekStart &&
          new Date(j.createdAt) < lastWeekEnd
        ).length,
      },
      thisMonth: {
        completed: jobs.filter(j =>
          j.status === 'completed' &&
          new Date(j.completedAt || j.updatedAt) >= thisMonthStart
        ).length,
        failed: jobs.filter(j =>
          j.status === 'failed' &&
          new Date(j.updatedAt) >= thisMonthStart
        ).length,
        total: jobs.filter(j =>
          new Date(j.createdAt) >= thisMonthStart
        ).length,
      },
    };

    // Calculate data quality metrics
    const validRecords = stats.totalRecordsImported;
    const invalidRecords = stats.totalRecordsRejected;
    const duplicateRecords = jobs.reduce((sum, j) => sum + (j.skippedRecords || 0), 0);
    const qualityScore = stats.totalRecordsProcessed > 0
      ? (validRecords / stats.totalRecordsProcessed) * 100
      : 0;

    const dataQuality = {
      validRecords,
      invalidRecords,
      duplicateRecords,
      qualityScore,
    };

    const dashboardData = {
      recentJobs,
      failedJobs,
      processingQueue,
      processingTrends,
      dataQuality,
      stats,
    };

    console.log('[Import] Dashboard data prepared:', {
      recentCount: recentJobs.length,
      failedCount: failedJobs.length,
      queueCount: processingQueue.length,
    });

    await auditLog({
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'import_dashboard_data',
      details: 'Retrieved import dashboard data'
    });

    return dashboardData;
  } catch (error) {
    console.error('[Import] Error loading dashboard data:', error);

    // Get safe stats for fallback
    const safeStats = await getImportStats();

    return {
      recentJobs: [],
      failedJobs: [],
      processingQueue: [],
      processingTrends: {
        thisWeek: { completed: 0, failed: 0, total: 0 },
        lastWeek: { completed: 0, failed: 0, total: 0 },
        thisMonth: { completed: 0, failed: 0, total: 0 },
      },
      dataQuality: {
        validRecords: 0,
        invalidRecords: 0,
        duplicateRecords: 0,
        qualityScore: 0,
      },
      stats: safeStats,
    };
  }
}
