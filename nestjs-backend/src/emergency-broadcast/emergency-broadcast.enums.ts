/**
 * LOC: EMERGENCY-BROADCAST-ENUMS-001
 * Emergency Broadcast System - Enums
 */

/**
 * Emergency types with priority levels
 */
export enum EmergencyType {
  // CRITICAL - Immediate life safety threats
  ACTIVE_THREAT = 'ACTIVE_THREAT',           // Active shooter, intruder
  MEDICAL_EMERGENCY = 'MEDICAL_EMERGENCY',    // Severe medical situation
  FIRE = 'FIRE',                             // Fire or explosion
  NATURAL_DISASTER = 'NATURAL_DISASTER',     // Tornado, earthquake, etc.

  // HIGH - Urgent but not immediate threat
  LOCKDOWN = 'LOCKDOWN',                     // Security lockdown
  EVACUATION = 'EVACUATION',                 // Building evacuation
  SHELTER_IN_PLACE = 'SHELTER_IN_PLACE',     // Shelter in place order

  // MEDIUM - Important notifications
  WEATHER_ALERT = 'WEATHER_ALERT',           // Severe weather
  TRANSPORTATION = 'TRANSPORTATION',         // Bus delays/cancellations
  FACILITY_ISSUE = 'FACILITY_ISSUE',         // Power outage, water issue

  // LOW - General announcements
  SCHOOL_CLOSURE = 'SCHOOL_CLOSURE',         // Planned closure
  EARLY_DISMISSAL = 'EARLY_DISMISSAL',       // Early dismissal
  GENERAL_ANNOUNCEMENT = 'GENERAL_ANNOUNCEMENT'
}

/**
 * Emergency priority levels determine delivery speed and channels
 */
export enum EmergencyPriority {
  CRITICAL = 'CRITICAL',  // All channels, immediate delivery
  HIGH = 'HIGH',          // SMS + Email + Push, prioritized
  MEDIUM = 'MEDIUM',      // Email + Push, normal delivery
  LOW = 'LOW'             // Email only, batch delivery
}

/**
 * Target audience for broadcast
 */
export enum BroadcastAudience {
  ALL_PARENTS = 'ALL_PARENTS',
  ALL_STAFF = 'ALL_STAFF',
  ALL_STUDENTS = 'ALL_STUDENTS',
  SPECIFIC_GRADE = 'SPECIFIC_GRADE',
  SPECIFIC_SCHOOL = 'SPECIFIC_SCHOOL',
  SPECIFIC_CLASS = 'SPECIFIC_CLASS',
  SPECIFIC_GROUP = 'SPECIFIC_GROUP',
  EMERGENCY_CONTACTS = 'EMERGENCY_CONTACTS'
}

/**
 * Broadcast status
 */
export enum BroadcastStatus {
  DRAFT = 'DRAFT',
  SENDING = 'SENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

/**
 * Communication channels
 */
export enum CommunicationChannel {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  VOICE = 'VOICE'
}

/**
 * Recipient type
 */
export enum RecipientType {
  PARENT = 'PARENT',
  STUDENT = 'STUDENT',
  STAFF = 'STAFF'
}

/**
 * Delivery status for individual recipients
 */
export enum DeliveryStatus {
  QUEUED = 'QUEUED',
  SENDING = 'SENDING',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED'
}
