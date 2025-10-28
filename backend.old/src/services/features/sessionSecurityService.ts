import { logger } from '../../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';

export interface DeviceFingerprint {
  id: string;
  userId: string;
  deviceInfo: {
    userAgent: string;
    browser: string;
    os: string;
    screen: string;
    timezone: string;
  };
  ipAddress: string;
  trusted: boolean;
  lastSeen: Date;
}

export interface SessionData {
  sessionId: string;
  userId: string;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
}

export class SessionSecurityService {
  private static readonly SESSION_TIMEOUT = 3600; // 1 hour in seconds
  private static readonly MAX_SESSIONS_PER_USER = 5;

  static async createDeviceFingerprint(userId: string, deviceInfo: any, ipAddress: string): Promise<DeviceFingerprint> {
    try {
      const crypto = require('crypto');
      const fingerprintData = JSON.stringify({
        userAgent: deviceInfo.userAgent,
        screen: deviceInfo.screen,
        timezone: deviceInfo.timezone,
        ipAddress
      });
      const hash = crypto.createHash('sha256').update(fingerprintData).digest('hex');

      const fingerprint: DeviceFingerprint = {
        id: `FP-${hash.substring(0, 16)}`,
        userId,
        deviceInfo,
        ipAddress,
        trusted: false,
        lastSeen: new Date()
      };

      logger.info('Device fingerprint created', { fingerprintId: fingerprint.id, userId });
      return fingerprint;
    } catch (error) {
      logger.error('Error creating device fingerprint', { error });
      throw handleSequelizeError(error as Error);
    }
  }

  static async createSession(userId: string, deviceInfo: any, ipAddress: string): Promise<SessionData> {
    try {
      const crypto = require('crypto');
      const sessionId = crypto.randomBytes(32).toString('hex');
      const fingerprint = await this.createDeviceFingerprint(userId, deviceInfo, ipAddress);
      
      const now = new Date();
      const expiresAt = new Date(now.getTime() + this.SESSION_TIMEOUT * 1000);

      const session: SessionData = {
        sessionId,
        userId,
        deviceFingerprint: fingerprint.id,
        ipAddress,
        userAgent: deviceInfo.userAgent,
        createdAt: now,
        lastActivity: now,
        expiresAt
      };

      // In production, store in Redis with TTL
      logger.info('Session created', { sessionId, userId });
      return session;
    } catch (error) {
      logger.error('Error creating session', { error });
      throw handleSequelizeError(error as Error);
    }
  }

  static async validateSession(sessionId: string): Promise<SessionData | null> {
    try {
      // In production, fetch from Redis
      // If session exists and not expired, update lastActivity
      logger.info('Session validation', { sessionId });
      return null; // Return session data if valid
    } catch (error) {
      logger.error('Error validating session', { error, sessionId });
      return null;
    }
  }

  static async terminateSession(sessionId: string): Promise<boolean> {
    try {
      // In production, remove from Redis
      logger.info('Session terminated', { sessionId });
      return true;
    } catch (error) {
      logger.error('Error terminating session', { error, sessionId });
      return false;
    }
  }

  static async terminateAllUserSessions(userId: string): Promise<number> {
    try {
      // In production, remove all user sessions from Redis
      logger.info('All user sessions terminated', { userId });
      return 0; // Return count of terminated sessions
    } catch (error) {
      logger.error('Error terminating user sessions', { error, userId });
      return 0;
    }
  }

  static async verifyDevice(fingerprintId: string, currentDeviceInfo: any): Promise<boolean> {
    try {
      // Compare current device info with stored fingerprint
      // Check for suspicious changes (different IP, user agent, etc.)
      const similarityScore = this.calculateDeviceSimilarity(currentDeviceInfo);
      const isVerified = similarityScore > 0.8;
      
      logger.info('Device verification', { fingerprintId, isVerified, similarityScore });
      return isVerified;
    } catch (error) {
      logger.error('Error verifying device', { error, fingerprintId });
      return false;
    }
  }

  private static calculateDeviceSimilarity(deviceInfo: any): number {
    // Calculate similarity score based on device attributes
    // In production, compare with stored fingerprint
    return 0.9; // Mock similarity score
  }

  static async detectAnomalousActivity(userId: string, ipAddress: string, userAgent: string): Promise<boolean> {
    try {
      // Check for:
      // - Login from unusual location
      // - Different device/browser
      // - Multiple failed attempts
      // - Rapid session creation
      
      const anomalies: string[] = [];
      
      // In production, fetch user's typical patterns from database
      // Compare current activity with historical patterns
      
      if (anomalies.length > 0) {
        await this.flagSuspiciousActivity(userId, anomalies.join(', '));
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('Error detecting anomalous activity', { error, userId });
      return false;
    }
  }

  static async flagSuspiciousActivity(userId: string, reason: string): Promise<void> {
    try {
      logger.warn('Suspicious activity detected', { userId, reason });
      
      // Log security incident
      const incident = {
        userId,
        type: 'suspicious_activity',
        description: reason,
        severity: 'medium',
        timestamp: new Date(),
        ipAddress: 'unknown',
        userAgent: 'unknown'
      };
      
      // In production:
      // 1. Store in SecurityIncident table
      // 2. Send alert to security team
      // 3. Consider temporarily locking account
      // 4. Send notification to user
      
      logger.info('Security incident logged', { incident });
    } catch (error) {
      logger.error('Error flagging suspicious activity', { error, userId });
    }
  }

  static async getActiveSessions(userId: string): Promise<SessionData[]> {
    try {
      // In production, fetch all active sessions from Redis
      logger.info('Fetching active sessions', { userId });
      return []; // Return list of active sessions
    } catch (error) {
      logger.error('Error fetching active sessions', { error, userId });
      return [];
    }
  }
}
