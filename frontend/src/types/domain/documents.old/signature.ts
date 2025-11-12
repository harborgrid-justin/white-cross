/**
 * E-signature types for document signing workflows
 *
 * @module types/documents/signature
 * @description Defines e-signature types with legal compliance and audit trail
 */

/**
 * Signature type
 */
export enum SignatureType {
  TYPED = 'typed',
  DRAWN = 'drawn',
  UPLOADED = 'uploaded',
  BIOMETRIC = 'biometric'
}

/**
 * Signature status in workflow
 */
export enum SignatureStatus {
  PENDING = 'pending',
  SIGNED = 'signed',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  REVOKED = 'revoked'
}

/**
 * Signature party role
 */
export enum SignaturePartyRole {
  SIGNER = 'signer',
  APPROVER = 'approver',
  WITNESS = 'witness',
  GUARDIAN = 'guardian',
  PARENT = 'parent',
  CC = 'cc' // Carbon copy - for notification only
}

/**
 * Workflow status
 */
export enum WorkflowStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DECLINED = 'declined',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

/**
 * Digital signature data
 */
export interface Signature {
  /** Signature ID */
  id: string;

  /** Signature workflow ID */
  workflowId: string;

  /** Document ID being signed */
  documentId: string;

  /** Signer user ID */
  signerId: string;

  /** Signer name */
  signerName: string;

  /** Signer email */
  signerEmail: string;

  /** Signature role in workflow */
  role: SignaturePartyRole;

  /** Signature type */
  type: SignatureType;

  /** Signature status */
  status: SignatureStatus;

  /** Base64 encoded signature image (for drawn/uploaded) */
  signatureData?: string;

  /** Typed signature text */
  signatureText?: string;

  /** Signature position in document (page, x, y) */
  position?: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };

  /** IP address when signed */
  ipAddress: string;

  /** User agent when signed */
  userAgent: string;

  /** Geolocation (optional, if available) */
  geolocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };

  /** Timestamp server verification */
  timestampToken?: string;

  /** Digital certificate (for advanced signatures) */
  certificate?: string;

  /** Signature reason/purpose */
  reason?: string;

  /** Signature location (physical location) */
  location?: string;

  /** Signed at timestamp */
  signedAt?: Date;

  /** Declined at timestamp */
  declinedAt?: Date;

  /** Decline reason */
  declineReason?: string;

  /** Revoked at timestamp */
  revokedAt?: Date;

  /** Revocation reason */
  revocationReason?: string;

  /** Created timestamp */
  createdAt: Date;

  /** Reminder sent count */
  remindersSent: number;

  /** Last reminder sent */
  lastReminderAt?: Date;
}

/**
 * Signature party in workflow
 */
export interface SignatureParty {
  /** Party ID */
  id: string;

  /** User ID (if registered user) */
  userId?: string;

  /** Party name */
  name: string;

  /** Party email */
  email: string;

  /** Party role */
  role: SignaturePartyRole;

  /** Signing order (0 for parallel, 1+ for sequential) */
  order: number;

  /** Is signature required */
  required: boolean;

  /** Signature ID once signed */
  signatureId?: string;

  /** Party status */
  status: SignatureStatus;

  /** Access code for verification (optional) */
  accessCode?: string;

  /** Require ID verification */
  requireIdVerification: boolean;

  /** ID verification status */
  idVerified: boolean;

  /** Notification sent */
  notificationSent: boolean;

  /** Notification sent at */
  notificationSentAt?: Date;

  /** Document viewed */
  documentViewed: boolean;

  /** Document viewed at */
  documentViewedAt?: Date;

  /** Custom message for this party */
  message?: string;
}

/**
 * Signature workflow for multi-party signing
 */
export interface SignatureWorkflow {
  /** Workflow ID */
  id: string;

  /** Workflow title */
  title: string;

  /** Workflow description */
  description?: string;

  /** Document ID to be signed */
  documentId: string;

  /** Document name */
  documentName: string;

  /** Workflow status */
  status: WorkflowStatus;

  /** Workflow created by */
  createdBy: string;

  /** Creator name */
  createdByName: string;

  /** Signature parties */
  parties: SignatureParty[];

  /** Sequential signing (one at a time) */
  sequentialSigning: boolean;

  /** Require all signatures or just some */
  requireAllSignatures: boolean;

  /** Workflow message */
  message?: string;

  /** Workflow expires at */
  expiresAt?: Date;

  /** Enable reminders */
  enableReminders: boolean;

  /** Reminder interval in days */
  reminderIntervalDays?: number;

  /** Allow signature decline */
  allowDecline: boolean;

  /** Require witness */
  requireWitness: boolean;

  /** Witness party ID */
  witnessPartyId?: string;

  /** Completion redirect URL */
  redirectUrl?: string;

  /** Webhook URL for status updates */
  webhookUrl?: string;

  /** Created timestamp */
  createdAt: Date;

  /** Sent timestamp */
  sentAt?: Date;

  /** Completed timestamp */
  completedAt?: Date;

  /** Cancelled timestamp */
  cancelledAt?: Date;

  /** Cancellation reason */
  cancellationReason?: string;

