/**
 * Treatment Plan Status Enum
 * Represents the lifecycle status of a treatment plan
 */
export enum TreatmentStatus {
  /** Treatment plan is drafted but not yet active */
  DRAFT = 'draft',

  /** Treatment plan is currently active */
  ACTIVE = 'active',

  /** Treatment plan is on hold/suspended */
  ON_HOLD = 'on_hold',

  /** Treatment plan completed successfully */
  COMPLETED = 'completed',

  /** Treatment plan was cancelled before completion */
  CANCELLED = 'cancelled',
}
