/**
 * Follow-up Appointment Status Enum
 * Tracks the status of scheduled follow-up appointments
 */
export enum FollowUpStatus {
  /** Follow-up is scheduled */
  SCHEDULED = 'scheduled',

  /** Reminder sent to student */
  REMINDED = 'reminded',

  /** Student confirmed attendance */
  CONFIRMED = 'confirmed',

  /** Follow-up completed */
  COMPLETED = 'completed',

  /** Student missed appointment */
  MISSED = 'missed',

  /** Appointment cancelled */
  CANCELLED = 'cancelled',

  /** Appointment rescheduled */
  RESCHEDULED = 'rescheduled',
}
