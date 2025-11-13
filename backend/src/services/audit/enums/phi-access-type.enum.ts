/**
 * PHI Access Type Enum
 * HIPAA compliance: Tracks the type of access to Protected Health Information
 */
export enum PHIAccessType {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  EXPORT = 'EXPORT',
}
