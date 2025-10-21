/**
 * LOC: 22633D4FAB
 * WC-GEN-224 | securityAnalysisService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (shared/logging/logger.ts)
 *   - index.ts (database/models/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/audit/index.ts)
 */

/**
 * WC-GEN-224 | securityAnalysisService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../shared/logging/logger, ../../database/models | Dependencies: sequelize, ../../shared/logging/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op, literal } from 'sequelize';
import { logger } from '../../shared/logging/logger';
import { AuditLog } from '../../database/models';

/**
 * SecurityAnalysisService - Security monitoring and threat detection
 * 
 * Provides security-focused analysis of audit logs to detect potential
 * threats, unusual patterns, and security violations. Essential for
 * maintaining system security and detecting malicious activities.
 */
export class SecurityAnalysisService {
  /**
   * Detect suspicious login patterns
   *
   * @param startDate - Start date for the analysis
   * @param endDate - End date for the analysis
   * @returns Promise with suspicious login patterns
   */
  static async detectSuspiciousLogins(startDate: Date, endDate: Date) {
    try {
      // Find multiple failed login attempts from same IP
      const failedLogins = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          },
          action: 'LOGIN',
          [Op.and]: [
            literal("(changes->>'success')::boolean = false")
          ],
          ipAddress: { [Op.ne]: null }
        },
        attributes: ['ipAddress', 'userId', 'createdAt', 'userAgent'],
        order: [['createdAt', 'DESC']]
      });

      // Group by IP address
      const ipFailureMap = new Map<string, any[]>();
      failedLogins.forEach(log => {
        if (!log.ipAddress) return;
        
        if (!ipFailureMap.has(log.ipAddress)) {
          ipFailureMap.set(log.ipAddress, []);
        }
        ipFailureMap.get(log.ipAddress)!.push(log);
      });

      // Identify suspicious IPs (5+ failed attempts)
      const suspiciousIPs = Array.from(ipFailureMap.entries())
        .filter(([_, attempts]) => attempts.length >= 5)
        .map(([ip, attempts]) => ({
          ipAddress: ip,
          failedAttempts: attempts.length,
          timespan: {
            first: attempts[attempts.length - 1].createdAt,
            last: attempts[0].createdAt
          },
          uniqueUsers: [...new Set(attempts.map(a => a.userId).filter(Boolean))].length,
          userAgents: [...new Set(attempts.map(a => a.userAgent).filter(Boolean))]
        }));

      return {
        period: { start: startDate, end: endDate },
        totalFailedLogins: failedLogins.length,
        suspiciousIPs,
        riskLevel: suspiciousIPs.length > 0 ? 'HIGH' : failedLogins.length > 20 ? 'MEDIUM' : 'LOW'
      };
    } catch (error) {
      logger.error('Error detecting suspicious logins:', error);
      throw new Error('Failed to detect suspicious logins');
    }
  }

  /**
   * Detect unusual PHI access patterns
   *
   * @param startDate - Start date for the analysis
   * @param endDate - End date for the analysis
   * @returns Promise with unusual PHI access analysis
   */
  static async detectUnusualPHIAccess(startDate: Date, endDate: Date) {
    try {
      const phiAccess = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          },
          [Op.and]: [
            literal("(changes->>'isPHIAccess')::boolean = true")
          ]
        },
        attributes: ['userId', 'changes', 'createdAt', 'ipAddress']
      });

      // Analyze access patterns by user
      const userAccessMap = new Map<string, {
        totalAccess: number;
        uniqueStudents: Set<string>;
        accessTimes: Date[];
        ipAddresses: Set<string>;
      }>();

      phiAccess.forEach(log => {
        if (!log.userId) return;

        if (!userAccessMap.has(log.userId)) {
          userAccessMap.set(log.userId, {
            totalAccess: 0,
            uniqueStudents: new Set(),
            accessTimes: [],
            ipAddresses: new Set()
          });
        }

        const userAccess = userAccessMap.get(log.userId)!;
        userAccess.totalAccess++;
        userAccess.accessTimes.push(log.createdAt);

        if (log.ipAddress) {
          userAccess.ipAddresses.add(log.ipAddress);
        }

        const changes = log.changes as any;
        if (changes?.studentId) {
          userAccess.uniqueStudents.add(changes.studentId);
        }
      });

      // Identify unusual patterns
      const unusualPatterns = Array.from(userAccessMap.entries())
        .map(([userId, access]) => {
          const avgAccessPerDay = access.totalAccess / Math.max(1, 
            Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

          // Check for unusual patterns
          const flags = [];
          if (avgAccessPerDay > 50) flags.push('HIGH_VOLUME');
          if (access.uniqueStudents.size > 100) flags.push('WIDE_ACCESS');
          if (access.ipAddresses.size > 5) flags.push('MULTIPLE_IPS');

          // Check for after-hours access (outside 6 AM - 8 PM)
          const afterHoursAccess = access.accessTimes.filter(time => {
            const hour = time.getHours();
            return hour < 6 || hour > 20;
          }).length;

          if (afterHoursAccess > access.totalAccess * 0.3) {
            flags.push('AFTER_HOURS');
          }

          return {
            userId,
            totalAccess: access.totalAccess,
            uniqueStudents: access.uniqueStudents.size,
            avgAccessPerDay: Math.round(avgAccessPerDay * 100) / 100,
            ipAddressCount: access.ipAddresses.size,
            afterHoursAccess,
            flags,
            riskScore: flags.length
          };
        })
        .filter(pattern => pattern.flags.length > 0)
        .sort((a, b) => b.riskScore - a.riskScore);

      return {
        period: { start: startDate, end: endDate },
        totalPHIAccess: phiAccess.length,
        unusualPatterns,
        highRiskUsers: unusualPatterns.filter(p => p.riskScore >= 2),
        summary: {
          totalFlagged: unusualPatterns.length,
          highRisk: unusualPatterns.filter(p => p.riskScore >= 2).length,
          mediumRisk: unusualPatterns.filter(p => p.riskScore === 1).length
        }
      };
    } catch (error) {
      logger.error('Error detecting unusual PHI access:', error);
      throw new Error('Failed to detect unusual PHI access');
    }
  }

  /**
   * Analyze system access outside normal hours
   *
   * @param startDate - Start date for the analysis
   * @param endDate - End date for the analysis
   * @returns Promise with after-hours access analysis
   */
  static async analyzeAfterHoursAccess(startDate: Date, endDate: Date) {
    try {
      const allLogs = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        attributes: ['userId', 'action', 'entityType', 'createdAt', 'ipAddress']
      });

      // Define normal business hours (6 AM - 8 PM, Monday-Friday)
      const afterHoursLogs = allLogs.filter(log => {
        const date = log.createdAt;
        const hour = date.getHours();
        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

        // Weekend or outside business hours
        return dayOfWeek === 0 || dayOfWeek === 6 || hour < 6 || hour > 20;
      });

      // Group by user
      const userAfterHoursMap = new Map<string, {
        totalAccess: number;
        weekendAccess: number;
        nightAccess: number;
        actions: Set<string>;
        entities: Set<string>;
      }>();

      afterHoursLogs.forEach(log => {
        if (!log.userId) return;

        if (!userAfterHoursMap.has(log.userId)) {
          userAfterHoursMap.set(log.userId, {
            totalAccess: 0,
            weekendAccess: 0,
            nightAccess: 0,
            actions: new Set(),
            entities: new Set()
          });
        }

        const userAccess = userAfterHoursMap.get(log.userId)!;
        userAccess.totalAccess++;
        userAccess.actions.add(log.action);
        userAccess.entities.add(log.entityType);

        const dayOfWeek = log.createdAt.getDay();
        const hour = log.createdAt.getHours();

        if (dayOfWeek === 0 || dayOfWeek === 6) {
          userAccess.weekendAccess++;
        }

        if (hour < 6 || hour > 20) {
          userAccess.nightAccess++;
        }
      });

      const afterHoursAnalysis = Array.from(userAfterHoursMap.entries())
        .map(([userId, access]) => ({
          userId,
          totalAfterHours: access.totalAccess,
          weekendAccess: access.weekendAccess,
          nightAccess: access.nightAccess,
          uniqueActions: access.actions.size,
          uniqueEntities: access.entities.size,
          riskLevel: access.totalAccess > 20 ? 'HIGH' : access.totalAccess > 5 ? 'MEDIUM' : 'LOW'
        }))
        .filter(analysis => analysis.totalAfterHours > 0)
        .sort((a, b) => b.totalAfterHours - a.totalAfterHours);

      return {
        period: { start: startDate, end: endDate },
        totalLogs: allLogs.length,
        afterHoursLogs: afterHoursLogs.length,
        afterHoursPercentage: allLogs.length > 0 ? 
          (afterHoursLogs.length / allLogs.length) * 100 : 0,
        userAnalysis: afterHoursAnalysis,
        summary: {
          usersWithAfterHoursAccess: afterHoursAnalysis.length,
          highRiskUsers: afterHoursAnalysis.filter(a => a.riskLevel === 'HIGH').length,
          totalWeekendAccess: afterHoursAnalysis.reduce((sum, a) => sum + a.weekendAccess, 0),
          totalNightAccess: afterHoursAnalysis.reduce((sum, a) => sum + a.nightAccess, 0)
        }
      };
    } catch (error) {
      logger.error('Error analyzing after-hours access:', error);
      throw new Error('Failed to analyze after-hours access');
    }
  }

  /**
   * Detect potential data exfiltration attempts
   *
   * @param startDate - Start date for the analysis
   * @param endDate - End date for the analysis
   * @returns Promise with data exfiltration analysis
   */
  static async detectDataExfiltration(startDate: Date, endDate: Date) {
    try {
      // Look for export/download actions
      const exportLogs = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          },
          [Op.or]: [
            { action: { [Op.iLike]: '%EXPORT%' } },
            { action: { [Op.iLike]: '%DOWNLOAD%' } },
            { action: { [Op.iLike]: '%BULK%' } },
            {
              [Op.and]: [
                literal("changes->>'accessType' = 'EXPORT'")
              ]
            }
          ]
        },
        attributes: ['userId', 'action', 'entityType', 'changes', 'createdAt', 'ipAddress']
      });

      // Group by user
      const userExportMap = new Map<string, {
        totalExports: number;
        entityTypes: Set<string>;
        timePattern: Date[];
        ipAddresses: Set<string>;
        phiExports: number;
      }>();

      exportLogs.forEach(log => {
        if (!log.userId) return;

        if (!userExportMap.has(log.userId)) {
          userExportMap.set(log.userId, {
            totalExports: 0,
            entityTypes: new Set(),
            timePattern: [],
            ipAddresses: new Set(),
            phiExports: 0
          });
        }

        const userExport = userExportMap.get(log.userId)!;
        userExport.totalExports++;
        userExport.entityTypes.add(log.entityType);
        userExport.timePattern.push(log.createdAt);

        if (log.ipAddress) {
          userExport.ipAddresses.add(log.ipAddress);
        }

        const changes = log.changes as any;
        if (changes?.isPHIAccess || changes?.accessType === 'EXPORT') {
          userExport.phiExports++;
        }
      });

      // Analyze for suspicious patterns
      const suspiciousExports = Array.from(userExportMap.entries())
        .map(([userId, exports]) => {
          const flags = [];
          
          // High volume exports
          if (exports.totalExports > 10) flags.push('HIGH_VOLUME');
          
          // Multiple entity types
          if (exports.entityTypes.size > 5) flags.push('DIVERSE_DATA');
          
          // PHI exports
          if (exports.phiExports > 0) flags.push('PHI_EXPORT');
          
          // Multiple IP addresses
          if (exports.ipAddresses.size > 3) flags.push('MULTIPLE_IPS');
          
          // Rapid succession exports (clustering)
          const timeDiffs = exports.timePattern
            .sort((a, b) => a.getTime() - b.getTime())
            .slice(1)
            .map((time, i) => time.getTime() - exports.timePattern[i].getTime());
          
          const rapidExports = timeDiffs.filter(diff => diff < 60000).length; // < 1 minute
          if (rapidExports > 3) flags.push('RAPID_SUCCESSION');

          return {
            userId,
            totalExports: exports.totalExports,
            entityTypes: Array.from(exports.entityTypes),
            phiExports: exports.phiExports,
            ipAddressCount: exports.ipAddresses.size,
            rapidExports,
            flags,
            riskScore: flags.length + (exports.phiExports > 0 ? 2 : 0)
          };
        })
        .filter(analysis => analysis.flags.length > 0)
        .sort((a, b) => b.riskScore - a.riskScore);

      return {
        period: { start: startDate, end: endDate },
        totalExports: exportLogs.length,
        suspiciousExports,
        summary: {
          totalFlagged: suspiciousExports.length,
          highRisk: suspiciousExports.filter(s => s.riskScore >= 4).length,
          mediumRisk: suspiciousExports.filter(s => s.riskScore >= 2 && s.riskScore < 4).length,
          phiExportsDetected: suspiciousExports.filter(s => s.phiExports > 0).length
        },
        recommendations: suspiciousExports.length > 0 ? [
          'Review flagged user activities immediately',
          'Verify legitimate business need for exports',
          'Check if proper approvals were obtained',
          'Monitor ongoing activity for these users'
        ] : []
      };
    } catch (error) {
      logger.error('Error detecting data exfiltration:', error);
      throw new Error('Failed to detect data exfiltration');
    }
  }

  /**
   * Generate comprehensive security report
   *
   * @param startDate - Start date for the security analysis
   * @param endDate - End date for the security analysis
   * @returns Promise with comprehensive security analysis
   */
  static async generateSecurityReport(startDate: Date, endDate: Date) {
    try {
      const [
        suspiciousLogins,
        unusualPHIAccess,
        afterHoursAccess,
        dataExfiltration
      ] = await Promise.all([
        this.detectSuspiciousLogins(startDate, endDate),
        this.detectUnusualPHIAccess(startDate, endDate),
        this.analyzeAfterHoursAccess(startDate, endDate),
        this.detectDataExfiltration(startDate, endDate)
      ]);

      // Calculate overall risk score
      let overallRiskScore = 0;
      if (suspiciousLogins.riskLevel === 'HIGH') overallRiskScore += 3;
      else if (suspiciousLogins.riskLevel === 'MEDIUM') overallRiskScore += 2;
      else if (suspiciousLogins.riskLevel === 'LOW') overallRiskScore += 1;

      overallRiskScore += unusualPHIAccess.summary.highRisk * 2;
      overallRiskScore += unusualPHIAccess.summary.mediumRisk;
      overallRiskScore += afterHoursAccess.summary.highRiskUsers;
      overallRiskScore += dataExfiltration.summary.highRisk * 3;
      overallRiskScore += dataExfiltration.summary.mediumRisk;

      const riskLevel = overallRiskScore >= 10 ? 'CRITICAL' : 
                       overallRiskScore >= 6 ? 'HIGH' :
                       overallRiskScore >= 3 ? 'MEDIUM' : 'LOW';

      return {
        period: { start: startDate, end: endDate },
        overallRiskLevel: riskLevel,
        overallRiskScore,
        findings: {
          suspiciousLogins,
          unusualPHIAccess,
          afterHoursAccess,
          dataExfiltration
        },
        summary: {
          totalSecurityEvents: 
            suspiciousLogins.suspiciousIPs.length +
            unusualPHIAccess.highRiskUsers.length +
            afterHoursAccess.summary.highRiskUsers +
            dataExfiltration.summary.highRisk,
          criticalIssues: dataExfiltration.summary.highRisk,
          recommendationsCount: dataExfiltration.recommendations.length
        },
        recommendations: [
          ...dataExfiltration.recommendations,
          ...(suspiciousLogins.suspiciousIPs.length > 0 ? ['Implement IP blocking for suspicious addresses'] : []),
          ...(afterHoursAccess.summary.highRiskUsers > 0 ? ['Review after-hours access policies'] : []),
          ...(unusualPHIAccess.summary.highRisk > 0 ? ['Audit PHI access permissions'] : [])
        ]
      };
    } catch (error) {
      logger.error('Error generating security report:', error);
      throw new Error('Failed to generate security report');
    }
  }
}
