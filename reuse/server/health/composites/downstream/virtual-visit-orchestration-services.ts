/**
 * LOC: EPIC-VIRT-VISIT-DS-002
 * File: /reuse/server/health/composites/downstream/virtual-visit-orchestration-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../epic-telehealth-composites
 *   - ../health-appointment-scheduling-kit
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - Virtual care API controllers
 *   - Appointment scheduling services
 */

/**
 * File: /reuse/server/health/composites/downstream/virtual-visit-orchestration-services.ts
 * Locator: WC-VIRT-VISIT-DS-002
 * Purpose: Virtual Visit Orchestration Services - Complete lifecycle management
 *
 * Upstream: epic-telehealth-composites, health-appointment-scheduling-kit
 * Downstream: API controllers, scheduling services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common
 * Exports: Injectable service for virtual visit orchestration
 *
 * LLM Context: Production-grade virtual visit orchestration service combining appointment
 * scheduling, visit setup, participant management, multi-party conferencing, and session analytics.
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import {
  orchestrateEpicVirtualVisitSetup,
  orchestrateEpicWaitingRoom,
  orchestrateEpicMultiPartyConference,
  orchestrateEpicVisitCompletion,
  orchestrateEpicPatientSurvey,
  EpicTelehealthContext,
} from '../epic-telehealth-composites';

import {
  VisitType,
  VirtualVisitStatus,
  VideoSessionStatus,
  ParticipantRole,
} from '../health-telehealth-kit';

@Injectable()
@ApiTags('Virtual Visit Orchestration')
export class VirtualVisitOrchestrationService {
  private readonly logger = new Logger(VirtualVisitOrchestrationService.name);

  /**
   * Schedule and initialize virtual visit
   * End-to-end workflow from scheduling through setup
   */
  @ApiOperation({ summary: 'Schedule and initialize virtual visit' })
  async scheduleVirtualVisit(
    schedulingData: {
      patientId: string;
      providerId: string;
      visitType: VisitType;
      preferredDateTime: Date;
      reason: string;
      requiresInterpreter?: boolean;
      interpreterLanguage?: string;
    },
    userId: string,
    organizationId: string,
    facilityId: string
  ): Promise<{
    visitId: string;
    scheduledDateTime: Date;
    joinUrls: { patient: string; provider: string };
    status: VirtualVisitStatus;
  }> {
    this.logger.log(`Scheduling virtual visit for patient ${schedulingData.patientId}`);

    try {
      const context: EpicTelehealthContext = {
        userId,
        userRole: 'scheduler',
        facilityId,
        organizationId,
        timestamp: new Date(),
      };

      // Set up virtual visit
      const visitSetup = await orchestrateEpicVirtualVisitSetup(
        {
          patientId: schedulingData.patientId,
          providerId: schedulingData.providerId,
          visitType: schedulingData.visitType,
          scheduledTime: schedulingData.preferredDateTime,
          requiresInterpreter: schedulingData.requiresInterpreter,
          interpreterLanguage: schedulingData.interpreterLanguage,
        },
        context
      );

      // Send appointment confirmation
      await this.sendAppointmentConfirmation(
        schedulingData.patientId,
        visitSetup.virtualVisit.id,
        schedulingData.preferredDateTime,
        visitSetup.joinUrl.patient
      );

      return {
        visitId: visitSetup.virtualVisit.id,
        scheduledDateTime: schedulingData.preferredDateTime,
        joinUrls: visitSetup.joinUrl,
        status: visitSetup.virtualVisit.status,
      };
    } catch (error) {
      this.logger.error(`Virtual visit scheduling failed: ${error.message}`);
      throw new BadRequestException(`Failed to schedule virtual visit: ${error.message}`);
    }
  }

  /**
   * Orchestrate multi-party virtual conference
   * For care team meetings or family conferences
   */
  @ApiOperation({ summary: 'Orchestrate multi-party virtual conference' })
  async orchestrateMultiPartyConference(
    conferenceData: {
      visitId: string;
      hostId: string;
      participants: Array<{
        participantId: string;
        role: ParticipantRole;
        name: string;
        email?: string;
      }>;
      maxParticipants: number;
      purpose: string;
    },
    userId: string,
    organizationId: string,
    facilityId: string
  ): Promise<{
    sessionId: string;
    participantLinks: Map<string, string>;
    status: VideoSessionStatus;
  }> {
    this.logger.log(`Creating multi-party conference for visit ${conferenceData.visitId}`);

    try {
      const context: EpicTelehealthContext = {
        userId,
        userRole: 'provider',
        facilityId,
        organizationId,
        timestamp: new Date(),
      };

      const conference = await orchestrateEpicMultiPartyConference(
        {
          visitId: conferenceData.visitId,
          hostId: conferenceData.hostId,
          participants: conferenceData.participants.map(p => ({
            participantId: p.participantId,
            role: p.role,
          })),
          maxParticipants: conferenceData.maxParticipants,
        },
        context
      );

      // Generate join links for all participants
      const participantLinks = new Map<string, string>();
      conferenceData.participants.forEach(p => {
        const link = `https://epic.whitecross.com/conference/${conference.id}?participant=${p.participantId}`;
        participantLinks.set(p.participantId, link);
      });

      // Send invitations
      await this.sendConferenceInvitations(conferenceData.participants, participantLinks);

      return {
        sessionId: conference.id,
        participantLinks,
        status: conference.status,
      };
    } catch (error) {
      this.logger.error(`Multi-party conference creation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Complete visit and collect patient feedback
   */
  @ApiOperation({ summary: 'Complete visit and collect patient feedback' })
  async completeVisitWithFeedback(
    visitId: string,
    sessionId: string,
    completionData: {
      clinicalNote: any;
      prescriptions?: any[];
      followUpRequired: boolean;
      followUpDays?: number;
    },
    userId: string,
    organizationId: string,
    facilityId: string
  ): Promise<{
    completedAt: Date;
    surveyId: string;
    surveyLink: string;
  }> {
    this.logger.log(`Completing visit ${visitId} with patient feedback`);

    try {
      const context: EpicTelehealthContext = {
        userId,
        userRole: 'provider',
        facilityId,
        organizationId,
        timestamp: new Date(),
      };

      // Complete visit
      const completion = await orchestrateEpicVisitCompletion(
        {
          visitId,
          sessionId,
          clinicalNote: completionData.clinicalNote,
          prescriptions: completionData.prescriptions,
          followUpRequired: completionData.followUpRequired,
          followUpDays: completionData.followUpDays,
        },
        context
      );

      // Send satisfaction survey
      const survey = await orchestrateEpicPatientSurvey(
        visitId,
        {
          overallSatisfaction: 0, // To be filled by patient
          videoQuality: 0,
          audioQuality: 0,
          easeOfUse: 0,
          providerCommunication: 0,
          wouldRecommend: true,
        },
        context
      );

      const surveyLink = `https://mychart.whitecross.com/survey/${survey.surveyId}`;

      // Send survey link to patient
      await this.sendSurveyToPatient(completion.virtualVisit.patientId, surveyLink);

      return {
        completedAt: completion.completedAt,
        surveyId: survey.surveyId,
        surveyLink,
      };
    } catch (error) {
      this.logger.error(`Visit completion failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cancel or reschedule virtual visit
   */
  @ApiOperation({ summary: 'Cancel or reschedule virtual visit' })
  async cancelOrRescheduleVisit(
    visitId: string,
    action: 'cancel' | 'reschedule',
    newDateTime?: Date,
    reason?: string,
    userId?: string,
    organizationId?: string,
    facilityId?: string
  ): Promise<{
    visitId: string;
    action: string;
    newDateTime?: Date;
    confirmationSent: boolean;
  }> {
    this.logger.log(`${action} virtual visit ${visitId}`);

    try {
      if (action === 'cancel') {
        // Cancel visit
        await this.cancelVisit(visitId, reason || 'No reason provided');
      } else if (action === 'reschedule' && newDateTime) {
        // Reschedule visit
        await this.rescheduleVisit(visitId, newDateTime, reason);
      }

      return {
        visitId,
        action,
        newDateTime,
        confirmationSent: true,
      };
    } catch (error) {
      this.logger.error(`Visit ${action} failed: ${error.message}`);
      throw error;
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async sendAppointmentConfirmation(
    patientId: string,
    visitId: string,
    dateTime: Date,
    joinLink: string
  ): Promise<void> {
    this.logger.log(`Sending appointment confirmation to patient ${patientId}`);
    // Implementation would send email/SMS with visit details and join link
  }

  private async sendConferenceInvitations(
    participants: any[],
    links: Map<string, string>
  ): Promise<void> {
    this.logger.log(`Sending conference invitations to ${participants.length} participants`);
    // Implementation would send invitation emails with join links
  }

  private async sendSurveyToPatient(patientId: string, surveyLink: string): Promise<void> {
    this.logger.log(`Sending satisfaction survey to patient ${patientId}`);
    // Implementation would send survey link via email/SMS
  }

  private async cancelVisit(visitId: string, reason: string): Promise<void> {
    this.logger.log(`Cancelling visit ${visitId}: ${reason}`);
    // Implementation would update visit status and notify participants
  }

  private async rescheduleVisit(visitId: string, newDateTime: Date, reason?: string): Promise<void> {
    this.logger.log(`Rescheduling visit ${visitId} to ${newDateTime}`);
    // Implementation would update visit schedule and notify participants
  }
}
