import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { SecurityIncident, IpRestriction } from '@/database/models';
import { IncidentSeverity } from '../enums/incident-severity.enum';
import { IncidentStatus } from '../enums/incident-status.enum';
import { IpRestrictionType } from '../enums/ip-restriction-type.enum';
import { IncidentResponse } from '../interfaces/incident-response.interface';
import { IncidentFilterDto } from '../dto/security-incident.dto';
import { SecurityCreateIncidentDto } from '../dto/security-incident.dto';
import { UpdateIncidentStatusDto } from '../dto/security-incident.dto';

import { BaseService } from '@/common/base';
/**
 * Security Incident Service
 * Handles detection, logging, and response to security incidents
 */
@Injectable()
export class SecurityIncidentService extends BaseService {
  constructor(
    @InjectModel(SecurityIncident)
    private readonly incidentModel: typeof SecurityIncident,
    @InjectModel(IpRestriction)
    private readonly ipRestrictionModel: typeof IpRestriction,
  ) {
    super("SecurityIncidentService");
  }

  // Alias for backward compatibility
  private get incidentRepo() {
    return this.incidentModel;
  }

  private get ipRestrictionRepo() {
    return this.ipRestrictionModel;
  }

  /**
   * Report a security incident
   */
  async reportIncident(dto: SecurityCreateIncidentDto): Promise<SecurityIncidentEntity> {
    try {
      const incident = await this.incidentModel.create({
        ...dto,
        status: IncidentStatus.DETECTED,
      });

      this.logError('Security incident reported', {
        incidentId: incident.id,
        type: incident.type,
        severity: incident.severity,
      });

      // Auto-respond based on severity
      await this.autoRespond(incident);

      return incident;
    } catch (error) {
      this.logError('Error reporting security incident', { error });
      throw error;
    }
  }

  /**
   * Auto-respond to incidents based on severity
   */
  private async autoRespond(incident: SecurityIncidentEntity): Promise<IncidentResponse> {
    const actionsTaken: string[] = [];
    const notificationsSent: string[] = [];
    const systemChanges: string[] = [];

    try {
      switch (incident.severity) {
        case IncidentSeverity.CRITICAL:
          // Immediate actions for critical incidents
          if (incident.ipAddress) {
            // Add IP to temporary blacklist
            await this.addTemporaryBlacklist(incident.ipAddress, incident.id);
            actionsTaken.push('IP address added to blacklist');
            systemChanges.push('IP restriction added');
          }

          // Notify security team immediately
          await this.notifySecurityTeam(incident, 'URGENT');
          notificationsSent.push('Security team alerted (URGENT)');
          break;

        case IncidentSeverity.HIGH:
          // Actions for high severity incidents
          if (incident.ipAddress) {
            // Log for monitoring
            actionsTaken.push('IP address flagged for monitoring');
          }

          // Notify security team
          await this.notifySecurityTeam(incident, 'HIGH');
          notificationsSent.push('Security team alerted');
          break;

        case IncidentSeverity.MEDIUM:
          // Log and monitor
          actionsTaken.push('Incident logged for monitoring');

          // Notify if pattern detected
          const patternDetected = await this.checkIncidentPattern(incident);
          if (patternDetected) {
            await this.notifySecurityTeam(incident, 'PATTERN_DETECTED');
            notificationsSent.push('Security team alerted (pattern detected)');
          }
          break;

        case IncidentSeverity.LOW:
          // Log only
          actionsTaken.push('Incident logged');
          break;
      }

      this.logInfo('Auto-response executed', {
        incidentId: incident.id,
        actionsTaken,
        notificationsSent,
        systemChanges,
      });

      return {
        incident,
        actionsTaken,
        notificationsSent,
        systemChanges,
      };
    } catch (error) {
      this.logError('Error in auto-response', {
        error,
        incidentId: incident.id,
      });
      return {
        incident,
        actionsTaken: ['Error during auto-response'],
        notificationsSent: [],
        systemChanges: [],
      };
    }
  }

