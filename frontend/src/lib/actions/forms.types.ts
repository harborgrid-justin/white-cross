/**
 * @fileoverview Form Builder Type Definitions
 * @module lib/actions/forms.types
 *
 * TypeScript type definitions for form builder system.
 * Contains all interfaces and types used across form modules.
 */

// ==========================================
// ACTION RESULT TYPES
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

// ==========================================
// FORM FIELD TYPES
// ==========================================

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file' | 'signature' | 'ssn' | 'medical';
  label: string;
  name: string;
  required: boolean;
  placeholder?: string;
  description?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  options?: { label: string; value: string }[];
  isPHI?: boolean;
  order: number;
}

// ==========================================
// FORM DEFINITION TYPES
// ==========================================

export interface FormDefinition {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  fields: FormField[];
  settings: {
    allowAnonymous: boolean;
    requireSignature: boolean;
    enableSaveProgress: boolean;
    maxSubmissions?: number;
    expiresAt?: string;
    notificationEmail?: string;
    redirectUrl?: string;
  };
  metadata: {
    isPHI: boolean;
    version: number;
    totalSubmissions: number;
    lastSubmissionAt?: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFormData {
  name: string;
  description?: string;
  category: string;
  fields: FormField[];
  settings: {
    allowAnonymous: boolean;
    requireSignature: boolean;
    enableSaveProgress: boolean;
    maxSubmissions?: number;
    expiresAt?: string;
    notificationEmail?: string;
    redirectUrl?: string;
  };
}

export interface UpdateFormData {
  name?: string;
  description?: string;
  category?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  fields?: FormField[];
  settings?: {
    allowAnonymous?: boolean;
    requireSignature?: boolean;
    enableSaveProgress?: boolean;
    maxSubmissions?: number;
    expiresAt?: string;
    notificationEmail?: string;
    redirectUrl?: string;
  };
  metadata?: {
    isPHI?: boolean;
    version?: number;
    totalSubmissions?: number;
    lastSubmissionAt?: string;
  };
}

// ==========================================
// FORM RESPONSE TYPES
// ==========================================

export interface FormResponse {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  submittedBy?: string;
  submissionId: string;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED' | 'REJECTED';
  phiFields: string[];
  ipAddress: string;
  userAgent: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface CreateFormResponseData {
  formId: string;
  data: Record<string, unknown>;
  status?: 'DRAFT' | 'SUBMITTED';
  notes?: string;
}
