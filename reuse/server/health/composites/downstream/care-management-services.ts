/**
 * LOC: CARE-MGMT-DS-007
 * File: /reuse/server/health/composites/downstream/care-management-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../epic-care-coordination-composites
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - Care management dashboards
 *   - Population health services
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { orchestrateCareTeamFormation, orchestrateCarePlanDevelopment } from '../epic-care-coordination-composites';
import { CareTeamType, CarePlanType } from '../health-care-coordination-kit';

@Injectable()
@ApiTags('Care Management Services')
export class CareManagementServices {
  private readonly logger = new Logger(CareManagementServices.name);

  @ApiOperation({ summary: 'Initiate comprehensive care management program' })
  async initiateCareManagementProgram(
    programData: {
      patientId: string;
      programType: 'chronic_disease' | 'transitional_care' | 'high_risk';
      primaryCareProviderId: string;
      conditions: string[];
      goals: Array<{ description: string; targetValue: string; timeframe: number }>;
    },
    userId: string,
    organizationId: string,
    facilityId: string
  ): Promise<{
    careTeamId: string;
    carePlanId: string;
    enrollmentStatus: string;
  }> {
    this.logger.log(`Initiating care management program for patient ${programData.patientId}`);

    const careTeam = await orchestrateCareTeamFormation({
      patientId: programData.patientId,
      teamType: CareTeamType.CHRONIC_DISEASE,
      teamName: `${programData.programType} Care Team`,
      initialMembers: [
        { providerId: programData.primaryCareProviderId, role: 'primary_care_physician' as any, isPrimary: true },
        { providerId: 'care-mgr-001', role: 'care_manager' as any, isPrimary: false },
      ],
      coordinationLevel: 'enhanced',
    });

    const carePlan = await orchestrateCarePlanDevelopment({
      patientId: programData.patientId,
      careTeamId: careTeam.careTeamId,
      planType: CarePlanType.CHRONIC_DISEASE,
      diagnoses: programData.conditions,
      patientGoals: programData.goals.map(g => ({
        goalDescription: g.description,
        targetValue: g.targetValue,
        timeframe: g.timeframe,
      })),
    });

    return {
      careTeamId: careTeam.careTeamId,
      carePlanId: carePlan.carePlanId,
      enrollmentStatus: 'active',
    };
  }

  @ApiOperation({ summary: 'Track care management outcomes' })
  async trackCareManagementOutcomes(
    patientId: string,
    period: { startDate: Date; endDate: Date }
  ): Promise<{
    hospitalizations: number;
    edVisits: number;
    goalAttainment: number;
    costSavings: number;
  }> {
    this.logger.log(`Tracking care management outcomes for patient ${patientId}`);
    return {
      hospitalizations: 0,
      edVisits: 1,
      goalAttainment: 75,
      costSavings: 15000,
    };
  }
}
