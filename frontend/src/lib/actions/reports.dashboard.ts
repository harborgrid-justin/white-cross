/**
 * @fileoverview Report Dashboard Functions
 * @module lib/actions/reports/dashboard
 *
 * Dashboard statistics and analytics for report management system.
 * Provides comprehensive metrics, trends, and insights for reports.
 */

'use server';

// Import cache functions and audit logging
import { getReports } from './reports.cache';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types
import type { Report } from './reports.types';

// ==========================================
// DASHBOARD FUNCTIONS
// ==========================================

/**
 * Get comprehensive reports statistics for dashboard
 * @returns Promise<ReportsStats> Statistics object with report generation metrics
 */
export async function getReportsStats(): Promise<{
  totalReports: number;
  completedReports: number;
  scheduledReports: number;
  failedReports: number;
  processingReports: number;
  complianceReports: number;
  customReports: number;
  automatedReports: number;
  averageGenerationTime: number;
  totalDataProcessed: number;
  reportsByType: {
    student_health: number;
    medication: number;
    incident: number;
    attendance: number;
    compliance: number;
    financial: number;
    custom: number;
  };
}> {
  try {
    console.log('[Reports] Loading report statistics');

    // Get reports data
    const reports = await getReports();

    // Calculate statistics based on report schema properties
    const totalReports = reports.length;
    const completedReports = reports.filter(r => r.status === 'completed').length;
    const scheduledReports = reports.filter(r => r.status === 'scheduled').length;
    const failedReports = reports.filter(r => r.status === 'failed').length;
    const processingReports = reports.filter(r => r.status === 'processing').length;
    const complianceReports = reports.filter(r => r.type === 'compliance').length;
    const customReports = reports.filter(r => r.type === 'custom').length;
    const automatedReports = reports.filter(r => r.isAutomated).length;

    // Calculate average generation time (mock calculation)
    const completedWithDuration = reports.filter(r => r.status === 'completed' && r.generationTime);
    const averageGenerationTime = completedWithDuration.length > 0
      ? completedWithDuration.reduce((sum, r) => sum + (r.generationTime || 0), 0) / completedWithDuration.length
      : 0;

    // Mock total data processed
    const totalDataProcessed = reports.reduce((sum, r) => sum + (r.recordsProcessed || 0), 0);

    // Calculate reports by type
    const reportsByType = {
      student_health: reports.filter(r => r.type === 'student_health').length,
      medication: reports.filter(r => r.type === 'medication').length,
      incident: reports.filter(r => r.type === 'incident').length,
      attendance: reports.filter(r => r.type === 'attendance').length,
      compliance: reports.filter(r => r.type === 'compliance').length,
      financial: reports.filter(r => r.type === 'financial').length,
      custom: reports.filter(r => r.type === 'custom').length,
    };

    const stats = {
      totalReports,
      completedReports,
      scheduledReports,
      failedReports,
      processingReports,
      complianceReports,
      customReports,
      automatedReports,
      averageGenerationTime,
      totalDataProcessed,
      reportsByType,
    };

    console.log('[Reports] Statistics calculated:', stats);

    await auditLog({
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'reports_dashboard_stats',
      details: 'Retrieved report dashboard statistics'
    });

    return stats;
  } catch (error) {
    console.error('[Reports] Error calculating stats:', error);
    return {
      totalReports: 0,
      completedReports: 0,
      scheduledReports: 0,
      failedReports: 0,
      processingReports: 0,
      complianceReports: 0,
      customReports: 0,
      automatedReports: 0,
      averageGenerationTime: 0,
      totalDataProcessed: 0,
      reportsByType: {
        student_health: 0,
        medication: 0,
        incident: 0,
        attendance: 0,
        compliance: 0,
        financial: 0,
        custom: 0,
      },
    };
  }
}

/**
 * Get reports dashboard data with recent reports and generation analytics
 * @returns Promise<ReportsDashboardData> Dashboard data with report generation insights
 */
