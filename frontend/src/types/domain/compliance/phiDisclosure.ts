/**
 * PHI Disclosure Tracking Types
 *
 * HIPAA-critical feature for tracking when and how Protected Health Information
 * is disclosed to external parties. Required for HIPAA compliance and audit trails.
 *
 * @module types/compliance/phiDisclosure
 * @category Compliance
 */

import { z } from 'zod';
import type { BaseAuditEntity, PaginatedResponse, ApiResponse } from '../common';

// ============================================================================
// ENUMS AND CONSTANTS
// ============================================================================

/**
 * Type of PHI disclosure
 *
 * Categorizes the nature and legal basis of PHI disclosure.
 * Aligned with HIPAA disclosure categories.
 */
export enum DisclosureType {
  /** Disclosure to parent/guardian with legal authority */
  PARENTAL_REQUEST = 'PARENTAL_REQUEST',
  /** Emergency situation requiring immediate disclosure */
  EMERGENCY = 'EMERGENCY',
  /** Court order or legal requirement */
  LEGAL_REQUIREMENT = 'LEGAL_REQUIREMENT',
  /** Healthcare provider coordination */
  TREATMENT = 'TREATMENT',
  /** Insurance or billing purposes */
  PAYMENT = 'PAYMENT',
  /** Healthcare operations */
  OPERATIONS = 'OPERATIONS',
  /** Public health authority reporting */
  PUBLIC_HEALTH = 'PUBLIC_HEALTH',
  /** Law enforcement purposes */
  LAW_ENFORCEMENT = 'LAW_ENFORCEMENT',
  /** Research purposes with proper authorization */
  RESEARCH = 'RESEARCH',
  /** Student/patient initiated disclosure */
  PATIENT_AUTHORIZED = 'PATIENT_AUTHORIZED',
  /** Other authorized disclosure */
  OTHER = 'OTHER',
}

/**
 * Purpose of PHI disclosure
 *
 * Specific reason for disclosure, required for HIPAA minimum necessary standard.
 */
export enum DisclosurePurpose {
  /** Continuity of care */
  CONTINUITY_OF_CARE = 'CONTINUITY_OF_CARE',
  /** Emergency medical treatment */
  EMERGENCY_TREATMENT = 'EMERGENCY_TREATMENT',
  /** Specialist consultation */
  SPECIALIST_CONSULTATION = 'SPECIALIST_CONSULTATION',
  /** Insurance claim processing */
  INSURANCE_CLAIM = 'INSURANCE_CLAIM',
  /** Legal proceedings */
  LEGAL_PROCEEDINGS = 'LEGAL_PROCEEDINGS',
  /** Compliance with court order */
  COURT_ORDER = 'COURT_ORDER',
  /** Public health reporting (disease surveillance) */
  DISEASE_SURVEILLANCE = 'DISEASE_SURVEILLANCE',
  /** Immunization registry submission */
  IMMUNIZATION_REGISTRY = 'IMMUNIZATION_REGISTRY',
  /** Parent/guardian access to records */
  PARENTAL_ACCESS = 'PARENTAL_ACCESS',
  /** School administrative needs */
  SCHOOL_ADMINISTRATION = 'SCHOOL_ADMINISTRATION',
  /** Research study participation */
  RESEARCH_PARTICIPATION = 'RESEARCH_PARTICIPATION',
  /** Other legitimate purpose */
  OTHER = 'OTHER',
}

/**
 * Method of PHI disclosure
 *
 * How the PHI was disclosed (delivery mechanism).
 */
export enum DisclosureMethod {
  /** Electronic transmission (email, portal, API) */
  ELECTRONIC = 'ELECTRONIC',
  /** Paper document (printed, faxed) */
  PAPER = 'PAPER',
  /** Verbal disclosure (phone, in-person) */
  VERBAL = 'VERBAL',
  /** Secure messaging platform */
  SECURE_MESSAGE = 'SECURE_MESSAGE',
  /** Encrypted email */
  ENCRYPTED_EMAIL = 'ENCRYPTED_EMAIL',
  /** Fax transmission */
  FAX = 'FAX',
  /** Physical mail (USPS, courier) */
  MAIL = 'MAIL',
  /** Other method */
  OTHER = 'OTHER',
}

/**
 * Status of disclosure record
 */
export enum DisclosureStatus {
  /** Disclosure pending approval */
  PENDING = 'PENDING',
  /** Disclosure approved */
  APPROVED = 'APPROVED',
  /** Disclosure completed */
  COMPLETED = 'COMPLETED',
  /** Disclosure denied */
  DENIED = 'DENIED',
  /** Disclosure revoked */
  REVOKED = 'REVOKED',
}

/**
 * Recipient type categorization
 */
