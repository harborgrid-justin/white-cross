/**
 * LOC: A9BA099B80
 * WC-GEN-221 | complianceReportingService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (shared/logging/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - types.ts (services/audit/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/audit/index.ts)
 */

/**
 * WC-GEN-221 | complianceReportingService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../shared/logging/logger, ../../database/models, ./types | Dependencies: sequelize, ../../shared/logging/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op, literal } from 'sequelize';
import { logger } from '../../shared/logging/logger';
import { AuditLog, User, Student } from '../../database/models';
import { ComplianceReport } from './types';

/**
 * ComplianceReportingService - HIPAA compliance reporting
 * 
 * HIPAA Compliance: Generates comprehensive compliance reports for audit purposes
 * and regulatory compliance. Provides detailed analytics on PHI access patterns
 * and system usage for compliance officers and auditors.
 */
export class ComplianceReportingService {
  /**
   * Get compliance report for HIPAA
   *
   * HIPAA Compliance: Generates comprehensive compliance report for audit purposes
   *
   * @param startDate - Start date for the report period
   * @param endDate - End date for the report period
   * @returns Promise with compliance report data
   */
  static async getComplianceReport(startDate: Date, endDate: Date): Promise<ComplianceReport> {
    try {
      // Get all PHI access logs for the period
      const phiLogs = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          },
          [Op.and]: [
            literal("(changes->>'isPHIAccess')::boolean = true")
          ]
        },
        attributes: ['id', 'userId', 'changes', 'createdAt']
      });

      const totalAccess = phiLogs.length;

      // Calculate failed access
      const failedAccess = phiLogs.filter(log => {
        const changes = log.changes as any;
        return changes?.success === false;
      }).length;

      // Group by access type
      const accessByTypeMap = new Map<string, number>();
      phiLogs.forEach(log => {
        const changes = log.changes as any;
        const accessType = changes?.accessType || 'UNKNOWN';
        accessByTypeMap.set(accessType, (accessByTypeMap.get(accessType) || 0) + 1);
      });

      // Group by data category
      const accessByCategoryMap = new Map<string, number>();
      phiLogs.forEach(log => {
        const changes = log.changes as any;
        const dataCategory = changes?.dataCategory || 'UNKNOWN';
        accessByCategoryMap.set(dataCategory, (accessByCategoryMap.get(dataCategory) || 0) + 1);
      });

      // Get top users by access count
      const userAccessMap = new Map<string, number>();
      phiLogs.forEach(log => {
        if (log.userId) {
          userAccessMap.set(log.userId, (userAccessMap.get(log.userId) || 0) + 1);
        }
      });

      const topUserIds = Array.from(userAccessMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([userId]) => userId);

      const topUsersData = await Promise.all(
        topUserIds.map(async (userId) => {
          const user = await User.findByPk(userId, {
            attributes: ['id', 'firstName', 'lastName']
          });
          return {
            userId,
            userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown User',
            accessCount: userAccessMap.get(userId) || 0
          };
        })
      );

      // Get top students by access count
      const studentAccessMap = new Map<string, number>();
      phiLogs.forEach(log => {
        const changes = log.changes as any;
        if (changes?.studentId) {
          studentAccessMap.set(changes.studentId, (studentAccessMap.get(changes.studentId) || 0) + 1);
        }
      });

      const topStudentIds = Array.from(studentAccessMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([studentId]) => studentId);

      const topStudentsData = await Promise.all(
        topStudentIds.map(async (studentId) => {
          const student = await Student.findByPk(studentId, {
            attributes: ['id', 'firstName', 'lastName']
          });
          return {
            studentId,
            studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
            accessCount: studentAccessMap.get(studentId) || 0
          };
        })
      );

      return {
        period: {
          start: startDate,
          end: endDate
        },
        summary: {
          totalAccess,
          failedAccess,
          successRate: totalAccess > 0 ? ((totalAccess - failedAccess) / totalAccess) * 100 : 0
        },
        accessByType: Array.from(accessByTypeMap.entries()).map(([type, count]) => ({
          type,
          count
        })),
        accessByCategory: Array.from(accessByCategoryMap.entries()).map(([category, count]) => ({
          category,
          count
        })),
        topUsers: topUsersData,
        topStudents: topStudentsData
      };
    } catch (error) {
      logger.error('Error generating compliance report:', error);
      throw new Error('Failed to generate compliance report');
    }
  }

  /**
   * Get PHI access summary for a specific period
   *
   * @param startDate - Start date for the summary period
   * @param endDate - End date for the summary period
   * @returns Promise with PHI access summary data
   */
  static async getPHIAccessSummary(startDate: Date, endDate: Date) {
    try {
      const phiLogs = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          },
          [Op.and]: [
            literal("(changes->>'isPHIAccess')::boolean = true")
          ]
        },
        attributes: ['changes', 'createdAt']
      });

      const totalAccess = phiLogs.length;
      const successfulAccess = phiLogs.filter(log => {
        const changes = log.changes as any;
        return changes?.success !== false;
      }).length;

      const failedAccess = totalAccess - successfulAccess;

      // Group by date for trend analysis
      const dailyAccess = new Map<string, number>();
      phiLogs.forEach(log => {
        const date = log.createdAt.toISOString().split('T')[0];
        dailyAccess.set(date, (dailyAccess.get(date) || 0) + 1);
      });

      return {
        period: { start: startDate, end: endDate },
        totalAccess,
        successfulAccess,
        failedAccess,
        successRate: totalAccess > 0 ? (successfulAccess / totalAccess) * 100 : 0,
        dailyTrend: Array.from(dailyAccess.entries()).map(([date, count]) => ({
          date,
          count
        })).sort((a, b) => a.date.localeCompare(b.date))
      };
    } catch (error) {
      logger.error('Error generating PHI access summary:', error);
      throw new Error('Failed to generate PHI access summary');
    }
  }

  /**
   * Get user activity report for compliance
   *
   * @param startDate - Start date for the report period
   * @param endDate - End date for the report period
   * @returns Promise with user activity report data
   */
  static async getUserActivityReport(startDate: Date, endDate: Date) {
    try {
      const logs = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          },
          userId: { [Op.ne]: null }
        },
        attributes: ['userId', 'action', 'entityType', 'changes']
      });

      // Group by user
      const userActivityMap = new Map<string, {
        totalActions: number;
        phiAccess: number;
        failedActions: number;
        actions: Map<string, number>;
      }>();

      logs.forEach(log => {
        if (!log.userId) return;

        if (!userActivityMap.has(log.userId)) {
          userActivityMap.set(log.userId, {
            totalActions: 0,
            phiAccess: 0,
            failedActions: 0,
            actions: new Map()
          });
        }

        const userActivity = userActivityMap.get(log.userId)!;
        userActivity.totalActions++;

        // Track action types
        const actionCount = userActivity.actions.get(log.action) || 0;
        userActivity.actions.set(log.action, actionCount + 1);

        // Check for PHI access
        const changes = log.changes as any;
        if (changes?.isPHIAccess) {
          userActivity.phiAccess++;
        }

        // Check for failed actions
        if (changes?.success === false) {
          userActivity.failedActions++;
        }
      });

      // Convert to array and enrich with user details
      const userActivityReport = await Promise.all(
        Array.from(userActivityMap.entries()).map(async ([userId, activity]) => {
          const user = await User.findByPk(userId, {
            attributes: ['id', 'firstName', 'lastName', 'email', 'role']
          });

          return {
            userId,
            userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown User',
            userEmail: user?.email || 'Unknown',
            userRole: user?.role || 'Unknown',
            totalActions: activity.totalActions,
            phiAccess: activity.phiAccess,
            failedActions: activity.failedActions,
            successRate: activity.totalActions > 0 ? 
              ((activity.totalActions - activity.failedActions) / activity.totalActions) * 100 : 0,
            topActions: Array.from(activity.actions.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([action, count]) => ({ action, count }))
          };
        })
      );

      return {
        period: { start: startDate, end: endDate },
        totalUsers: userActivityReport.length,
        userActivities: userActivityReport.sort((a, b) => b.totalActions - a.totalActions)
      };
    } catch (error) {
      logger.error('Error generating user activity report:', error);
      throw new Error('Failed to generate user activity report');
    }
  }

  /**
   * Get system access patterns for security analysis
   *
   * @param startDate - Start date for the analysis period
   * @param endDate - End date for the analysis period
   * @returns Promise with access pattern analysis
   */
  static async getAccessPatterns(startDate: Date, endDate: Date) {
    try {
      const logs = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        attributes: ['createdAt', 'ipAddress', 'userAgent', 'action', 'changes']
      });

      // Analyze by hour of day
      const hourlyPattern = new Map<number, number>();
      for (let i = 0; i < 24; i++) {
        hourlyPattern.set(i, 0);
      }

      // Analyze by day of week
      const weeklyPattern = new Map<number, number>();
      for (let i = 0; i < 7; i++) {
        weeklyPattern.set(i, 0);
      }

      // Analyze IP addresses
      const ipAddressMap = new Map<string, number>();

      logs.forEach(log => {
        const hour = log.createdAt.getHours();
        const dayOfWeek = log.createdAt.getDay();

        hourlyPattern.set(hour, (hourlyPattern.get(hour) || 0) + 1);
        weeklyPattern.set(dayOfWeek, (weeklyPattern.get(dayOfWeek) || 0) + 1);

        if (log.ipAddress) {
          ipAddressMap.set(log.ipAddress, (ipAddressMap.get(log.ipAddress) || 0) + 1);
        }
      });

      return {
        period: { start: startDate, end: endDate },
        totalAccess: logs.length,
        patterns: {
          hourly: Array.from(hourlyPattern.entries()).map(([hour, count]) => ({
            hour,
            count
          })),
          weekly: Array.from(weeklyPattern.entries()).map(([day, count]) => ({
            dayOfWeek: day,
            count
          })),
          topIPAddresses: Array.from(ipAddressMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([ip, count]) => ({ ipAddress: ip, count }))
        }
      };
    } catch (error) {
      logger.error('Error analyzing access patterns:', error);
      throw new Error('Failed to analyze access patterns');
    }
  }
}
