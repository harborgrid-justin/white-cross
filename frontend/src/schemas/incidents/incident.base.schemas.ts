/**
 * @fileoverview Base Incident Schema
 * @module schemas/incidents/incident.base
 *
 * Core incident schema with common fields shared across all incident types.
 * Provides foundational structure for incident reporting and tracking.
 */

import { z } from 'zod';
import {
  IncidentType,
  IncidentStatus,
  IncidentSeverity,
  LocationType,
  MedicalResponse,
  ParentNotificationMethod,
} from './incident.enums.schemas';

// ==========================================
// NESTED OBJECT SCHEMAS
// ==========================================

/**
 * Attachment Schema
 * Documents, photos, or files associated with incident
 */
export const AttachmentSchema = z.object({
  id: z.string().uuid(),
  filename: z.string(),
  url: z.string().url(),
  uploadedAt: z.string().datetime(),
  uploadedBy: z.string().uuid(),
});

export type Attachment = z.infer<typeof AttachmentSchema>;

// ==========================================
// BASE INCIDENT SCHEMA
// ==========================================

/**
 * Base Incident Report Schema
 * Common fields for all incident types with comprehensive tracking and compliance fields
 *
 * @remarks
 * This schema includes:
 * - Student and reporter identification
 * - Date/time tracking for incident and reporting
 * - Location details with structured and free-text fields
 * - Medical response and parent notification tracking
 * - Audit trail for legal compliance
 * - Attachment support for evidence documentation
 * - Privacy and access control flags
 */
export const BaseIncidentSchema = z.object({
  // ==========================================
  // IDENTIFICATION
  // ==========================================
  id: z.string().uuid().optional(),
  incidentNumber: z.string().optional(), // Auto-generated: INC-2024-0001

  // ==========================================
  // CLASSIFICATION
  // ==========================================
  type: IncidentType,
  status: IncidentStatus.default('PENDING_REVIEW'),
  severity: IncidentSeverity,

  // ==========================================
  // STUDENT INFORMATION
  // ==========================================
  studentId: z.string().uuid({ message: 'Student is required and must be a valid UUID' }),
  studentName: z.string().optional(), // Denormalized for quick access
  studentGrade: z.string().optional(),

  // ==========================================
  // DATE/TIME INFORMATION
  // ==========================================
  incidentDate: z.string().datetime({ message: 'Incident date and time are required' }),
  reportedDate: z.string().datetime().optional(), // When reported (may differ from incident)

  // ==========================================
  // LOCATION INFORMATION
  // ==========================================
  location: LocationType,
  locationDetails: z.string().min(1, 'Location details are required').max(500),

  // ==========================================
  // INCIDENT DETAILS
  // ==========================================
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),

  // ==========================================
  // REPORTER INFORMATION
  // ==========================================
  reportedBy: z.string().uuid({ message: 'Reporter is required and must be a valid UUID' }),
  reportedByName: z.string().optional(),
  reportedByRole: z.string().optional(),

  // ==========================================
  // MEDICAL RESPONSE
  // ==========================================
  medicalResponse: MedicalResponse.default('NONE'),
  medicalNotes: z.string().max(2000).optional(),

  // ==========================================
  // PARENT/GUARDIAN NOTIFICATION
  // ==========================================
  parentNotified: z.boolean().default(false),
  parentNotifiedAt: z.string().datetime().optional(),
  parentNotifiedBy: z.string().optional(),
  parentNotificationMethod: ParentNotificationMethod.optional(),

  // ==========================================
  // FOLLOW-UP
  // ==========================================
  requiresFollowUp: z.boolean().default(false),
  followUpNotes: z.string().max(2000).optional(),

  // ==========================================
  // AUDIT TRAIL
  // ==========================================
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),

  // ==========================================
  // LEGAL & COMPLIANCE
  // ==========================================
  legalReviewRequired: z.boolean().default(false),
  legalReviewedAt: z.string().datetime().optional(),
  legalReviewedBy: z.string().optional(),

  // ==========================================
  // ATTACHMENTS
  // ==========================================
  attachments: z.array(AttachmentSchema).optional(),

  // ==========================================
  // CATEGORIZATION
  // ==========================================
  tags: z.array(z.string()).optional(),

  // ==========================================
  // PRIVACY & ACCESS CONTROL
  // ==========================================
  isConfidential: z.boolean().default(false),
  restrictedAccess: z.boolean().default(false),
});

export type BaseIncident = z.infer<typeof BaseIncidentSchema>;