export enum RecipientType {
  /** Parent or legal guardian */
  PARENT_GUARDIAN = 'PARENT_GUARDIAN',
  /** Healthcare provider (physician, specialist) */
  HEALTHCARE_PROVIDER = 'HEALTHCARE_PROVIDER',
  /** Insurance company */
  INSURANCE_COMPANY = 'INSURANCE_COMPANY',
  /** Government agency */
  GOVERNMENT_AGENCY = 'GOVERNMENT_AGENCY',
  /** Law enforcement */
  LAW_ENFORCEMENT = 'LAW_ENFORCEMENT',
  /** Legal representative (attorney) */
  LEGAL_REPRESENTATIVE = 'LEGAL_REPRESENTATIVE',
  /** Research institution */
  RESEARCH_INSTITUTION = 'RESEARCH_INSTITUTION',
  /** Other authorized party */
  OTHER = 'OTHER',
}

// ============================================================================
// DOMAIN MODEL INTERFACES
// ============================================================================

/**
 * PHI Disclosure Record
 *
 * Comprehensive record of PHI disclosure event.
 * Required for HIPAA accounting of disclosures.
 *
 * @property {string} studentId - Student whose PHI was disclosed
 * @property {DisclosureType} disclosureType - Type/category of disclosure
 * @property {DisclosurePurpose} purpose - Specific purpose of disclosure
 * @property {DisclosureMethod} method - How PHI was disclosed
 * @property {DisclosureStatus} status - Current status of disclosure
 * @property {string} disclosureDate - ISO 8601 timestamp of disclosure
 * @property {string} disclosedBy - User ID who authorized/performed disclosure
 * @property {RecipientType} recipientType - Category of recipient
 * @property {string} recipientName - Name of recipient individual/organization
 * @property {string} [recipientNPI] - NPI if recipient is healthcare provider
 * @property {string} [recipientOrganization] - Organization name if applicable
 * @property {string} [recipientAddress] - Recipient physical address
 * @property {string} [recipientPhone] - Recipient phone number
 * @property {string} [recipientEmail] - Recipient email address
 * @property {string[]} informationDisclosed - Specific PHI categories disclosed
 * @property {string} [minimumNecessary] - Justification for minimum necessary standard
 * @property {string} [authorizationId] - Link to authorization form if applicable
 * @property {string} [authorizationDate] - Date authorization was signed
 * @property {string} [expirationDate] - Expiration of authorization
 * @property {string} [notes] - Additional notes about disclosure
 * @property {boolean} patientRequested - Whether patient/guardian requested disclosure
 * @property {boolean} isAccounting - Whether disclosure requires accounting (HIPAA)
 * @property {string} [denialReason] - Reason if disclosure was denied
 * @property {string} [revokedReason] - Reason if disclosure was revoked
 * @property {string} [revokedDate] - Date disclosure was revoked
 *
 * @phi All fields contain or relate to Protected Health Information
 */
export interface PhiDisclosure extends BaseAuditEntity {
  studentId: string;
  disclosureType: DisclosureType;
  purpose: DisclosurePurpose;
  method: DisclosureMethod;
  status: DisclosureStatus;
  disclosureDate: string;
  disclosedBy: string;
  recipientType: RecipientType;
  recipientName: string;
  recipientNPI?: string | null;
  recipientOrganization?: string | null;
  recipientAddress?: string | null;
  recipientPhone?: string | null;
  recipientEmail?: string | null;
  informationDisclosed: string[];
  minimumNecessary?: string | null;
  authorizationId?: string | null;
  authorizationDate?: string | null;
  expirationDate?: string | null;
  notes?: string | null;
  patientRequested: boolean;
  isAccounting: boolean;
  denialReason?: string | null;
  revokedReason?: string | null;
  revokedDate?: string | null;

