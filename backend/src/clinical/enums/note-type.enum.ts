/**
 * Clinical Note Type Enum
 * Categorizes different types of clinical notes
 */
export enum NoteType {
  /** General clinical note */
  GENERAL = 'general',

  /** SOAP note (Subjective, Objective, Assessment, Plan) */
  SOAP = 'soap',

  /** Progress note during treatment */
  PROGRESS = 'progress',

  /** Discharge summary */
  DISCHARGE = 'discharge',

  /** Follow-up note */
  FOLLOW_UP = 'follow_up',

  /** Telephone consultation note */
  TELEPHONE = 'telephone',

  /** Nurse's note */
  NURSING = 'nursing',

  /** Medication note */
  MEDICATION = 'medication',

  /** Incident report */
  INCIDENT = 'incident',
}
