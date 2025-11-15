/**
 * Collaboration Types
 *
 * This module defines types for multi-user collaboration.
 *
 * @module gui-builder/versioning/collaboration
 */

import type { ComponentInstanceId } from '../core';

/**
 * User presence.
 */
export interface UserPresence {
  readonly userId: string;
  readonly userName: string;
  readonly color?: string;
  readonly cursor?: {
    readonly x: number;
    readonly y: number;
  };
  readonly selection?: readonly ComponentInstanceId[];
  readonly lastSeen: string;
}

/**
 * Lock information.
 */
export interface LockInfo {
  readonly lockedBy: string;
  readonly lockedAt: string;
  readonly expiresAt?: string;
}

/**
 * Collaboration session.
 */
export interface CollaborationSession {
  readonly id: string;
  readonly users: readonly UserPresence[];
  readonly startedAt: string;
}
