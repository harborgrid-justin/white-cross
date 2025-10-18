/**
 * LOC: 5FC8CA4F62
 * WC-GEN-214 | statusTransitions.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - crudOperations.ts (services/appointment/crudOperations.ts)
 *   - appointmentService.ts (services/appointmentService.ts)
 */

/**
 * WC-GEN-214 | statusTransitions.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../database/types/enums | Dependencies: ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { AppointmentStatus } from '../../database/types/enums';

/**
 * Enterprise-grade status transition management module
 * Implements finite state machine pattern for appointment lifecycle
 *
 * Appointment Lifecycle States:
 * SCHEDULED -> IN_PROGRESS -> COMPLETED
 * SCHEDULED -> CANCELLED
 * SCHEDULED -> NO_SHOW
 * IN_PROGRESS -> CANCELLED
 */
export class AppointmentStatusTransitions {
  /**
   * Define allowed status transitions using a state machine approach
   * This ensures data integrity and prevents invalid state transitions
   */
  private static readonly ALLOWED_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
    [AppointmentStatus.SCHEDULED]: [
      AppointmentStatus.IN_PROGRESS,
      AppointmentStatus.CANCELLED,
      AppointmentStatus.NO_SHOW
    ],
    [AppointmentStatus.IN_PROGRESS]: [
      AppointmentStatus.COMPLETED,
      AppointmentStatus.CANCELLED
    ],
    [AppointmentStatus.COMPLETED]: [], // Terminal state - no transitions allowed
    [AppointmentStatus.CANCELLED]: [], // Terminal state - no transitions allowed
    [AppointmentStatus.NO_SHOW]: []   // Terminal state - no transitions allowed
  };

  /**
   * Validate status transition is allowed
   * @throws Error if transition is not allowed
   */
  static validateStatusTransition(
    currentStatus: AppointmentStatus,
    newStatus: AppointmentStatus
  ): void {
    // No-op if status is not changing
    if (currentStatus === newStatus) {
      return;
    }

    const allowed = this.ALLOWED_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${currentStatus} to ${newStatus}. ` +
        `Allowed transitions: ${allowed.join(', ') || 'none'}`
      );
    }
  }

  /**
   * Check if a status transition is allowed
   * @returns true if transition is allowed, false otherwise
   */
  static canTransitionTo(
    currentStatus: AppointmentStatus,
    newStatus: AppointmentStatus
  ): boolean {
    if (currentStatus === newStatus) {
      return true;
    }

    const allowed = this.ALLOWED_TRANSITIONS[currentStatus] || [];
    return allowed.includes(newStatus);
  }

  /**
   * Get all allowed transitions for a given status
   */
  static getAllowedTransitions(currentStatus: AppointmentStatus): AppointmentStatus[] {
    return this.ALLOWED_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Check if a status is a terminal state (no further transitions allowed)
   */
  static isTerminalState(status: AppointmentStatus): boolean {
    const transitions = this.ALLOWED_TRANSITIONS[status] || [];
    return transitions.length === 0;
  }

  /**
   * Check if a status is an active state (can still be modified)
   */
  static isActiveState(status: AppointmentStatus): boolean {
    return status === AppointmentStatus.SCHEDULED ||
      status === AppointmentStatus.IN_PROGRESS;
  }

  /**
   * Get the next logical status for appointment progression
   * This is useful for UI workflows
   */
  static getNextStatus(currentStatus: AppointmentStatus): AppointmentStatus | null {
    switch (currentStatus) {
      case AppointmentStatus.SCHEDULED:
        return AppointmentStatus.IN_PROGRESS;
      case AppointmentStatus.IN_PROGRESS:
        return AppointmentStatus.COMPLETED;
      default:
        return null; // No next status for terminal states
    }
  }

  /**
   * Get human-readable description of a status
   */
  static getStatusDescription(status: AppointmentStatus): string {
    const descriptions: Record<AppointmentStatus, string> = {
      [AppointmentStatus.SCHEDULED]: 'Appointment is scheduled and confirmed',
      [AppointmentStatus.IN_PROGRESS]: 'Appointment is currently in progress',
      [AppointmentStatus.COMPLETED]: 'Appointment has been completed',
      [AppointmentStatus.CANCELLED]: 'Appointment was cancelled',
      [AppointmentStatus.NO_SHOW]: 'Patient did not show up for appointment'
    };

    return descriptions[status] || 'Unknown status';
  }

  /**
   * Get status priority for sorting (lower number = higher priority)
   */
  static getStatusPriority(status: AppointmentStatus): number {
    const priorities: Record<AppointmentStatus, number> = {
      [AppointmentStatus.IN_PROGRESS]: 1,
      [AppointmentStatus.SCHEDULED]: 2,
      [AppointmentStatus.COMPLETED]: 3,
      [AppointmentStatus.NO_SHOW]: 4,
      [AppointmentStatus.CANCELLED]: 5
    };

    return priorities[status] || 999;
  }

  /**
   * Check if status requires immediate attention
   */
  static requiresAttention(status: AppointmentStatus): boolean {
    return status === AppointmentStatus.IN_PROGRESS;
  }
}
