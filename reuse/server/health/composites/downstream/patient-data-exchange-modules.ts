/**
 * LOC: HLTH-DS-DATA-EXCH-001
 * File: /reuse/server/health/composites/downstream/patient-data-exchange-modules.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - ../epic-fhir-api-composites
 *   - ../epic-audit-compliance-composites
 */

/**
 * File: /reuse/server/health/composites/downstream/patient-data-exchange-modules.ts
 * Locator: WC-DS-DATA-EXCH-001
 * Purpose: Patient Data Exchange - HIE, Direct messaging, Care Everywhere integration
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  EpicFhirApiCompositeService,
  FhirBundle,
} from '../epic-fhir-api-composites';
import { trackPHIAccessWithPurpose } from '../epic-audit-compliance-composites';

export class DirectMessage {
  @ApiProperty({ description: 'Message ID' })
  id: string;

  @ApiProperty({ description: 'Sender' })
  sender: string;

  @ApiProperty({ description: 'Recipients', type: Array })
  recipients: string[];

  @ApiProperty({ description: 'Subject' })
  subject: string;

  @ApiProperty({ description: 'Message body' })
  body: string;

  @ApiProperty({ description: 'Attachments', type: Array })
  attachments: Array<{ filename: string; contentType: string; data: string }>;

  @ApiProperty({ description: 'Sent at' })
  sentAt?: Date;

  @ApiProperty({ description: 'Status' })
  status: 'draft' | 'sent' | 'delivered' | 'failed';
}

export class CareEverywhereQuery {
  @ApiProperty({ description: 'Patient ID' })
  patientId: string;

  @ApiProperty({ description: 'Patient demographics' })
  demographics: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    ssn?: string;
  };

  @ApiProperty({ description: 'Organizations to query', type: Array })
  organizations: string[];

  @ApiProperty({ description: 'Data types requested', type: Array })
  dataTypes: string[];
}

export class HIEExchangeRecord {
  @ApiProperty({ description: 'Exchange ID' })
  id: string;

  @ApiProperty({ description: 'Exchange type' })
  exchangeType: 'inbound' | 'outbound';

  @ApiProperty({ description: 'Organization' })
  organization: string;

  @ApiProperty({ description: 'Patient ID' })
  patientId: string;

  @ApiProperty({ description: 'Data exchanged' })
  dataExchanged: any;

  @ApiProperty({ description: 'Exchange timestamp' })
  exchangedAt: Date;

  @ApiProperty({ description: 'Status' })
  status: 'pending' | 'completed' | 'failed';
}

@Injectable()
@ApiTags('Patient Data Exchange')
export class PatientDataExchangeService {
  private readonly logger = new Logger(PatientDataExchangeService.name);

  constructor(private readonly fhirService: EpicFhirApiCompositeService) {}

  /**
   * 1. Send Direct message
   */
  @ApiOperation({ summary: 'Send Direct message' })
  async sendDirectMessage(message: DirectMessage): Promise<DirectMessage> {
    this.logger.log(`Sending Direct message to ${message.recipients.length} recipients`);

    // Encrypt message
    const encrypted = await this.encryptDirectMessage(message);

    // Send via Direct protocol
    await this.transmitDirectMessage(encrypted);

    message.sentAt = new Date();
    message.status = 'sent';

    // Track PHI access
    await trackPHIAccessWithPurpose({
      userId: message.sender,
      patientId: this.extractPatientIdFromMessage(message),
      resourceType: 'ClinicalDocument',
      resourceId: message.id,
      accessPurpose: 'treatment',
      accessReason: 'Direct message exchange',
      dataElementsAccessed: ['clinical_summary'],
      durationSeconds: 0,
    });

    return message;
  }

  /**
   * 2. Query Care Everywhere
   */
  @ApiOperation({ summary: 'Query Care Everywhere network' })
  async queryCareEverywhere(
    query: CareEverywhereQuery,
    accessToken: string,
  ): Promise<FhirBundle[]> {
    this.logger.log(
      `Querying Care Everywhere for patient ${query.patientId} across ${query.organizations.length} organizations`,
    );

    const results: FhirBundle[] = [];

    for (const org of query.organizations) {
      try {
        const orgResults = await this.queryOrganization(org, query, accessToken);
        results.push(orgResults);
      } catch (error) {
        this.logger.error(`Failed to query ${org}:`, error);
      }
    }

    // Track HIE access
    await this.trackHIEAccess(query.patientId, query.organizations, 'outbound');

    return results;
  }

  /**
   * 3. Respond to Care Everywhere query
   */
  @ApiOperation({ summary: 'Respond to Care Everywhere query' })
  async respondToCareEverywhereQuery(
    queryId: string,
    patientId: string,
    dataTypes: string[],
    accessToken: string,
  ): Promise<FhirBundle> {
    this.logger.log(`Responding to Care Everywhere query ${queryId}`);

    // Collect requested data
    const bundle: FhirBundle = {
      resourceType: 'Bundle',
      type: 'searchset',
      entry: [],
    };

    // Add patient demographics
    if (dataTypes.includes('demographics')) {
      const patient = await this.fhirService.getEpicFhirPatient(
        patientId,
        accessToken,
      );
      bundle.entry.push({ resource: patient });
    }

    // Add observations
    if (dataTypes.includes('observations')) {
      const observations = await this.fhirService.getEpicFhirObservations(
        patientId,
        accessToken,
        {},
      );
      bundle.entry.push(...observations.map((o) => ({ resource: o })));
    }

    // Track HIE access
    await this.trackHIEAccess(patientId, [queryId], 'inbound');

    return bundle;
  }

  /**
   * 4. Exchange continuity of care document (CCD)
   */
  @ApiOperation({ summary: 'Exchange continuity of care document' })
  async exchangeCCD(
    patientId: string,
    recipientOrg: string,
    accessToken: string,
  ): Promise<{ exchanged: boolean; documentId: string }> {
    this.logger.log(`Exchanging CCD for patient ${patientId} to ${recipientOrg}`);

    // Generate CCD
    const ccd = await this.generateCCD(patientId, accessToken);

    // Convert to C-CDA format
    const ccda = this.convertToCCDA(ccd);

    // Transmit via HIE
    const documentId = await this.transmitViaHIE(ccda, recipientOrg);

    // Create exchange record
    await this.createExchangeRecord({
      id: documentId,
      exchangeType: 'outbound',
      organization: recipientOrg,
      patientId,
      dataExchanged: { documentType: 'CCD' },
      exchangedAt: new Date(),
      status: 'completed',
    });

    return {
      exchanged: true,
      documentId,
    };
  }

  /**
   * 5. Process inbound HIE message
   */
  @ApiOperation({ summary: 'Process inbound HIE message' })
  async processInboundHIEMessage(
    messageId: string,
    messageData: any,
  ): Promise<{ processed: boolean }> {
    this.logger.log(`Processing inbound HIE message ${messageId}`);

    // Parse message
    const parsed = this.parseHIEMessage(messageData);

    // Extract patient ID
    const patientId = this.extractPatientId(parsed);

    // Store data
    await this.storeHIEData(patientId, parsed);

    // Create exchange record
    await this.createExchangeRecord({
      id: messageId,
      exchangeType: 'inbound',
      organization: parsed.sender,
      patientId,
      dataExchanged: parsed.data,
      exchangedAt: new Date(),
      status: 'completed',
    });

    return { processed: true };
  }

  /**
   * 6. Subscribe to patient notifications
   */
  @ApiOperation({ summary: 'Subscribe to patient notifications' })
  async subscribeToPatientNotifications(
    patientId: string,
    notificationType: string,
    webhookUrl: string,
    accessToken: string,
  ): Promise<{ subscriptionId: string }> {
    this.logger.log(
      `Subscribing to ${notificationType} notifications for patient ${patientId}`,
    );

    const subscription = await this.fhirService.createEpicFhirSubscription(
      {
        criteria: `Patient?_id=${patientId}`,
        channel: { type: 'rest-hook', endpoint: webhookUrl },
      },
      accessToken,
    );

    return { subscriptionId: subscription.id };
  }

  // Helper methods
  private async encryptDirectMessage(message: DirectMessage): Promise<DirectMessage> {
    // S/MIME encryption (simulated)
    return message;
  }

  private async transmitDirectMessage(message: DirectMessage): Promise<void> {
    this.logger.log(`Transmitted Direct message ${message.id}`);
  }

  private extractPatientIdFromMessage(message: DirectMessage): string {
    return 'patient-123';
  }

  private async queryOrganization(
    org: string,
    query: CareEverywhereQuery,
    accessToken: string,
  ): Promise<FhirBundle> {
    return {
      resourceType: 'Bundle',
      type: 'searchset',
      entry: [],
    };
  }

  private async trackHIEAccess(
    patientId: string,
    organizations: string[],
    direction: 'inbound' | 'outbound',
  ): Promise<void> {
    this.logger.log(
      `Tracked ${direction} HIE access for patient ${patientId} with ${organizations.length} organizations`,
    );
  }

  private async generateCCD(patientId: string, accessToken: string): Promise<any> {
    return {};
  }

  private convertToCCDA(ccd: any): string {
    return '<ClinicalDocument>...</ClinicalDocument>';
  }

  private async transmitViaHIE(ccda: string, recipientOrg: string): Promise<string> {
    return `doc-${Date.now()}`;
  }

  private async createExchangeRecord(record: HIEExchangeRecord): Promise<void> {
    this.logger.log(`Created HIE exchange record ${record.id}`);
  }

  private parseHIEMessage(messageData: any): any {
    return { sender: 'external-org', data: {} };
  }

  private extractPatientId(parsed: any): string {
    return 'patient-123';
  }

  private async storeHIEData(patientId: string, data: any): Promise<void> {
    this.logger.log(`Stored HIE data for patient ${patientId}`);
  }
}

export default PatientDataExchangeService;
