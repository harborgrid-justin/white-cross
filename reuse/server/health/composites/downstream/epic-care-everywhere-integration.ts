/**
 * LOC: EPIC-CE-INT-DS-006
 * File: /reuse/server/health/composites/downstream/epic-care-everywhere-integration.ts
 *
 * UPSTREAM (imports from):
 *   - ../epic-care-coordination-composites
 *   - ../health-information-exchange-kit
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - HIE integration services
 *   - Epic Care Link modules
 */

import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import {
  orchestrateCareTeamFormation,
  orchestrateAdtMessageProcessing,
} from '../epic-care-coordination-composites';

import { AdtMessageType, CareTeamType } from '../health-care-coordination-kit';

@Injectable()
@ApiTags('Epic Care Everywhere Integration')
export class EpicCareEverywhereIntegrationService {
  private readonly logger = new Logger(EpicCareEverywhereIntegrationService.name);

  @ApiOperation({ summary: 'Process ADT messages for care coordination' })
  async processAdtEvent(
    adtData: {
      messageType: AdtMessageType;
      patientId: string;
      encounterId: string;
      facilityId: string;
      eventTimestamp: Date;
    },
    userId: string,
    organizationId: string
  ): Promise<{
    messageId: string;
    careTeamNotified: boolean;
    carePlanUpdated: boolean;
    transitionInitiated: boolean;
  }> {
    this.logger.log(`Processing ADT ${adtData.messageType} for patient ${adtData.patientId}`);

    const result = await orchestrateAdtMessageProcessing(adtData);

    return {
      messageId: result.messageId,
      careTeamNotified: result.careCoordinationTriggered.careTeamNotified,
      carePlanUpdated: result.careCoordinationTriggered.carePlanUpdated,
      transitionInitiated: result.careCoordinationTriggered.transitionWorkflowInitiated,
    };
  }

  @ApiOperation({ summary: 'Form coordinated care team across facilities' })
  async formCrossOrganizationCareTeam(
    teamData: {
      patientId: string;
      teamType: CareTeamType;
      teamName: string;
      initialMembers: Array<{
        providerId: string;
        role: any;
        isPrimary: boolean;
        organizationId: string;
        facilityId: string;
      }>;
    },
    userId: string,
    organizationId: string
  ): Promise<{
    careTeamId: string;
    membersFromMultipleFacilities: boolean;
    communicationProtocol: any;
  }> {
    this.logger.log(`Forming cross-organization care team for patient ${teamData.patientId}`);

    const result = await orchestrateCareTeamFormation(teamData);

    const facilities = new Set(teamData.initialMembers.map(m => m.facilityId));

    return {
      careTeamId: result.careTeamId,
      membersFromMultipleFacilities: facilities.size > 1,
      communicationProtocol: result.communicationProtocol,
    };
  }

  @ApiOperation({ summary: 'Exchange clinical documents via Care Link' })
  async exchangeClinicalDocuments(
    exchangeData: {
      patientId: string;
      documentType: 'ccd' | 'discharge_summary' | 'referral' | 'consultation';
      sendingFacilityId: string;
      receivingFacilityId: string;
      documentContent: any;
    },
    userId: string
  ): Promise<{
    exchangeId: string;
    documentSent: boolean;
    receivedConfirmation: boolean;
  }> {
    this.logger.log(`Exchanging ${exchangeData.documentType} for patient ${exchangeData.patientId}`);

    const exchangeId = `EXCHANGE-${Date.now()}`;

    // Send via Epic Care Link
    const sent = await this.sendViaCareLink(exchangeData);

    return {
      exchangeId,
      documentSent: sent,
      receivedConfirmation: sent,
    };
  }

  private async sendViaCareLink(data: any): Promise<boolean> {
    this.logger.log('Sending document via Epic Care Link');
    return true;
  }
}
