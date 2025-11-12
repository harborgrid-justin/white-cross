/**
 * WF-COMP-319 | healthcare-types.ts - Healthcare Domain Type Definitions
 * Purpose: Domain-specific types for healthcare entities and operations
 * Upstream: Backend healthcare models | Dependencies: base-entities.ts, enums.ts
 * Downstream: Healthcare components, services | Called by: Health features
 * Related: student types, appointment types, medication types
 * Exports: User, Student, healthcare provider, file types
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Entity creation → Business logic → Healthcare operations
 * LLM Context: Healthcare domain types extracted from common.ts
 */

import type { BaseEntity, BasePersonEntity } from './base-entities';
import type { Gender, ContactPriority } from './enums';

/**
 * Healthcare Types Module
 *
 * Domain-specific type definitions for healthcare entities including
 * users, students, emergency contacts, and healthcare providers.
 * These types represent the core domain model of the healthcare platform.
 *
 * @module types/core/healthcare-types
 * @category Types
 */

// ============================================================================
// USER TYPES
// ============================================================================

/**
 * User entity representing authenticated system users.
 *
 * Aligned with backend User model. Contains user profile information,
 * authentication status, and organizational relationships.
 *
 * **Security Note**: Sensitive fields (password, tokens, secrets) are
 * excluded from frontend types for security.
 *
 * **PHI Warning**: firstName and lastName may be considered PHI in
 * healthcare context. Handle according to HIPAA requirements.
 *
 * @property {string} id - Unique user identifier (UUID v4)
 * @property {string} email - User email address (unique, used for login)
 * @property {string} firstName - User's first name (1-100 chars)
 * @property {string} lastName - User's last name (1-100 chars)
 * @property {string} role - User role (see UserRole type from enums.ts)
 * @property {string[]} [permissions] - User permissions for RBAC
 * @property {unknown} [user] - Optional nested user data for complex authentication scenarios
 * @property {boolean} isActive - Account active status (inactive users cannot login)
 * @property {string} [lastLogin] - ISO 8601 timestamp of last successful login
 * @property {string} [schoolId] - Associated school UUID (for school-level users)
 * @property {string} [districtId] - Associated district UUID (for district-level users)
 * @property {string} [phone] - Contact phone number (E.164 format preferred)
 * @property {boolean} emailVerified - Email verification status
 * @property {boolean} twoFactorEnabled - Two-factor authentication enabled status
 * @property {string} [lockoutUntil] - ISO 8601 timestamp until account is locked
 * @property {string} [lastPasswordChange] - ISO 8601 timestamp of last password change
 * @property {boolean} mustChangePassword - Forces password change on next login
 * @property {string} createdAt - ISO 8601 creation timestamp
 * @property {string} updatedAt - ISO 8601 last update timestamp
 *
 * @see {@link backend/src/database/models/core/User.ts} Backend User model
 *
 * @example
 * ```typescript
 * const user: User = {
 *   id: 'a1b2c3d4-...',
 *   email: 'nurse@school.edu',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   role: 'NURSE',
 *   isActive: true,
 *   emailVerified: true,
 *   twoFactorEnabled: false,
 *   mustChangePassword: false,
 *   createdAt: '2025-01-15T10:00:00Z',
 *   updatedAt: '2025-01-15T10:00:00Z'
 * };
 * ```
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions?: string[];
  user?: unknown;
  isActive: boolean;
  lastLogin?: string;
  schoolId?: string;
  districtId?: string;
  phone?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lockoutUntil?: string;
  lastPasswordChange?: string;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// STUDENT TYPES
// ============================================================================

/**
 * Student interface for healthcare platform
 *
 * Core student entity representing a student enrolled in the healthcare system.
 * Contains demographic information, enrollment details, and relationships to
 * emergency contacts and assigned nurses.
 *
 * @extends {BaseEntity}
 * @property {string} studentNumber - Unique student identifier within school/district
 * @property {string} firstName - Student's first name
 * @property {string} lastName - Student's last name
 * @property {string} dateOfBirth - ISO 8601 date of birth
 * @property {string} grade - Student's grade level (e.g., 'K', '1', '12')
 * @property {Gender} gender - Student's gender identity
 * @property {string} [photo] - URL or path to student photo
 * @property {string} [medicalRecordNum] - External medical record number
 * @property {boolean} isActive - Student active enrollment status
 * @property {string} enrollmentDate - ISO 8601 enrollment date
 * @property {EmergencyContact[]} [emergencyContacts] - Array of emergency contacts
 * @property {Object} [nurse] - Assigned nurse information
 * @property {string} nurse.id - Nurse user ID
 * @property {string} nurse.firstName - Nurse first name
 * @property {string} nurse.lastName - Nurse last name
 *
 * @example
 * ```typescript
 * const student: Student = {
 *   id: 'student-uuid',
 *   studentNumber: 'S12345',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: '2010-05-15',
 *   grade: '7',
 *   gender: 'MALE',
 *   isActive: true,
 *   enrollmentDate: '2023-08-20',
 *   createdAt: '2023-08-20T00:00:00Z',
 *   updatedAt: '2023-08-20T00:00:00Z'
 * };
 * ```
 */
