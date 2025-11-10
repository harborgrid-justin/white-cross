/**
 * Contact verification status
 * Tracks the verification workflow for emergency contacts
 */
export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED',
}
