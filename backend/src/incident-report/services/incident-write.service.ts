/**
 * @fileoverview Incident Write Service
 * @module incident-report/services/incident-write.service
 * @description Business logic for incident report write operations
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';
import { IncidentReport } from '@/database';
import { CreateIncidentReportDto } from '../dto/create-incident-report.dto';
import { UpdateIncidentReportDto } from '../dto/update-incident-report.dto';
import { IncidentNotificationService } from './incident-notification.service';
import { IncidentValidationService } from './incident-validation.service';

import { BaseService } from '@/common/base';
/**
 * Incident Write Service
 *
 * Handles write operations for incident reports:
 * - Create new incident report
 * - Update existing incident report
 */
@Injectable()
export class IncidentWriteService extends BaseService {
  constructor(
    @InjectModel(IncidentReport)
    private readonly incidentReportModel: typeof IncidentReport,
    private readonly validationService: IncidentValidationService,
    private readonly notificationService: IncidentNotificationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create new incident report
   */
  async createIncidentReport(dto: CreateIncidentReportDto) {
    this.logInfo(`Creating incident report for student: ${dto.studentId}`);

    // Validate incident report data
    await this.validationService.validateIncidentReport(dto);

    const incident = await this.incidentReportModel.create({
      id: uuidv4(),
      studentId: dto.studentId,
      reportedById: dto.reportedById,
      occurredAt: dto.occurredAt,
      type: dto.type,
      severity: dto.severity,
      location: dto.location,
      description: dto.description,
      witnesses: dto.witnesses || [],
      actionsTaken: dto.actionsTaken || [],
      followUpRequired: dto.followUpRequired || false,
      parentNotified: false,
      complianceStatus: 'pending',
      insuranceClaimStatus: 'not_required',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Send notifications
    await this.notificationService.notifyEmergencyContacts(incident);
    await this.notificationService.notifyParent(incident);

    // Emit event
    this.eventEmitter.emit('incident.created', incident);

    return incident;
  }

  /**
   * Update existing incident report
   */
  async updateIncidentReport(id: string, dto: UpdateIncidentReportDto) {
    this.logInfo(`Updating incident report: ${id}`);

    const incident = await this.incidentReportModel.findByPk(id);
    if (!incident) {
      throw new NotFoundException(`Incident report with ID ${id} not found`);
    }

    // Validate update data
    await this.validationService.validateIncidentUpdate(dto);

    const updatedIncident = await incident.update({
      ...dto,
      updatedAt: new Date(),
    });

    // Emit event
    this.eventEmitter.emit('incident.updated', updatedIncident);

    return updatedIncident;
  }
}
