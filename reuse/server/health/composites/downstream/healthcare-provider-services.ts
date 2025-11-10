/**
 * LOC: HC-PROV-SERV-DS-013
 * File: /reuse/server/health/composites/downstream/healthcare-provider-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../epic-clinical-workflows-composites
 *   - ../health-provider-management-kit
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - Provider credentialing services
 *   - Scheduling services
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  orchestrateCareTeamCoordination,
  orchestrateReferralWorkflow,
} from '../epic-clinical-workflows-composites';

@Injectable()
@ApiTags('Healthcare Provider Services')
export class HealthcareProviderServices {
  private readonly logger = new Logger(HealthcareProviderServices.name);

  @ApiOperation({ summary: 'Manage provider credentialing and privileges' })
  async manageProviderCredentialing(
    providerData: {
      providerId: string;
      credentials: string[];
      specialties: string[];
      licenses: Array<{ state: string; number: string; expiry: Date }>;
      privileges: string[];
    }
  ): Promise<{
    credentialingStatus: string;
    privilegesGranted: string[];
    expiringCredentials: string[];
  }> {
    this.logger.log(`Managing credentialing for provider ${providerData.providerId}`);

    const expiringCredentials = providerData.licenses
      .filter(l => {
        const daysToExpiry = (l.expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        return daysToExpiry < 90;
      })
      .map(l => `${l.state} license expires ${l.expiry.toDateString()}`);

    return {
      credentialingStatus: 'active',
      privilegesGranted: providerData.privileges,
      expiringCredentials,
    };
  }

  @ApiOperation({ summary: 'Coordinate multi-disciplinary care team' })
  async coordinateCareTeam(
    patientId: string,
    teamData: {
      teamName: string;
      members: Array<{
        providerId: string;
        role: string;
        isPrimary: boolean;
      }>;
    },
    context: any
  ): Promise<{ careTeamId: string; memberCount: number; coordinationProtocol: any }> {
    this.logger.log(`Coordinating care team for patient ${patientId}`);

    const careTeam = await orchestrateCareTeamCoordination(
      patientId,
      teamData,
      context
    );

    return {
      careTeamId: careTeam.id,
      memberCount: careTeam.members.length,
      coordinationProtocol: careTeam.metadata,
    };
  }

  @ApiOperation({ summary: 'Process specialty referral' })
  async processSpecialtyReferral(
    patientId: string,
    referralData: {
      specialtyType: string;
      referralReason: string;
      urgency: 'routine' | 'urgent' | 'stat';
      referringProviderId: string;
    },
    context: any
  ): Promise<{ referralId: string; status: string; estimatedWaitDays: number }> {
    this.logger.log(`Processing specialty referral for patient ${patientId}`);

    const referral = await orchestrateReferralWorkflow(
      patientId,
      referralData,
      context
    );

    return {
      referralId: referral.id,
      status: referral.status,
      estimatedWaitDays: 14,
    };
  }
}
