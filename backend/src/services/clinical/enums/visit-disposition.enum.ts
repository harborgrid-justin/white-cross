/**
 * Clinic Visit Disposition
 * Describes the outcome/disposition of a clinic visit
 */
export enum VisitDisposition {
  /** Student returned to class after treatment */
  RETURN_TO_CLASS = 'RETURN_TO_CLASS',

  /** Student was sent home */
  SENT_HOME = 'SENT_HOME',

  /** Student required emergency transport to hospital */
  EMERGENCY_TRANSPORT = 'EMERGENCY_TRANSPORT',

  /** Other disposition not covered by standard categories */
  OTHER = 'OTHER',
}