  /** Student ID if applicable */
  studentId?: string;

  /** School ID */
  schoolId?: string;

  /** District ID */
  districtId?: string;

  /** Completed document with signatures */
  signedDocumentId?: string;
}

/**
 * Signature request (sent to party)
 */
export interface SignatureRequest {
  /** Request ID */
  id: string;

  /** Workflow ID */
  workflowId: string;

  /** Party ID */
  partyId: string;

  /** Document to sign */
  documentId: string;

  /** Document name */
  documentName: string;

  /** Request token for secure access */
  token: string;

  /** Request status */
  status: SignatureStatus;

  /** Requested by */
  requestedBy: string;

  /** Requester name */
  requesterName: string;

  /** Request message */
  message?: string;

  /** Request expires at */
  expiresAt?: Date;

  /** Access code required */
  requiresAccessCode: boolean;

  /** Request created */
  createdAt: Date;

  /** Request viewed */
  viewedAt?: Date;

  /** Request signed */
  signedAt?: Date;

  /** Reminder count */
  remindersSent: number;

  /** Last reminder */
  lastReminderAt?: Date;
}

/**
 * Signature audit trail entry
 */
export interface SignatureAuditEntry {
  /** Entry ID */
  id: string;

  /** Workflow ID */
  workflowId: string;

  /** Signature ID (if applicable) */
  signatureId?: string;

  /** Action performed */
  action: 'created' | 'sent' | 'viewed' | 'signed' | 'declined' | 'cancelled' | 'reminded' | 'expired' | 'revoked';

  /** Actor user ID */
  actorId?: string;

  /** Actor name */
  actorName: string;

  /** Actor email */
  actorEmail?: string;

  /** IP address */
  ipAddress: string;

  /** User agent */
  userAgent: string;

  /** Geolocation */
  geolocation?: {
    latitude: number;
    longitude: number;
  };

  /** Entry timestamp */
  timestamp: Date;

  /** Additional details */
  details?: Record<string, unknown>;

  /** Verification token (for legal proof) */
  verificationToken?: string;
}

/**
 * Signature template for reusable signature positions
 */
export interface SignatureTemplate {
  /** Template ID */
  id: string;

  /** Template name */
  name: string;

  /** Template description */
  description?: string;

  /** Document template ID */
  documentTemplateId?: string;

  /** Signature fields */
  fields: SignatureTemplateField[];

  /** Created by */
  createdBy: string;

  /** Created timestamp */
  createdAt: Date;

  /** Last used timestamp */
  lastUsedAt?: Date;

  /** Usage count */
  usageCount: number;

  /** School ID */
  schoolId?: string;

  /** District ID */
  districtId?: string;
}

/**
 * Signature template field
 */
export interface SignatureTemplateField {
  /** Field ID */
  id: string;

  /** Field label */
  label: string;

  /** Field type */
  type: 'signature' | 'initial' | 'date' | 'text' | 'checkbox';

  /** Required field */
  required: boolean;

  /** Field position */
  position: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };

  /** Party role that should fill this field */
  role?: SignaturePartyRole;

  /** Default value */
  defaultValue?: string;

  /** Validation regex */
  validation?: string;

  /** Placeholder text */
  placeholder?: string;
}

/**
 * Witness signature for legal compliance
 */
export interface WitnessSignature {
  /** Witness signature ID */
  id: string;

  /** Primary signature ID */
  primarySignatureId: string;

  /** Witness user ID */
  witnessId: string;

  /** Witness name */
  witnessName: string;

  /** Witness email */
  witnessEmail: string;

  /** Witness signature data */
  signatureData: string;

  /** Witness statement */
  statement: string;

  /** Signed at */
  signedAt: Date;

  /** IP address */
  ipAddress: string;

  /** User agent */
  userAgent: string;

  /** Witness credentials */
  credentials?: {
    licenseNumber?: string;
    licenseType?: string;
    issuer?: string;
  };
}

/**
 * Parental consent signature (for minors)
 */
export interface ParentalConsentSignature extends Signature {
  /** Student ID (minor) */
  studentId: string;

  /** Student name */
  studentName: string;

  /** Parent/guardian relationship */
  relationship: 'parent' | 'guardian' | 'custodian';

  /** Emergency contact consent */
  emergencyContactConsent: boolean;

  /** Medical treatment consent */
  medicalTreatmentConsent: boolean;

  /** Photo/video consent */
  photoVideoConsent: boolean;

  /** Consent valid until */
  consentValidUntil?: Date;
}

/**
 * Signature verification result
 */
export interface SignatureVerification {
  /** Signature ID */
  signatureId: string;

  /** Verification status */
  isValid: boolean;

  /** Document tampered */
  isTampered: boolean;

  /** Timestamp verified */
  timestampVerified: boolean;

  /** Certificate verified */
  certificateVerified: boolean;

  /** Signature hash */
  signatureHash: string;

  /** Document hash at signing */
  documentHash: string;

  /** Current document hash */
  currentDocumentHash: string;

  /** Verification timestamp */
  verifiedAt: Date;

  /** Verification errors */
  errors?: string[];

  /** Verification warnings */
  warnings?: string[];
}