  /**
   * Add temporary IP blacklist
   */
  private async addTemporaryBlacklist(ipAddress: string, incidentId: string): Promise<void> {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour temporary block

      const restriction = await this.ipRestrictionModel.create({
        type: IpRestrictionType.BLACKLIST,
        ipAddress,
        reason: `Automatic blacklist due to security incident ${incidentId}`,
        createdBy: 'system',
        expiresAt,
        isActive: true,
      });
      this.logWarning('Temporary IP blacklist added', {
        ipAddress,
        incidentId,
        expiresAt,
      });
    } catch (error) {
      this.logError('Error adding temporary blacklist', {
        error,
        ipAddress,
      });
    }
  }

  /**
   * Notify security team
   */
  private async notifySecurityTeam(
    incident: SecurityIncidentEntity,
    urgency: string,
  ): Promise<void> {
    try {
      // In production, send email/SMS to security team
      // Use communication service for multi-channel alerts

      this.logWarning('Security team notified', {
        incidentId: incident.id,
        urgency,
        type: incident.type,
        severity: incident.severity,
      });
    } catch (error) {
      this.logError('Error notifying security team', { error });
    }
  }

  /**
   * Check for incident patterns
   */
  private async checkIncidentPattern(incident: SecurityIncidentEntity): Promise<boolean> {
    try {
      // Check for similar incidents in the last hour
      const oneHourAgo = new Date(Date.now() - 3600000);

      const similarIncidents = await this.incidentModel.count({
        where: {
          type: incident.type,
          detectedAt: {
            [Op.between]: [oneHourAgo, new Date()],
          },
        },
      });

      // If more than 3 similar incidents in the last hour, consider it a pattern
      return similarIncidents > 3;
    } catch (error) {
      this.logError('Error checking incident pattern', { error });
      return false;
    }
  }

  /**
   * Get all incidents
   */
  async getAllIncidents(filters?: IncidentFilterDto): Promise<SecurityIncidentEntity[]> {
    try {
      const where: any = {};

      if (filters) {
        if (filters.type) where.type = filters.type;
        if (filters.severity) where.severity = filters.severity;
        if (filters.status) where.status = filters.status;
        if (filters.userId) where.userId = filters.userId;

        if (filters.startDate && filters.endDate) {
          where.detectedAt = {
            [Op.between]: [new Date(filters.startDate), new Date(filters.endDate)],
          };
        }
      }

      return await this.incidentModel.findAll({
        where,
        order: [['detectedAt', 'DESC']],
        limit: 100,
      });
    } catch (error) {
      this.logError('Error fetching incidents', { error });
      return [];
    }
  }

  /**
   * Get incident by ID
   */
  async getIncidentById(id: string): Promise<SecurityIncidentEntity | null> {
    try {
      return await this.incidentModel.findByPk(id);
    } catch (error) {
      this.logError('Error fetching incident', { error, id });
      return null;
    }
  }

  /**
   * Update incident status
   */
  async updateIncidentStatus(
    incidentId: string,
    dto: UpdateIncidentStatusDto,
  ): Promise<SecurityIncidentEntity | null> {
    try {
      const incident = await this.incidentModel.findByPk(incidentId);

      if (!incident) {
        this.logWarning('Incident not found', { incidentId });
        return null;
      }

      Object.assign(incident, dto);

      if (dto.status === IncidentStatus.RESOLVED && !incident.resolvedAt) {
        incident.resolvedAt = new Date();
      }

      await incident.save();

      this.logInfo('Incident status updated', {
        incidentId,
        status: dto.status,
        hasResolution: !!dto.resolution,
      });

      return incident;
    } catch (error) {
      this.logError('Error updating incident status', {
        error,
        incidentId,
      });
      return null;
    }
  }

  /**
   * Generate incident report
   */
  async generateIncidentReport(
    startDate: Date,
    endDate: Date,
  ): Promise<{
    totalIncidents: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    byStatus: Record<string, number>;
    criticalIncidents: SecurityIncidentEntity[];
  }> {
    try {
      const incidents = await this.incidentModel.findAll({
        where: {
          detectedAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      const byType: Record<string, number> = {};
      const bySeverity: Record<string, number> = {};
      const byStatus: Record<string, number> = {};

      incidents.forEach((incident) => {
        byType[incident.type] = (byType[incident.type] || 0) + 1;
        bySeverity[incident.severity] = (bySeverity[incident.severity] || 0) + 1;
        byStatus[incident.status] = (byStatus[incident.status] || 0) + 1;
      });

      const criticalIncidents = incidents.filter((i) => i.severity === IncidentSeverity.CRITICAL);

      this.logInfo('Incident report generated', {
        startDate,
        endDate,
        totalIncidents: incidents.length,
      });

      return {
        totalIncidents: incidents.length,
        byType,
        bySeverity,
        byStatus,
        criticalIncidents,
      };
    } catch (error) {
      this.logError('Error generating incident report', { error });
      throw error;
    }
  }

  /**
   * Get incident statistics
   */
  async getIncidentStatistics(): Promise<{
    last24Hours: number;
    last7Days: number;
    last30Days: number;
    criticalUnresolved: number;
    highUnresolved: number;
  }> {
    try {
      const now = new Date();
      const day24Ago = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const days7Ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const days30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [last24Hours, last7Days, last30Days, criticalUnresolved, highUnresolved] =
        await Promise.all([
          this.incidentModel.count({
            where: { detectedAt: { [Op.between]: [day24Ago, now] } },
          }),
          this.incidentModel.count({
            where: { detectedAt: { [Op.between]: [days7Ago, now] } },
          }),
          this.incidentModel.count({
            where: { detectedAt: { [Op.between]: [days30Ago, now] } },
          }),
          this.incidentModel.count({
            where: {
              severity: IncidentSeverity.CRITICAL,
              status: IncidentStatus.DETECTED,
            },
          }),
          this.incidentModel.count({
            where: {
              severity: IncidentSeverity.HIGH,
              status: IncidentStatus.DETECTED,
            },
          }),
        ]);

      return {
        last24Hours,
        last7Days,
        last30Days,
        criticalUnresolved,
        highUnresolved,
      };
    } catch (error) {
      this.logError('Error getting incident statistics', { error });
      throw error;
    }
  }
}
