import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import {
  AccessControlCreateIncidentDto,
  IncidentSeverity,
} from '../dto/create-security-incident.dto';
import { LogLoginAttemptDto } from '../dto/log-login-attempt.dto';
import { SecurityStatistics } from '../interfaces/security-statistics.interface';
import {
  LoginAttemptInstance,
  PaginationResult,
  SecurityIncidentFilters,
  SecurityIncidentInstance,
  SecurityIncidentUpdateData,
  SecurityIncidentWhereClause,
  SequelizeModelClass,
} from '../types/sequelize-models.types';

// Security incident status enum
enum SecurityIncidentStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

/**
 * Security Monitoring Service
 *
 * Handles all security monitoring operations including:
 * - Login attempt tracking and analysis
 * - Security incident management
 * - Security statistics and reporting
 * - Failed login detection
 */
@Injectable()
export class SecurityMonitoringService {
  private readonly logger = new Logger(SecurityMonitoringService.name);

  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  /**
   * Get Sequelize models dynamically
   */
  private getModel<T>(modelName: string): SequelizeModelClass<T> {
    return this.sequelize.models[modelName];
  }

  // ============================================================================
  // LOGIN ATTEMPT TRACKING
  // ============================================================================

  /**
   * Log a login attempt
   */
  async logLoginAttempt(data: LogLoginAttemptDto): Promise<LoginAttemptInstance | undefined> {
    try {
      const LoginAttempt = this.getModel('LoginAttempt');
      const attempt = await LoginAttempt.create({
        email: data.email,
        success: data.success,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        failureReason: data.failureReason,
      });

      this.logger.log(
        `Logged login attempt for ${data.email}: ${data.success ? 'success' : 'failure'}`,
      );
      return attempt;
    } catch (error) {
      this.logger.error('Error logging login attempt:', error);
      // Don't throw - logging failures shouldn't break login
      return undefined;
    }
  }

  /**
   * Get failed login attempts within a time window
   */
  async getFailedLoginAttempts(
    email: string,
    minutes: number = 15,
  ): Promise<any[]> {
    try {
      const LoginAttempt = this.getModel('LoginAttempt');
      const since = new Date(Date.now() - minutes * 60 * 1000);

      const attempts = await LoginAttempt.findAll({
        where: {
          email,
          success: false,
          createdAt: {
            [Op.gte]: since,
          },
        },
        order: [['createdAt', 'DESC']],
      });

      this.logger.log(
        `Retrieved ${attempts.length} failed login attempts for ${email}`,
      );
      return attempts;
    } catch (error) {
      this.logger.error('Error getting failed login attempts:', error);
      throw error;
    }
  }

  // ============================================================================
  // SECURITY INCIDENT MANAGEMENT
  // ============================================================================

  /**
   * Create a security incident
   */
  async createSecurityIncident(
    data: AccessControlCreateIncidentDto,
  ): Promise<any> {
    try {
      const SecurityIncident = this.getModel('SecurityIncident');
      const incident = await SecurityIncident.create({
        type: data.type,
        severity: data.severity,
        description: data.description,
        affectedResources: data.affectedResources || [],
        detectedBy: data.detectedBy,
        status: SecurityIncidentStatus.OPEN,
      });

      this.logger.warn(
        `Security incident created: ${incident.id} - ${data.type}`,
      );
      return incident;
    } catch (error) {
      this.logger.error('Error creating security incident:', error);
      throw error;
    }
  }

  /**
   * Update security incident
   */
  async updateSecurityIncident(id: string, data: SecurityIncidentUpdateData): Promise<SecurityIncidentInstance> {
    try {
      const SecurityIncident = this.getModel('SecurityIncident');
      const incident = await SecurityIncident.findByPk(id);

      if (!incident) {
        throw new NotFoundException('Security incident not found');
      }

      const updateData: any = {};

      if (data.status) {
        updateData.status = data.status;
      }

      if (data.resolution) {
        updateData.resolution = data.resolution;
      }

      if (data.resolvedBy) {
        updateData.resolvedBy = data.resolvedBy;
      }

      // Automatically set resolvedAt when status changes to RESOLVED
      if (
        data.status === SecurityIncidentStatus.RESOLVED &&
        !incident.resolvedAt
      ) {
        updateData.resolvedAt = new Date();
      }

      await incident.update(updateData);

      this.logger.log(`Updated security incident: ${id}`);
      return incident;
    } catch (error) {
      this.logger.error(`Error updating security incident ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get security incidents with pagination and filters
   */
  async getSecurityIncidents(
    page: number = 1,
    limit: number = 20,
    filters: SecurityIncidentFilters = {},
  ): Promise<{ incidents: SecurityIncidentInstance[]; pagination: PaginationResult }> {
    try {
      const SecurityIncident = this.getModel('SecurityIncident');
      const offset = (page - 1) * limit;
      const whereClause: SecurityIncidentWhereClause = {};

      if (filters.type) {
        whereClause.type = filters.type;
      }

      if (filters.severity) {
        whereClause.severity = filters.severity;
      }

      if (filters.status) {
        whereClause.status = filters.status;
      }

      const { rows: incidents, count: total } =
        await SecurityIncident.findAndCountAll({
          where: whereClause,
          offset,
          limit,
          order: [['createdAt', 'DESC']],
        });

      this.logger.log(`Retrieved ${incidents.length} security incidents`);

      return {
        incidents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Error getting security incidents:', error);
      throw error;
    }
  }

  /**
   * Get security statistics
   */
  async getSecurityStatistics(): Promise<SecurityStatistics> {
    try {
      const SecurityIncident = this.getModel('SecurityIncident');
      const LoginAttempt = this.getModel('LoginAttempt');
      const Session = this.getModel('Session');
      const IpRestriction = this.getModel('IpRestriction');

      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const [
        totalIncidents,
        openIncidents,
        criticalIncidents,
        recentFailedLogins,
        activeSessions,
        activeIpRestrictions,
      ] = await Promise.all([
        SecurityIncident.count(),
        SecurityIncident.count({
          where: { status: SecurityIncidentStatus.OPEN },
        }),
        SecurityIncident.count({
          where: {
            severity: IncidentSeverity.CRITICAL,
            status: {
              [Op.ne]: SecurityIncidentStatus.CLOSED,
            },
          },
        }),
        LoginAttempt.count({
          where: {
            success: false,
            createdAt: {
              [Op.gte]: last24Hours,
            },
          },
        }),
        Session.count({
          where: {
            expiresAt: {
              [Op.gt]: new Date(),
            },
          },
        }),
        IpRestriction.count({
          where: { isActive: true },
        }),
      ]);

      const statistics: SecurityStatistics = {
        incidents: {
          total: totalIncidents,
          open: openIncidents,
          critical: criticalIncidents,
        },
        authentication: {
          recentFailedLogins,
          activeSessions,
        },
        ipRestrictions: activeIpRestrictions,
      };

      this.logger.log('Retrieved security statistics');
      return statistics;
    } catch (error) {
      this.logger.error('Error getting security statistics:', error);
      throw error;
    }
  }
}