  // Populated associations
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  disclosedByUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

/**
 * Disclosure log entry for audit trail
 *
 * Lightweight log entry for quick audit queries.
 */
export interface DisclosureLog {
  id: string;
  disclosureId: string;
  action: 'CREATED' | 'APPROVED' | 'COMPLETED' | 'DENIED' | 'REVOKED' | 'MODIFIED';
  performedBy: string;
  performedAt: string;
  details?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Disclosure audit summary
 *
 * Aggregated disclosure statistics for compliance reporting.
 */
export interface DisclosureAuditSummary {
  totalDisclosures: number;
  disclosuresByType: Record<DisclosureType, number>;
  disclosuresByPurpose: Record<DisclosurePurpose, number>;
  disclosuresByMethod: Record<DisclosureMethod, number>;
  accountingRequired: number;
  pendingApprovals: number;
  deniedDisclosures: number;
  revokedDisclosures: number;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Request to create new PHI disclosure record
 */
export interface CreatePhiDisclosureRequest {
  studentId: string;
  disclosureType: DisclosureType;
  purpose: DisclosurePurpose;
  method: DisclosureMethod;
  disclosureDate: string;
  recipientType: RecipientType;
  recipientName: string;
  recipientNPI?: string;
  recipientOrganization?: string;
  recipientAddress?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  informationDisclosed: string[];
  minimumNecessary?: string;
  authorizationId?: string;
  authorizationDate?: string;
  expirationDate?: string;
  notes?: string;
  patientRequested: boolean;
}

/**
 * Request to update existing PHI disclosure record
 */
export interface UpdatePhiDisclosureRequest {
  status?: DisclosureStatus;
  recipientName?: string;
  recipientNPI?: string;
  recipientOrganization?: string;
  recipientAddress?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  informationDisclosed?: string[];
  minimumNecessary?: string;
  notes?: string;
  denialReason?: string;
  revokedReason?: string;
}

/**
 * Filters for querying PHI disclosures
 */
export interface PhiDisclosureFilters {
  studentId?: string;
  disclosureType?: DisclosureType;
  purpose?: DisclosurePurpose;
  method?: DisclosureMethod;
  status?: DisclosureStatus;
  recipientType?: RecipientType;
  startDate?: string;
  endDate?: string;
  disclosedBy?: string;
  isAccounting?: boolean;
  patientRequested?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'disclosureDate' | 'createdAt' | 'recipientName';
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Response containing paginated disclosures
 */
export type PhiDisclosuresResponse = PaginatedResponse<PhiDisclosure>;

/**
 * Response for single disclosure
 */
export type PhiDisclosureResponse = ApiResponse<PhiDisclosure>;

/**
 * Response for disclosure audit summary
 */
export type DisclosureAuditResponse = ApiResponse<DisclosureAuditSummary>;

/**
 * Response for disclosure logs
 */
export type DisclosureLogsResponse = ApiResponse<DisclosureLog[]>;

// ============================================================================
// FORM VALIDATION SCHEMAS (ZOD)
// ============================================================================

/**
 * Zod schema for creating PHI disclosure
 *
 * Validates all required fields and healthcare-specific formats.
 */
export const CreatePhiDisclosureSchema = z.object({
  studentId: z.string().uuid({ message: 'Valid student ID required' }),
  disclosureType: z.nativeEnum(DisclosureType, { message: 'Valid disclosure type required' }),
  purpose: z.nativeEnum(DisclosurePurpose, { message: 'Valid disclosure purpose required' }),
  method: z.nativeEnum(DisclosureMethod, { message: 'Valid disclosure method required' }),
  disclosureDate: z.string().datetime({ message: 'Valid ISO 8601 date required' }),
  recipientType: z.nativeEnum(RecipientType, { message: 'Valid recipient type required' }),
  recipientName: z.string().min(1, 'Recipient name required').max(200, 'Recipient name too long'),
  recipientNPI: z.string().regex(/^\d{10}$/, 'NPI must be 10 digits').optional(),
  recipientOrganization: z.string().max(200).optional(),
  recipientAddress: z.string().max(500).optional(),
  recipientPhone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone format').optional(),
  recipientEmail: z.string().email('Invalid email format').optional(),
  informationDisclosed: z.array(z.string().min(1)).min(1, 'At least one information category required'),
  minimumNecessary: z.string().max(1000).optional(),
  authorizationId: z.string().uuid().optional(),
  authorizationDate: z.string().datetime().optional(),
  expirationDate: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
  patientRequested: z.boolean(),
});

/**
 * Zod schema for updating PHI disclosure
 */
export const UpdatePhiDisclosureSchema = z.object({
  status: z.nativeEnum(DisclosureStatus).optional(),
  recipientName: z.string().min(1).max(200).optional(),
  recipientNPI: z.string().regex(/^\d{10}$/).optional(),
  recipientOrganization: z.string().max(200).optional(),
  recipientAddress: z.string().max(500).optional(),
  recipientPhone: z.string().regex(/^\+?[\d\s\-\(\)]+$/).optional(),
  recipientEmail: z.string().email().optional(),
  informationDisclosed: z.array(z.string().min(1)).optional(),
  minimumNecessary: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
  denialReason: z.string().max(500).optional(),
  revokedReason: z.string().max(500).optional(),
});

/**
 * Zod schema for disclosure filters
 */
export const PhiDisclosureFiltersSchema = z.object({
  studentId: z.string().uuid().optional(),
  disclosureType: z.nativeEnum(DisclosureType).optional(),
  purpose: z.nativeEnum(DisclosurePurpose).optional(),
  method: z.nativeEnum(DisclosureMethod).optional(),
  status: z.nativeEnum(DisclosureStatus).optional(),
  recipientType: z.nativeEnum(RecipientType).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  disclosedBy: z.string().uuid().optional(),
  isAccounting: z.boolean().optional(),
  patientRequested: z.boolean().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  sortBy: z.enum(['disclosureDate', 'createdAt', 'recipientName']).optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});

// ============================================================================
// REDUX STATE TYPES
// ============================================================================

/**
 * PHI Disclosure Redux slice state
 */
export interface PhiDisclosureState {
  /** All loaded disclosures */
  disclosures: PhiDisclosure[];
  /** Currently selected disclosure */
  selectedDisclosure: PhiDisclosure | null;
  /** Loading state */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Pagination metadata */
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  /** Current filters */
  filters: PhiDisclosureFilters;
  /** Audit summary */
  auditSummary: DisclosureAuditSummary | null;
}

/**
 * Redux action payloads
 */
export interface SetPhiDisclosuresPayload {
  disclosures: PhiDisclosure[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SetSelectedPhiDisclosurePayload {
  disclosure: PhiDisclosure | null;
}

export interface SetPhiDisclosureFiltersPayload {
  filters: Partial<PhiDisclosureFilters>;
}

export interface SetPhiDisclosureErrorPayload {
  error: string;
}

export interface SetPhiDisclosureAuditSummaryPayload {
  summary: DisclosureAuditSummary;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

/**
 * Props for PHI Disclosure List component
 */
export interface PhiDisclosureListProps {
  studentId?: string;
  onSelectDisclosure?: (disclosure: PhiDisclosure) => void;
  onCreateDisclosure?: () => void;
  showFilters?: boolean;
  compact?: boolean;
}

/**
 * Props for PHI Disclosure Form component
 */
export interface PhiDisclosureFormProps {
  disclosure?: PhiDisclosure | null;
  studentId?: string;
  onSubmit: (data: CreatePhiDisclosureRequest | UpdatePhiDisclosureRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  errors?: Record<string, string>;
}

/**
 * Props for PHI Disclosure Detail component
 */
export interface PhiDisclosureDetailProps {
  disclosure: PhiDisclosure;
  onEdit?: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  onDeny?: () => void;
  onRevoke?: () => void;
  showActions?: boolean;
}

/**
 * Props for Disclosure Audit Summary component
 */
export interface DisclosureAuditSummaryProps {
  summary: DisclosureAuditSummary;
  onGenerateReport?: () => void;
  onExport?: () => void;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * PHI categories for disclosure tracking
 */
export type PhiCategory =
  | 'DEMOGRAPHICS'
  | 'HEALTH_HISTORY'
  | 'ALLERGIES'
  | 'MEDICATIONS'
  | 'IMMUNIZATIONS'
  | 'DIAGNOSES'
  | 'LAB_RESULTS'
  | 'VISIT_NOTES'
  | 'TREATMENT_PLANS'
  | 'EMERGENCY_CONTACTS'
  | 'INSURANCE_INFO'
  | 'MENTAL_HEALTH'
  | 'SUBSTANCE_ABUSE'
  | 'GENETIC_INFO'
  | 'OTHER';

/**
 * Disclosure with populated student data
 */
export type PopulatedPhiDisclosure = PhiDisclosure & {
  student: NonNullable<PhiDisclosure['student']>;
};

/**
 * Disclosure with full audit trail
 */
export type PhiDisclosureWithLogs = PhiDisclosure & {
  logs: DisclosureLog[];
};

/**
 * Minimal disclosure info for lists
 */
export type PhiDisclosureSummary = Pick<
  PhiDisclosure,
  'id' | 'disclosureDate' | 'disclosureType' | 'recipientName' | 'status'
> & {
  studentName: string;
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if disclosure requires accounting
 */
export function requiresAccounting(disclosure: PhiDisclosure): boolean {
  // Disclosures for treatment, payment, and operations typically don't require accounting
  const exemptTypes: DisclosureType[] = [
    DisclosureType.TREATMENT,
    DisclosureType.PAYMENT,
    DisclosureType.OPERATIONS,
  ];

  return !exemptTypes.includes(disclosure.disclosureType) || disclosure.isAccounting;
}

/**
 * Type guard to check if disclosure is pending approval
 */
export function isPendingApproval(disclosure: PhiDisclosure): boolean {
  return disclosure.status === DisclosureStatus.PENDING;
}

/**
 * Type guard to check if disclosure can be edited
 */
export function isEditableDisclosure(disclosure: PhiDisclosure): boolean {
  return [DisclosureStatus.PENDING, DisclosureStatus.DENIED].includes(disclosure.status);
}

/**
 * Type guard to check if NPI is valid
 */
export function isValidNPI(npi: string): boolean {
  return /^\d{10}$/.test(npi);
}
