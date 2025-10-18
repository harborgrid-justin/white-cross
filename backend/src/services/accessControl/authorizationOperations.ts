/**
 * WC-GEN-176 | authorizationOperations.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Authentication and Authorization Operations
 *
 * This module handles session management, login attempt tracking,
 * IP restrictions, and other security-related authorization operations.
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  Session,
  LoginAttempt,
  IpRestriction
} from '../../database/models';
import { IpRestrictionType } from '../../database/types/enums';
import {
  CreateSessionData,
  LogLoginAttemptData,
  AddIpRestrictionData,
  IpRestrictionCheckResult
} from './types';

/**
 * Session Management
 */

/**
 * Create a new session for user authentication
 */
export async function createSession(data: CreateSessionData): Promise<Session> {
  try {
    const session = await Session.create({
      userId: data.userId,
      token: data.token,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      expiresAt: data.expiresAt,
      lastActivity: new Date()
    });

    logger.info(`Created session for user ${data.userId}`);
    return session;
  } catch (error) {
    logger.error('Error creating session:', error);
    throw error;
  }
}

/**
 * Get active sessions for a user
 */
export async function getUserSessions(userId: string): Promise<Session[]> {
  try {
    const sessions = await Session.findAll({
      where: {
        userId,
        expiresAt: {
          [Op.gt]: new Date()
        }
      },
      order: [['createdAt', 'DESC']]
    });

    logger.info(`Retrieved ${sessions.length} active sessions for user ${userId}`);
    return sessions;
  } catch (error) {
    logger.error(`Error getting sessions for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Update session last activity timestamp
 */
export async function updateSessionActivity(token: string): Promise<void> {
  try {
    const session = await Session.findOne({
      where: { token }
    });

    if (session) {
      await session.update({
        lastActivity: new Date()
      });
    }
  } catch (error) {
    logger.error('Error updating session activity:', error);
    // Don't throw - this is a background operation
  }
}

/**
 * Delete session (logout)
 */
export async function deleteSession(token: string): Promise<{ success: boolean }> {
  try {
    const deletedCount = await Session.destroy({
      where: { token }
    });

    if (deletedCount === 0) {
      throw new Error('Session not found');
    }

    logger.info('Session deleted');
    return { success: true };
  } catch (error) {
    logger.error('Error deleting session:', error);
    throw error;
  }
}

/**
 * Delete all user sessions (logout from all devices)
 */
export async function deleteAllUserSessions(userId: string): Promise<{ deleted: number }> {
  try {
    const deletedCount = await Session.destroy({
      where: { userId }
    });

    logger.info(`Deleted ${deletedCount} sessions for user ${userId}`);
    return { deleted: deletedCount };
  } catch (error) {
    logger.error(`Error deleting sessions for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Clean up expired sessions (maintenance operation)
 */
export async function cleanupExpiredSessions(): Promise<{ deleted: number }> {
  try {
    const deletedCount = await Session.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date()
        }
      }
    });

    logger.info(`Cleaned up ${deletedCount} expired sessions`);
    return { deleted: deletedCount };
  } catch (error) {
    logger.error('Error cleaning up expired sessions:', error);
    throw error;
  }
}

/**
 * Login Attempt Tracking
 */

/**
 * Log a login attempt for security monitoring
 */
export async function logLoginAttempt(data: LogLoginAttemptData): Promise<LoginAttempt | undefined> {
  try {
    const attempt = await LoginAttempt.create({
      email: data.email,
      success: data.success,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      failureReason: data.failureReason
    });

    logger.info(`Logged login attempt for ${data.email}: ${data.success ? 'success' : 'failure'}`);
    return attempt;
  } catch (error) {
    logger.error('Error logging login attempt:', error);
    // Don't throw - logging failures shouldn't break login
    return undefined;
  }
}

/**
 * Get recent failed login attempts for an email address
 */
export async function getFailedLoginAttempts(email: string, minutes: number = 15): Promise<LoginAttempt[]> {
  try {
    const since = new Date(Date.now() - minutes * 60 * 1000);

    const attempts = await LoginAttempt.findAll({
      where: {
        email,
        success: false,
        createdAt: {
          [Op.gte]: since
        }
      },
      order: [['createdAt', 'DESC']]
    });

    logger.info(`Retrieved ${attempts.length} failed login attempts for ${email}`);
    return attempts;
  } catch (error) {
    logger.error('Error getting failed login attempts:', error);
    throw error;
  }
}

/**
 * IP Restriction Management
 */

/**
 * Get all active IP restrictions
 */
export async function getIpRestrictions(): Promise<IpRestriction[]> {
  try {
    const restrictions = await IpRestriction.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });

    logger.info(`Retrieved ${restrictions.length} IP restrictions`);
    return restrictions;
  } catch (error) {
    logger.error('Error getting IP restrictions:', error);
    throw error;
  }
}

/**
 * Add an IP restriction (whitelist or blacklist)
 */
export async function addIpRestriction(data: AddIpRestrictionData): Promise<IpRestriction> {
  try {
    // Check if restriction already exists for this IP
    const existingRestriction = await IpRestriction.findOne({
      where: {
        ipAddress: data.ipAddress,
        isActive: true
      }
    });

    if (existingRestriction) {
      throw new Error('IP restriction already exists for this address');
    }

    const restriction = await IpRestriction.create({
      ipAddress: data.ipAddress,
      type: data.type,
      reason: data.reason,
      isActive: true,
      createdBy: data.createdBy
    });

    logger.info(`Added IP restriction: ${data.ipAddress} (${data.type})`);
    return restriction;
  } catch (error) {
    logger.error('Error adding IP restriction:', error);
    throw error;
  }
}

/**
 * Remove (deactivate) an IP restriction
 */
export async function removeIpRestriction(id: string): Promise<{ success: boolean }> {
  try {
    const restriction = await IpRestriction.findByPk(id);

    if (!restriction) {
      throw new Error('IP restriction not found');
    }

    await restriction.update({
      isActive: false
    });

    logger.info(`Removed IP restriction: ${id}`);
    return { success: true };
  } catch (error) {
    logger.error(`Error removing IP restriction ${id}:`, error);
    throw error;
  }
}

/**
 * Check if an IP address is restricted
 */
export async function checkIpRestriction(ipAddress: string): Promise<IpRestrictionCheckResult> {
  try {
    const restriction = await IpRestriction.findOne({
      where: {
        ipAddress,
        isActive: true
      }
    });

    if (!restriction) {
      return { isRestricted: false };
    }

    const isRestricted = restriction.type === IpRestrictionType.BLACKLIST;

    return {
      isRestricted,
      type: restriction.type,
      reason: restriction.reason || undefined
    };
  } catch (error) {
    logger.error('Error checking IP restriction:', error);
    return { isRestricted: false };
  }
}