export interface Student extends BaseEntity {
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  gender: Gender;
  photo?: string;
  medicalRecordNum?: string;
  isActive: boolean;
  enrollmentDate: string;
  emergencyContacts?: EmergencyContact[];
  nurse?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// ============================================================================
// EMERGENCY CONTACT TYPES
// ============================================================================

/**
 * Emergency contact interface for student relationships.
 *
 * Represents a person who can be contacted in case of a student emergency.
 * Includes contact priority and relationship information.
 *
 * @extends {BasePersonEntity}
 * @property {string} relationship - Relationship to student (e.g., 'Mother', 'Father', 'Guardian')
 * @property {string} phoneNumber - Primary contact phone number (required)
 * @property {string} [address] - Physical address for emergency contact
 * @property {ContactPriority} priority - Contact priority level
 * @property {boolean} isActive - Whether contact is currently active
 *
 * @example
 * ```typescript
 * const contact: EmergencyContact = {
 *   id: 'contact-uuid',
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   email: 'jane.doe@example.com',
 *   phone: '+1-555-0123',
 *   relationship: 'Mother',
 *   phoneNumber: '+1-555-0123',
 *   priority: 'PRIMARY',
 *   isActive: true,
 *   createdAt: '2023-08-20T00:00:00Z',
 *   updatedAt: '2023-08-20T00:00:00Z'
 * };
 * ```
 */
export interface EmergencyContact extends BasePersonEntity {
  relationship: string;
  phoneNumber: string;
  address?: string;
  priority: ContactPriority;
  isActive: boolean;
}

// ============================================================================
// HEALTHCARE PROVIDER TYPES
// ============================================================================

/**
 * Healthcare provider interface for external medical professionals.
 *
 * Represents physicians, specialists, and other healthcare providers
 * associated with student care.
 *
 * @extends {BasePersonEntity}
 * @property {string} [npi] - National Provider Identifier (US)
 * @property {string} [licenseNumber] - State medical license number
 * @property {string} [specialty] - Medical specialty or practice area
 * @property {string} [organization] - Healthcare organization or practice name
 *
 * @example
 * ```typescript
 * const provider: HealthcareProvider = {
 *   id: 'provider-uuid',
 *   firstName: 'John',
 *   lastName: 'Smith',
 *   email: 'dr.smith@hospital.com',
 *   phone: '+1-555-0199',
 *   npi: '1234567890',
 *   licenseNumber: 'MD123456',
 *   specialty: 'Pediatrics',
 *   organization: 'Children\'s Hospital',
 *   createdAt: '2023-08-20T00:00:00Z',
 *   updatedAt: '2023-08-20T00:00:00Z'
 * };
 * ```
 */
export interface HealthcareProvider extends BasePersonEntity {
  npi?: string;
  licenseNumber?: string;
  specialty?: string;
  organization?: string;
}

// ============================================================================
// NOTIFICATION PREFERENCES
// ============================================================================

/**
 * Notification preferences for users and contacts.
 *
 * Defines which notification channels are enabled for a user or contact.
 *
 * @property {boolean} email - Enable email notifications
 * @property {boolean} sms - Enable SMS/text notifications
 * @property {boolean} push - Enable push notifications (mobile/browser)
 * @property {boolean} inApp - Enable in-app notifications
 * @property {boolean} [emergencyOnly] - Only notify for emergency situations
 *
 * @example
 * ```typescript
 * const preferences: NotificationPreferences = {
 *   email: true,
 *   sms: true,
 *   push: false,
 *   inApp: true,
 *   emergencyOnly: false
 * };
 * ```
 */
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  emergencyOnly?: boolean;
}

// ============================================================================
// FILE AND DOCUMENT TYPES
// ============================================================================

/**
 * File upload metadata interface.
 *
 * Represents a file that has been uploaded or is being uploaded to the system.
 *
 * @property {string} name - Original filename
 * @property {number} size - File size in bytes
 * @property {string} type - MIME type (e.g., 'application/pdf', 'image/jpeg')
 * @property {string} [url] - URL to access the uploaded file
 * @property {string} [uploadedAt] - ISO 8601 timestamp of upload completion
 * @property {string} [uploadedBy] - UUID of user who uploaded the file
 *
 * @example
 * ```typescript
 * const file: FileUpload = {
 *   name: 'medical-form.pdf',
 *   size: 245678,
 *   type: 'application/pdf',
 *   url: 'https://storage.example.com/files/abc123',
 *   uploadedAt: '2025-01-15T10:30:00Z',
 *   uploadedBy: 'user-uuid'
 * };
 * ```
 */
export interface FileUpload {
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt?: string;
  uploadedBy?: string;
}

/**
 * Document reference interface for stored documents.
 *
 * Represents a document that has been permanently stored in the system.
 *
 * @property {string} id - Unique document identifier
 * @property {string} name - Document name or title
 * @property {string} type - Document type or category
 * @property {string} url - URL to access the document
 * @property {number} [size] - Document size in bytes
 * @property {string} createdAt - ISO 8601 creation timestamp
 * @property {string} [createdBy] - UUID of user who created the document
 *
 * @example
 * ```typescript
 * const document: DocumentReference = {
 *   id: 'doc-uuid',
 *   name: 'Immunization Record',
 *   type: 'MEDICAL_RECORD',
 *   url: 'https://storage.example.com/docs/xyz789',
 *   size: 123456,
 *   createdAt: '2025-01-15T10:00:00Z',
 *   createdBy: 'nurse-uuid'
 * };
 * ```
 */
export interface DocumentReference {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
  createdAt: string;
  createdBy?: string;
}
