/**
 * @fileoverview Incident Status Service
 * @module incident-report/services/incident-status.service
 * @description Business logic for incident report status updates
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IncidentReport } from '@/database';
import { IncidentNotificationService } from './incident-notification.service';

import { BaseService } from '@/common/base';
/**
 * Incident Status Service
 *
 * Handles status update operations for incident reports:
 * - Add follow-up notes
 * - Mark parent notified
 * - Add evidence
 * - Update insurance claim status
 * - Update compliance status
 * - Notify emergency contacts
 * - Notify parent
 */
@Injectable()
export class IncidentStatusService extends BaseService {
  constructor(
    @InjectModel(IncidentReport)
    private readonly incidentReportModel: typeof IncidentReport,
    private readonly notificationService: IncidentNotificationService,
  ) {}

  /**
   * Add follow-up notes to incident report
   */
  async addFollowUpNotes(id: string, notes: string) {
    this.logInfo(`Adding follow-up notes to incident: ${id}`);

    const incident = await this.incidentReportModel.findByPk(id);
    if (!incident) {
      throw new NotFoundException(`Incident report with ID ${id} not found`);
    }

    const updatedNotes = incident.followUpNotes
      ? `${incident.followUpNotes}\n\n${new Date().toISOString()}: ${notes}`
      : `${new Date().toISOString()}: ${notes}`;

    return incident.update({
      followUpNotes: updatedNotes,
      updatedAt: new Date(),
    });
  }

  /**
   * Mark parent as notified
   */
  async markParentNotified(id: string) {
    this.logInfo(`Marking parent as notified for incident: ${id}`);

    const incident = await this.incidentReportModel.findByPk(id);
    if (!incident) {
      throw new NotFoundException(`Incident report with ID ${id} not found`);
    }

    return incident.update({
      parentNotified: true,
      updatedAt: new Date(),
    });
  }

  /**
   * Add evidence to incident report
   */
  async addEvidence(id: string, evidence: string[]) {
    this.logInfo(`Adding evidence to incident: ${id}`);

    const incident = await this.incidentReportModel.findByPk(id);
    if (!incident) {
      throw new NotFoundException(`Incident report with ID ${id} not found`);
    }

    const currentEvidence = incident.evidence || [];
    const updatedEvidence = [...currentEvidence, ...evidence];

    return incident.update({
      evidence: updatedEvidence,
      updatedAt: new Date(),
    });
  }

  /**
   * Update insurance claim status
   */
  async updateInsuranceClaim(id: string, status: string, claimNumber?: string) {
    this.logInfo(`Updating insurance claim for incident: ${id}`);

    const incident = await this.incidentReportModel.findByPk(id);
    if (!incident) {
      throw new NotFoundException(`Incident report with ID ${id} not found`);
    }

    const updateData: any = {
      insuranceClaimStatus: status,
      updatedAt: new Date(),
    };

    if (claimNumber) {
      updateData.insuranceClaimNumber = claimNumber;
    }

    return incident.update(updateData);
  }

  /**
   * Update compliance status
   */
  async updateComplianceStatus(id: string, status: string, notes?: string) {
    this.logInfo(`Updating compliance status for incident: ${id}`);

    const incident = await this.incidentReportModel.findByPk(id);
    if (!incident) {
      throw new NotFoundException(`Incident report with ID ${id} not found`);
    }

    const updateData: any = {
      complianceStatus: status,
      updatedAt: new Date(),
    };

    if (notes) {
      updateData.complianceNotes = notes;
    }

    return incident.update(updateData);
  }

  /**
   * Notify emergency contacts
   */
  async notifyEmergencyContacts(id: string) {
    this.logInfo(`Notifying emergency contacts for incident: ${id}`);

    const incident = await this.incidentReportModel.findByPk(id);
    if (!incident) {
      throw new NotFoundException(`Incident report with ID ${id} not found`);
    }

    await this.notificationService.notifyEmergencyContacts(incident);
    return { message: 'Emergency contacts notified successfully' };
  }

  /**
   * Notify parent
   */
  async notifyParent(id: string, message?: string) {
    this.logInfo(`Notifying parent for incident: ${id}`);

    const incident = await this.incidentReportModel.findByPk(id);
    if (!incident) {
      throw new NotFoundException(`Incident report with ID ${id} not found`);
    }

    await this.notificationService.notifyParent(incident, message);
    return { message: 'Parent notified successfully' };
  }
}
