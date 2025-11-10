/**
 * LOC: EPIC-VIDEO-DS-004
 * File: /reuse/server/health/composites/downstream/video-session-management-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../epic-telehealth-composites
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - WebRTC signaling servers
 *   - Video quality monitoring services
 */

import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import {
  orchestrateEpicVideoSession,
  orchestrateEpicSecureChat,
  orchestrateEpicScreenSharing,
  orchestrateEpicBandwidthCheck,
  EpicTelehealthContext,
} from '../epic-telehealth-composites';

import { ParticipantRole } from '../health-telehealth-kit';

@Injectable()
@ApiTags('Video Session Management')
export class VideoSessionManagementService {
  private readonly logger = new Logger(VideoSessionManagementService.name);

  @ApiOperation({ summary: 'Initiate video session with quality monitoring' })
  async initiateVideoSession(
    sessionData: {
      visitId: string;
      patientId: string;
      providerId: string;
      encryptionEnabled?: boolean;
    },
    userId: string,
    organizationId: string,
    facilityId: string
  ): Promise<{
    sessionId: string;
    webrtcConfig: any;
    qualityMetrics: any;
  }> {
    this.logger.log(`Initiating video session for visit ${sessionData.visitId}`);

    const context: EpicTelehealthContext = {
      userId,
      userRole: 'provider',
      facilityId,
      organizationId,
      timestamp: new Date(),
    };

    const session = await orchestrateEpicVideoSession(sessionData, context);
    const bandwidthCheck = await orchestrateEpicBandwidthCheck(session.id, context);

    return {
      sessionId: session.id,
      webrtcConfig: {
        iceServers: [{ urls: 'stun:stun.epic.com:3478' }],
        encryptionType: session.encryptionType,
      },
      qualityMetrics: {
        bandwidth: bandwidthCheck.downloadSpeed,
        latency: bandwidthCheck.latency,
        quality: bandwidthCheck.connectionQuality,
      },
    };
  }

  @ApiOperation({ summary: 'Manage secure chat during video session' })
  async manageChatMessages(
    messageData: {
      sessionId: string;
      senderId: string;
      senderRole: ParticipantRole;
      messageText: string;
    },
    userId: string,
    organizationId: string,
    facilityId: string
  ): Promise<{ messageId: string; encrypted: boolean }> {
    const context: EpicTelehealthContext = {
      userId,
      userRole: 'provider',
      facilityId,
      organizationId,
      timestamp: new Date(),
    };

    const message = await orchestrateEpicSecureChat(messageData, context);
    return { messageId: message.id, encrypted: message.encrypted };
  }

  @ApiOperation({ summary: 'Enable screen sharing with privacy controls' })
  async enableScreenSharing(
    screenShareData: {
      sessionId: string;
      sharerId: string;
      sharerRole: ParticipantRole;
      privacyMode: 'full' | 'window' | 'application';
    },
    userId: string,
    organizationId: string,
    facilityId: string
  ): Promise<{ screenShareId: string; active: boolean }> {
    const context: EpicTelehealthContext = {
      userId,
      userRole: 'provider',
      facilityId,
      organizationId,
      timestamp: new Date(),
    };

    const screenShare = await orchestrateEpicScreenSharing(screenShareData, context);
    return { screenShareId: screenShare.id, active: screenShare.active };
  }
}
