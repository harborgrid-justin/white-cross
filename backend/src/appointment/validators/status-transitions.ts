import { BadRequestException } from '@nestjs/common';
import { AppointmentStatus } from '../dto/update-appointment.dto';

/**
 * Finite state machine for appointment status transitions
 * Ensures appointments follow valid lifecycle paths
 */
export class AppointmentStatusTransitions {
  /**
   * Allowed status transitions map
   * Defines which statuses can transition to which other statuses
   */
  private static readonly ALLOWED_TRANSITIONS: Record<
    AppointmentStatus,
    AppointmentStatus[]
  > = {
    [AppointmentStatus.SCHEDULED]: [
      AppointmentStatus.IN_PROGRESS,
      AppointmentStatus.CANCELLED,
      AppointmentStatus.NO_SHOW,
      AppointmentStatus.COMPLETED, // Allow direct completion from scheduled
    ],
    [AppointmentStatus.IN_PROGRESS]: [
      AppointmentStatus.COMPLETED,
      AppointmentStatus.CANCELLED,
    ],
    [AppointmentStatus.COMPLETED]: [], // Final state - no transitions
    [AppointmentStatus.CANCELLED]: [], // Final state - no transitions
    [AppointmentStatus.NO_SHOW]: [], // Final state - no transitions
  };

  /**
   * Validate a status transition is allowed
   * @throws BadRequestException if transition is invalid
   */
  static validateStatusTransition(
    currentStatus: AppointmentStatus,
    newStatus: AppointmentStatus,
  ): void {
    if (!this.canTransitionTo(currentStatus, newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}. ` +
          `Allowed transitions: ${this.ALLOWED_TRANSITIONS[currentStatus].join(', ') || 'none'}`,
      );
    }
  }

  /**
   * Check if a status transition is allowed (non-throwing)
   */
  static canTransitionTo(
    currentStatus: AppointmentStatus,
    newStatus: AppointmentStatus,
  ): boolean {
    // Same status is always allowed (no-op)
    if (currentStatus === newStatus) {
      return true;
    }

    const allowedTransitions = this.ALLOWED_TRANSITIONS[currentStatus] || [];
    return allowedTransitions.includes(newStatus);
  }

  /**
   * Get all allowed transitions from a given status
   */
  static getAllowedTransitions(
    currentStatus: AppointmentStatus,
  ): AppointmentStatus[] {
    return this.ALLOWED_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Check if a status is a final state (cannot be transitioned from)
   */
  static isFinalState(status: AppointmentStatus): boolean {
    return (
      this.ALLOWED_TRANSITIONS[status] &&
      this.ALLOWED_TRANSITIONS[status].length === 0
    );
  }
}
