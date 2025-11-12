/**
 * WF-COMP-319 | healthcare-entities.ts - Healthcare Entity Type Definitions
 * Purpose: Healthcare-specific entity types (providers, contacts, students)
 * Upstream: Backend healthcare models | Dependencies: base-entities, enumerations
 * Downstream: Health records, appointments, student management | Called by: Healthcare components
 * Related: Base entities, enumerations
 * Exports: HealthcareProvider, EmergencyContact, Student | Key Features: Healthcare domain models
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Patient care → Record access → Data display → Clinical decisions
 * LLM Context: Healthcare domain entity types, part of type system refactoring
 */

/**
 * Healthcare Entities Module
 *
 * Defines entity types specific to the healthcare domain including
 * healthcare providers, emergency contacts, and student health records.
 *
 * @module types/core/healthcare-entities
 * @category Types
 */

import type { BasePersonEntity, BaseEntity } from './base-entities';
import type { ContactPriority, Gender } from './enumerations';

/**
 * Healthcare provider entity representing medical professionals.
 *
 * Used to track external healthcare providers associated with students
 * (physicians, specialists, therapists, etc.).
 *
 * @extends {BasePersonEntity}
 * @property {string} [npi] - National Provider Identifier (US)
 * @property {string} [licenseNumber] - Medical license number
 * @property {string} [specialty] - Medical specialty or field
 * @property {string} [organization] - Healthcare organization/practice name
 *
 * @example
 * ```typescript
 * const provider: HealthcareProvider = {
 *   id: 'provider-uuid',
 *   firstName: 'John',
 *   lastName: 'Smith',
 *   email: 'dr.smith@clinic.com',
 *   phone: '+1-555-0100',
 *   npi: '1234567890',
 *   licenseNumber: 'MD12345',
 *   specialty: 'Pediatrics',
 *   organization: 'Children\'s Clinic',
 *   createdAt: '2025-01-01T00:00:00Z',
 *   updatedAt: '2025-01-01T00:00:00Z'
 * };
 * ```
 */
export interface HealthcareProvider extends BasePersonEntity {
  npi?: string;
  licenseNumber?: string;
  specialty?: string;
  organization?: string;
}

/**
 * Emergency contact entity for students.
 *
 * Stores contact information for people to be notified in case of
 * student emergencies or health incidents.
 *
 * @extends {BasePersonEntity}
 * @property {string} relationship - Relationship to student (e.g., "Mother", "Father", "Guardian")
 * @property {string} phoneNumber - Contact phone number (primary contact method)
 * @property {string} [address] - Physical address
 * @property {ContactPriority} priority - Contact priority level
 * @property {boolean} isActive - Whether this contact is currently active
 *
 * @example
 * ```typescript
 * const contact: EmergencyContact = {
 *   id: 'contact-uuid',
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   email: 'jane.doe@email.com',
 *   phone: '+1-555-0123',
 *   relationship: 'Mother',
 *   phoneNumber: '+1-555-0123',
 *   address: '123 Main St, City, ST 12345',
 *   priority: 'PRIMARY',
 *   isActive: true,
 *   createdAt: '2025-01-01T00:00:00Z',
 *   updatedAt: '2025-01-01T00:00:00Z'
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

/**
 * Student entity for healthcare platform.
 *
 * Core entity representing a student in the school health system.
 * Contains demographic information and relationships to health records.
 *
 * **PHI Warning**: This entity contains Protected Health Information.
 * Handle according to HIPAA requirements.
 *
 * @extends {BaseEntity}
 * @property {string} studentNumber - Unique student identifier (school-assigned)
 * @property {string} firstName - Student's first name
 * @property {string} lastName - Student's last name
 * @property {string} dateOfBirth - ISO 8601 date of birth
 * @property {string} grade - Current grade level
 * @property {Gender} gender - Gender identity
 * @property {string} [photo] - URL to student photo
 * @property {string} [medicalRecordNum] - Medical record number
 * @property {boolean} isActive - Whether student is currently enrolled
 * @property {string} enrollmentDate - ISO 8601 enrollment date
 * @property {EmergencyContact[]} [emergencyContacts] - Array of emergency contacts
 * @property {Object} [nurse] - Assigned school nurse information
 * @property {string} nurse.id - Nurse user ID
 * @property {string} nurse.firstName - Nurse first name
 * @property {string} nurse.lastName - Nurse last name
 *
 * @example
 * ```typescript
 * const student: Student = {
 *   id: 'student-uuid',
 *   studentNumber: 'STU2025001',
 *   firstName: 'Alex',
 *   lastName: 'Johnson',
 *   dateOfBirth: '2010-05-15',
 *   grade: '8',
 *   gender: 'MALE',
 *   isActive: true,
 *   enrollmentDate: '2024-08-20',
 *   emergencyContacts: [contact1, contact2],
 *   nurse: {
 *     id: 'nurse-uuid',
 *     firstName: 'Sarah',
 *     lastName: 'Williams'
 *   },
 *   createdAt: '2024-08-20T00:00:00Z',
 *   updatedAt: '2024-08-20T00:00:00Z'
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