export async function getReportsDashboardData(): Promise<{
  recentReports: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    createdAt: string;
    completedAt?: string;
    recordsProcessed: number;
    generatedBy: string;
  }>;
  scheduledReports: Array<{
    id: string;
    name: string;
    type: string;
    nextRun: string;
    frequency: string;
    isActive: boolean;
  }>;
  failedReports: Array<{
    id: string;
    name: string;
    type: string;
    failedAt: string;
    errorMessage: string;
    retryCount: number;
  }>;
  generationTrends: {
    thisWeek: { completed: number; failed: number; };
    lastWeek: { completed: number; failed: number; };
    thisMonth: { completed: number; failed: number; };
  };
  complianceStatus: {
    upToDate: number;
    needsUpdate: number;
    overdue: number;
  };
  stats: {
    totalReports: number;
    completedReports: number;
    scheduledReports: number;
    failedReports: number;
    processingReports: number;
    complianceReports: number;
    customReports: number;
    automatedReports: number;
    averageGenerationTime: number;
    totalDataProcessed: number;
    reportsByType: {
      student_health: number;
      medication: number;
      incident: number;
      attendance: number;
      compliance: number;
      financial: number;
      custom: number;
    };
  };
}> {
  try {
    // Get stats and reports data
    const stats = await getReportsStats();
    const reports = await getReports();

    // Sort reports by date descending and get recent reports (last 10)
    const sortedReports = reports
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const recentReports = sortedReports.map(report => ({
      id: report.id,
      name: report.name,
      type: report.type,
      status: report.status,
      createdAt: report.createdAt,
      completedAt: report.completedAt,
      recordsProcessed: report.recordsProcessed || 0,
      generatedBy: report.generatedBy?.name || 'System',
    }));

    // Get scheduled reports
    const scheduledReports = reports
      .filter(r => r.status === 'scheduled' || r.schedule)
      .slice(0, 5)
      .map(report => ({
        id: report.id,
        name: report.name,
        type: report.type,
        nextRun: report.nextRun || report.scheduledAt || '',
        frequency: report.schedule?.frequency || 'once',
        isActive: report.schedule?.isActive !== false,
      }));

    // Get failed reports
    const failedReports = reports
      .filter(r => r.status === 'failed')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(report => ({
        id: report.id,
        name: report.name,
        type: report.type,
        failedAt: report.updatedAt,
        errorMessage: report.errorMessage || 'Unknown error',
        retryCount: report.retryCount || 0,
      }));

    // Calculate generation trends
    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const generationTrends = {
      thisWeek: {
        completed: reports.filter(r =>
          r.status === 'completed' &&
          new Date(r.completedAt || r.updatedAt) >= thisWeekStart
        ).length,
        failed: reports.filter(r =>
          r.status === 'failed' &&
          new Date(r.updatedAt) >= thisWeekStart
        ).length,
      },
      lastWeek: {
        completed: reports.filter(r =>
          r.status === 'completed' &&
          new Date(r.completedAt || r.updatedAt) >= lastWeekStart &&
          new Date(r.completedAt || r.updatedAt) < lastWeekEnd
        ).length,
        failed: reports.filter(r =>
          r.status === 'failed' &&
          new Date(r.updatedAt) >= lastWeekStart &&
          new Date(r.updatedAt) < lastWeekEnd
        ).length,
      },
      thisMonth: {
        completed: reports.filter(r =>
          r.status === 'completed' &&
          new Date(r.completedAt || r.updatedAt) >= thisMonthStart
        ).length,
        failed: reports.filter(r =>
          r.status === 'failed' &&
          new Date(r.updatedAt) >= thisMonthStart
        ).length,
      },
    };

    // Mock compliance status (would come from compliance tracking system)
    const complianceReportsTotal = reports.filter(r => r.type === 'compliance').length;
    const complianceStatus = {
      upToDate: Math.floor(complianceReportsTotal * 0.7),
      needsUpdate: Math.floor(complianceReportsTotal * 0.2),
      overdue: Math.floor(complianceReportsTotal * 0.1),
    };

    const dashboardData = {
      recentReports,
      scheduledReports,
      failedReports,
      generationTrends,
      complianceStatus,
      stats,
    };

    console.log('[Reports] Dashboard data prepared:', {
      recentCount: recentReports.length,
      scheduledCount: scheduledReports.length,
      failedCount: failedReports.length,
    });

    await auditLog({
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'reports_dashboard_data',
      details: 'Retrieved report dashboard data'
    });

    return dashboardData;
  } catch (error) {
    console.error('[Reports] Error loading dashboard data:', error);
    // Return safe defaults with stats fallback
    return {
      recentReports: [],
      scheduledReports: [],
      failedReports: [],
      generationTrends: {
        thisWeek: { completed: 0, failed: 0 },
        lastWeek: { completed: 0, failed: 0 },
        thisMonth: { completed: 0, failed: 0 },
      },
      complianceStatus: {
        upToDate: 0,
        needsUpdate: 0,
        overdue: 0,
      },
      stats: await getReportsStats(), // Will return safe defaults
    };
  }
}
