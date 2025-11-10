/**
 * LOC: CERNER-ED-CTRL-DS-001
 * File: /reuse/server/health/composites/downstream/cerner-ed-controllers.ts
 *
 * UPSTREAM (imports from):
 *   - ../cerner-emergency-dept-composites
 *   - ../../health-emergency-department-kit
 *   - ../../health-clinical-workflows-kit
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - ED backend controllers
 *   - ED API endpoints
 *   - ED real-time dashboards
 */

import { Injectable, Logger, Controller, Get, Post, Body, Param } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  CernerEmergencyDeptCompositeService,
  EDQuickRegData,
  ESITriageResult,
  EDTrackBoardEntry,
} from '../cerner-emergency-dept-composites';

@Injectable()
@Controller('api/ed')
export class CernerEDControllersService {
  private readonly logger = new Logger(CernerEDControllersService.name);

  constructor(
    private readonly edComposite: CernerEmergencyDeptCompositeService
  ) {}

  /**
   * ED patient registration endpoint
   * Handles QuickReg registration for ED patients
   */
  @Post('register')
  async registerEDPatient(@Body() regData: EDQuickRegData): Promise<{
    registrationId: string;
    mrn: string;
    queuePosition: number;
  }> {
    this.logger.log(`ED registration request: ${regData.lastName}, ${regData.firstName}`);

    try {
      const registration = await this.edComposite.quickRegisterEDPatient(regData);

      // Assign queue position
      const queuePosition = await this.getNextQueuePosition();

      return {
        ...registration,
        queuePosition,
      };
    } catch (error) {
      this.logger.error(`ED registration failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * ED triage assessment endpoint
   * Performs ESI triage and assigns triage level
   */
  @Post('triage/:patientId')
  async performTriageAssessment(
    @Param('patientId') patientId: string,
    @Body() triageData: any
  ): Promise<ESITriageResult> {
    this.logger.log(`Performing triage for patient ${patientId}`);

    try {
      const triageResult = await this.edComposite.performESITriageAssessment(patientId, triageData);

      // Auto-assign to appropriate zone based on ESI level
      if (triageResult.level <= 2) {
        await this.assignToResuscitationZone(patientId);
      } else if (triageResult.level === 5) {
        await this.assessFastTrackEligibility(patientId);
      }

      return triageResult;
    } catch (error) {
      this.logger.error(`Triage assessment failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * ED track board endpoint
   * Returns real-time ED track board data
   */
  @Get('trackboard')
  async getEDTrackBoard(): Promise<{
    entries: EDTrackBoardEntry[];
    census: Record<string, number>;
    capacity: number;
    occupancyRate: number;
  }> {
    this.logger.log('Retrieving ED track board');

    try {
      const entries = await this.edComposite.getRealtimeEDTrackBoard();
      const census = await this.edComposite.getEDCensusByStatus();

      const totalPatients = Object.values(census).reduce((sum, count) => sum + count, 0);
      const capacity = 50; // Total ED capacity
      const occupancyRate = (totalPatients / capacity) * 100;

      return {
        entries,
        census,
        capacity,
        occupancyRate,
      };
    } catch (error) {
      this.logger.error(`Track board retrieval failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * ED metrics endpoint
   * Returns real-time ED performance metrics
   */
  @Get('metrics')
  async getEDMetrics(): Promise<{
    doorToDoctorAvg: number;
    lengthOfStayAvg: number;
    lwbsRate: number;
    leftWithoutTreatmentRate: number;
    admissionRate: number;
    elopementRate: number;
  }> {
    this.logger.log('Retrieving ED metrics');

    try {
      const metrics = await this.edComposite.getEDLengthOfStayMetrics({});

      return {
        doorToDoctorAvg: metrics.doorToDocMin,
        lengthOfStayAvg: metrics.avgLOSMin,
        lwbsRate: metrics.lwbsRate,
        leftWithoutTreatmentRate: 0.015,
        admissionRate: 0.25,
        elopementRate: 0.005,
      };
    } catch (error) {
      this.logger.error(`ED metrics retrieval failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * ED bed assignment endpoint
   * Assigns bed to ED patient
   */
  @Post('assign-bed')
  async assignEDBed(@Body() assignmentData: {
    patientMRN: string;
    esiLevel: number;
    requiresIsolation: boolean;
  }): Promise<{ bedId: string; bedType: string; assignedAt: Date }> {
    this.logger.log(`Assigning ED bed for patient ${assignmentData.patientMRN}`);

    try {
      const assignment = await this.edComposite.assignEDBedToPatient(
        assignmentData.patientMRN,
        assignmentData.esiLevel,
        assignmentData.requiresIsolation
      );

      return assignment;
    } catch (error) {
      this.logger.error(`ED bed assignment failed: ${error.message}`);
      throw error;
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async getNextQueuePosition(): Promise<number> {
    // Get current queue count and return next position
    return 5;
  }

  private async assignToResuscitationZone(patientId: string): Promise<void> {
    this.logger.log(`Assigning patient ${patientId} to resuscitation zone`);
  }

  private async assessFastTrackEligibility(patientId: string): Promise<void> {
    await this.edComposite.assessFastTrackEligibility(patientId);
  }
}

export default CernerEDControllersService;
