/**
 * LOC: HLTH-DS-MYCHART-001
 * File: /reuse/server/health/composites/downstream/epic-mychart-integration.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - ../epic-fhir-api-composites
 *   - ../epic-audit-compliance-composites
 */

/**
 * File: /reuse/server/health/composites/downstream/epic-mychart-integration.ts
 * Locator: WC-DS-MYCHART-001
 * Purpose: Epic MyChart Integration - Patient portal integration services
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  EpicFhirApiCompositeService,
  FhirPatientResource,
} from '../epic-fhir-api-composites';
import { trackPHIAccessWithPurpose } from '../epic-audit-compliance-composites';

export class MyChartActivation {
  @ApiProperty({ description: 'Patient ID' })
  patientId: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ description: 'Phone number' })
  phone: string;

  @ApiProperty({ description: 'Activation code' })
  activationCode: string;

  @ApiProperty({ description: 'Expiration date' })
  expirationDate: Date;

  @ApiProperty({ description: 'Status' })
  status: 'pending' | 'activated' | 'expired';
}

export class MyChartMessage {
  @ApiProperty({ description: 'Message ID' })
  id: string;

  @ApiProperty({ description: 'Patient ID' })
  patientId: string;

  @ApiProperty({ description: 'Provider ID' })
  providerId: string;

  @ApiProperty({ description: 'Subject' })
  subject: string;

  @ApiProperty({ description: 'Message body' })
  body: string;

  @ApiProperty({ description: 'Sent at' })
  sentAt: Date;

  @ApiProperty({ description: 'Read at' })
  readAt?: Date;

  @ApiProperty({ description: 'Status' })
  status: 'unread' | 'read' | 'replied';
}

export class PortalVisit {
  @ApiProperty({ description: 'Visit ID' })
  id: string;

  @ApiProperty({ description: 'Patient ID' })
  patientId: string;

  @ApiProperty({ description: 'Visit type' })
  visitType:
    | 'eVisit'
    | 'video_visit'
    | 'scheduled_appointment'
    | 'on_demand';

  @ApiProperty({ description: 'Provider ID' })
  providerId?: string;

  @ApiProperty({ description: 'Chief complaint' })
  chiefComplaint: string;

  @ApiProperty({ description: 'Visit status' })
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

  @ApiProperty({ description: 'Scheduled time' })
  scheduledTime?: Date;

  @ApiProperty({ description: 'Completed time' })
  completedTime?: Date;
}

@Injectable()
@ApiTags('Epic MyChart Integration')
export class EpicMyChartIntegrationService {
  private readonly logger = new Logger(EpicMyChartIntegrationService.name);

  constructor(private readonly fhirService: EpicFhirApiCompositeService) {}

  /**
   * 1. Activate MyChart account
   */
  @ApiOperation({ summary: 'Activate MyChart account' })
  async activateMyChartAccount(
    patientId: string,
    email: string,
    phone: string,
    accessToken: string,
  ): Promise<MyChartActivation> {
    this.logger.log(`Activating MyChart account for patient ${patientId}`);

    // Verify patient exists in Epic
    const patient = await this.fhirService.getEpicFhirPatient(
      patientId,
      accessToken,
    );

    // Generate activation code
    const activationCode = this.generateActivationCode();

    const activation: MyChartActivation = {
      patientId,
      email,
      phone,
      activationCode,
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      status: 'pending',
    };

    // Send activation email
    await this.sendActivationEmail(activation);

    // Send activation SMS
    await this.sendActivationSMS(activation);

    return activation;
  }

  /**
   * 2. Get MyChart account status
   */
  @ApiOperation({ summary: 'Get MyChart account status' })
  async getMyChartStatus(
    patientId: string,
    accessToken: string,
  ): Promise<{
    hasMyChart: boolean;
    activationDate?: Date;
    lastAccess?: Date;
  }> {
    this.logger.log(`Getting MyChart status for patient ${patientId}`);

    return this.fhirService.getEpicMyChartStatus(patientId, accessToken);
  }

  /**
   * 3. Send message to patient via MyChart
   */
  @ApiOperation({ summary: 'Send message to patient via MyChart' })
  async sendMyChartMessage(
    patientId: string,
    providerId: string,
    subject: string,
    body: string,
  ): Promise<MyChartMessage> {
    this.logger.log(`Sending MyChart message to patient ${patientId}`);

    const message: MyChartMessage = {
      id: `msg-${Date.now()}`,
      patientId,
      providerId,
      subject,
      body,
      sentAt: new Date(),
      status: 'unread',
    };

    // Send via Epic MyChart API
    await this.sendViaMyChartAPI(message);

    // Track PHI access
    await trackPHIAccessWithPurpose({
      userId: providerId,
      patientId,
      resourceType: 'ClinicalDocument',
      resourceId: message.id,
      accessPurpose: 'treatment',
      accessReason: 'MyChart secure messaging',
      dataElementsAccessed: ['messaging'],
      durationSeconds: 0,
    });

    return message;
  }

  /**
   * 4. Get patient messages from MyChart
   */
  @ApiOperation({ summary: 'Get patient messages from MyChart' })
  async getPatientMessages(
    patientId: string,
    status?: 'unread' | 'read' | 'all',
  ): Promise<MyChartMessage[]> {
    this.logger.log(`Getting MyChart messages for patient ${patientId}`);

    // Fetch messages from Epic MyChart
    const messages = await this.fetchMyChartMessages(patientId, status);

    return messages;
  }

  /**
   * 5. Request prescription refill via MyChart
   */
  @ApiOperation({ summary: 'Request prescription refill via MyChart' })
  async requestPrescriptionRefill(
    patientId: string,
    medicationId: string,
    pharmacyId: string,
    accessToken: string,
  ): Promise<{ refillRequestId: string; status: string }> {
    this.logger.log(
      `Processing prescription refill request for patient ${patientId}`,
    );

    // Get medication details
    const medications = await this.fhirService.getEpicFhirMedications(
      patientId,
      accessToken,
    );

    // Create refill request
    const refillRequestId = await this.createRefillRequest(
      patientId,
      medicationId,
      pharmacyId,
    );

    // Notify provider
    await this.notifyProviderOfRefillRequest(patientId, medicationId);

    return {
      refillRequestId,
      status: 'pending_provider_approval',
    };
  }

  /**
   * 6. Schedule eVisit via MyChart
   */
  @ApiOperation({ summary: 'Schedule eVisit via MyChart' })
  async scheduleEVisit(
    patientId: string,
    chiefComplaint: string,
    preferredTime: Date,
  ): Promise<PortalVisit> {
    this.logger.log(`Scheduling eVisit for patient ${patientId}`);

    const visit: PortalVisit = {
      id: `evisit-${Date.now()}`,
      patientId,
      visitType: 'eVisit',
      chiefComplaint,
      status: 'scheduled',
      scheduledTime: preferredTime,
    };

    // Create eVisit questionnaire
    await this.createEVisitQuestionnaire(visit.id, chiefComplaint);

    // Assign to provider
    visit.providerId = await this.assignEVisitProvider(chiefComplaint);

    // Send confirmation
    await this.sendEVisitConfirmation(visit);

    return visit;
  }

  /**
   * 7. Schedule video visit via MyChart
   */
  @ApiOperation({ summary: 'Schedule video visit via MyChart' })
  async scheduleVideoVisit(
    patientId: string,
    providerId: string,
    scheduledTime: Date,
    reason: string,
  ): Promise<PortalVisit> {
    this.logger.log(`Scheduling video visit for patient ${patientId}`);

    const visit: PortalVisit = {
      id: `video-${Date.now()}`,
      patientId,
      providerId,
      visitType: 'video_visit',
      chiefComplaint: reason,
      status: 'scheduled',
      scheduledTime,
    };

    // Generate video meeting link
    const meetingLink = await this.generateVideoMeetingLink(visit);

    // Send calendar invite
    await this.sendVideoVisitInvite(visit, meetingLink);

    return visit;
  }

  /**
   * 8. Access medical records via MyChart
   */
  @ApiOperation({ summary: 'Access medical records via MyChart' })
  async accessMedicalRecords(
    patientId: string,
    recordType: 'visits' | 'labs' | 'medications' | 'immunizations' | 'all',
    accessToken: string,
  ): Promise<any> {
    this.logger.log(
      `Patient ${patientId} accessing medical records via MyChart: ${recordType}`,
    );

    const records: any = {};

    switch (recordType) {
      case 'visits':
      case 'all':
        records.visits = await this.fhirService.getEpicFhirAppointments(
          patientId,
          accessToken,
          {},
        );
        if (recordType !== 'all') break;

      case 'labs':
      case 'all':
        records.labs = await this.fhirService.getEpicFhirObservations(
          patientId,
          accessToken,
          { category: 'laboratory' },
        );
        if (recordType !== 'all') break;

      case 'medications':
      case 'all':
        records.medications = await this.fhirService.getEpicFhirMedications(
          patientId,
          accessToken,
        );
        if (recordType !== 'all') break;

      case 'immunizations':
      case 'all':
        records.immunizations = await this.fhirService.getEpicFhirImmunizations(
          patientId,
          accessToken,
        );
        break;
    }

    // Track patient portal access
    await trackPHIAccessWithPurpose({
      userId: patientId,
      patientId,
      resourceType: 'Patient',
      resourceId: patientId,
      accessPurpose: 'treatment',
      accessReason: 'MyChart patient portal access',
      dataElementsAccessed: [recordType],
      durationSeconds: 0,
    });

    return records;
  }

  // Helper methods
  private generateActivationCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  private async sendActivationEmail(activation: MyChartActivation): Promise<void> {
    this.logger.log(`Sent MyChart activation email to ${activation.email}`);
  }

  private async sendActivationSMS(activation: MyChartActivation): Promise<void> {
    this.logger.log(`Sent MyChart activation SMS to ${activation.phone}`);
  }

  private async sendViaMyChartAPI(message: MyChartMessage): Promise<void> {
    this.logger.log(`Sent MyChart message ${message.id}`);
  }

  private async fetchMyChartMessages(
    patientId: string,
    status?: string,
  ): Promise<MyChartMessage[]> {
    return [];
  }

  private async createRefillRequest(
    patientId: string,
    medicationId: string,
    pharmacyId: string,
  ): Promise<string> {
    return `refill-${Date.now()}`;
  }

  private async notifyProviderOfRefillRequest(
    patientId: string,
    medicationId: string,
  ): Promise<void> {
    this.logger.log(`Notified provider of refill request for patient ${patientId}`);
  }

  private async createEVisitQuestionnaire(
    visitId: string,
    chiefComplaint: string,
  ): Promise<void> {
    this.logger.log(`Created eVisit questionnaire for ${visitId}`);
  }

  private async assignEVisitProvider(chiefComplaint: string): Promise<string> {
    return 'provider-123';
  }

  private async sendEVisitConfirmation(visit: PortalVisit): Promise<void> {
    this.logger.log(`Sent eVisit confirmation for ${visit.id}`);
  }

  private async generateVideoMeetingLink(visit: PortalVisit): Promise<string> {
    return `https://video.whitecross.health/meeting/${visit.id}`;
  }

  private async sendVideoVisitInvite(
    visit: PortalVisit,
    meetingLink: string,
  ): Promise<void> {
    this.logger.log(`Sent video visit invite for ${visit.id}`);
  }
}

export default EpicMyChartIntegrationService;
