/**
 * Prescription Status Enum
 * Tracks the lifecycle of a prescription from creation to completion
 */
export enum PrescriptionStatus {
  /** Prescription written but not yet sent to pharmacy */
  PENDING = 'pending',

  /** Prescription sent to pharmacy */
  SENT = 'sent',

  /** Prescription filled at pharmacy */
  FILLED = 'filled',

  /** Prescription partially filled */
  PARTIALLY_FILLED = 'partially_filled',

  /** Prescription picked up by patient */
  PICKED_UP = 'picked_up',

  /** Prescription cancelled before filling */
  CANCELLED = 'cancelled',

  /** Prescription expired */
  EXPIRED = 'expired',
}
