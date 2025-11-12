/**
 * WF-COMP-320 | message-templates.ts - Message template type definitions
 * Purpose: Types for message templates and template rendering
 * Dependencies: communication-enums, core/common
 * Exports: MessageTemplate, TemplateVariable, and related types
 * Last Updated: 2025-11-12 | File Type: .ts
 */

import type { User, EmergencyContact, BaseEntity } from '../../core/common';
import { MessageType, MessageCategory } from './communication-enums';

// =====================
// REFERENCE TYPES
// =====================

/**
 * Minimal student reference to avoid circular dependencies
 */
type StudentReference = {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
};

/**
 * Minimal appointment reference for template context
 */
export interface AppointmentReference {
  id: string;
  date: string;
  time: string;
  type?: string;
}

/**
 * Minimal medication reference for template context
 */
export interface MedicationReference {
  id: string;
  name: string;
  dosage?: string;
  frequency?: string;
}

/**
 * Minimal incident reference for template context
 */
export interface IncidentReference {
  id: string;
  type: string;
  date: string;
  severity?: string;
}

// =====================
// MESSAGE TEMPLATE TYPES
// =====================

/**
 * Message Template entity
 *
 * @aligned_with backend/src/database/models/communication/MessageTemplate.ts
 *
 * Validation constraints:
 * - name: 3-100 characters, required
 * - subject: 0-255 characters, optional
 * - content: 1-50000 characters, required
 * - variables: Array of strings (alphanumeric + underscore only), max 50 items
 *
 * PHI/PII Fields:
 * - createdById: User identifier who created the template (PII)
 * - content: Template content may reference PHI through variables
 */
export interface MessageTemplate extends BaseEntity {
  name: string;
  subject?: string;
  content: string; // May contain PHI variable references
  type: MessageType;
  category: MessageCategory;
  variables?: string[];
  isActive: boolean;
  createdById: string; // PII - User identifier
  createdBy?: User;
}

/**
 * Create Message Template request data
 */
export interface CreateMessageTemplateData {
  name: string;
  subject?: string;
  content: string;
  type: MessageType;
  category: MessageCategory;
  variables?: string[];
  isActive?: boolean;
}

/**
 * Update Message Template request data
 */
export interface UpdateMessageTemplateData {
  name?: string;
  subject?: string;
  content?: string;
  type?: MessageType;
  category?: MessageCategory;
  variables?: string[];
  isActive?: boolean;
}

/**
 * Message Template filters
 */
export interface MessageTemplateFilters {
  type?: MessageType;
  category?: MessageCategory;
  isActive?: boolean;
}

// =====================
// TEMPLATE VARIABLES
// =====================

/**
 * Template Variable definition
 */
export interface TemplateVariable {
  key: string;
  label: string;
  description: string;
  example: string;
  required: boolean;
  type: 'string' | 'number' | 'date' | 'boolean';
}

/**
 * Template rendering context
 */
export interface TemplateRenderContext {
  student?: StudentReference;
  emergencyContact?: EmergencyContact;
  appointment?: AppointmentReference;
  medication?: MedicationReference;
  incident?: IncidentReference;
  customData?: Record<string, unknown>;
}
