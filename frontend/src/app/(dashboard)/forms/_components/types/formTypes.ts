/**
 * Type definitions for healthcare forms management system
 *
 * This file contains all type definitions, interfaces, and enums used throughout
 * the forms management components. Centralizing types ensures consistency and
 * makes it easier to maintain type safety across the application.
 */

/**
 * Healthcare form type categories
 */
export type FormType =
  | 'enrollment'
  | 'health_screening'
  | 'incident_report'
  | 'permission_slip'
  | 'medical_consent'
  | 'emergency_contact'
  | 'allergy_form'
  | 'medication_authorization'
  | 'assessment'
  | 'survey'
  | 'other';

/**
 * Form publication and lifecycle status
 */
export type FormStatus =
  | 'draft'      // Form is being created/edited
  | 'published'  // Form is live and accepting responses
  | 'paused'     // Form is temporarily not accepting responses
  | 'archived';  // Form is no longer active

/**
 * Form priority level for healthcare compliance
 */
export type FormPriority =
  | 'low'       // Standard forms
  | 'normal'    // Regular priority
  | 'high'      // Important forms requiring attention
  | 'critical'; // HIPAA-critical or time-sensitive forms

/**
 * Individual form field definition
 */
export interface FormField {
  /** Unique identifier for the field */
  id: string;

  /** Field input type */
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'email'
    | 'phone'
    | 'date'
    | 'time'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'file'
    | 'signature'
    | 'section_header'
    | 'paragraph';

  /** Field label displayed to users */
  label: string;

  /** Optional placeholder text */
  placeholder?: string;

  /** Whether the field must be completed */
  required: boolean;

  /** Field validation rules */
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customMessage?: string;
  };

  /** Options for select, radio, or checkbox fields */
  options?: string[];

  /** Conditional logic for showing/hiding field */
  conditionalLogic?: {
    dependsOn: string;
    condition: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: string;
  };
}

/**
 * Complete healthcare form definition
 */
export interface HealthcareForm {
  /** Unique form identifier */
  id: string;

  /** Form title */
  title: string;

  /** Form description */
  description: string;

  /** Form category type */
  type: FormType;

  /** Current form status */
  status: FormStatus;

  /** Form priority level */
  priority: FormPriority;

  /** Form version number */
  version: number;

  /** User who created the form */
  createdBy: {
    id: string;
    name: string;
    role: string;
  };

  /** Form creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;

  /** Publication timestamp (if published) */
  publishedAt?: Date;

  /** Array of form fields */
  fields: FormField[];

  /** Form configuration settings */
  settings: {
    /** Allow anonymous submissions */
    allowAnonymous: boolean;

    /** Require user authentication */
    requireAuthentication: boolean;

    /** Allow multiple submissions per user */
    multipleSubmissions: boolean;

    /** Enable auto-save functionality */
    autoSave: boolean;

    /** Show progress bar */
    progressBar: boolean;

    /** Thank you message after submission */
    thankYouMessage: string;

    /** Redirect URL after submission */
    redirectUrl?: string;

    /** Email addresses for notifications */
    emailNotifications: string[];

    /** Data retention period in days */
    dataRetentionDays?: number;

    /** Require HIPAA consent */
    requiresHIPAAConsent: boolean;
  };

  /** Form analytics and metrics */
  analytics: {
    /** Total form views */
    views: number;

    /** Total form submissions */
    submissions: number;

    /** Completion rate percentage */
    completionRate: number;

    /** Average time to complete (minutes) */
    averageCompletionTime: number;

    /** Last submission timestamp */
    lastSubmission?: Date;

    /** Fields where users drop off */
    dropOffPoints: Array<{
      fieldId: string;
      dropOffRate: number;
    }>;
  };

  /** Form sharing and access settings */
  sharing: {
    /** Is form publicly accessible */
    isPublic: boolean;

    /** Public URL for the form */
    publicUrl?: string;

    /** QR code URL for easy access */
    qrCodeUrl?: string;

    /** Password protection */
    password?: string;

    /** Expiration date for form access */
    expiresAt?: Date;
  };

  /** Tags for organization and search */
  tags: string[];
}

/**
 * Aggregated statistics for all forms
 */
export interface FormStats {
  /** Total number of forms */
  totalForms: number;

  /** Number of published forms */
  activeForms: number;

  /** Number of draft forms */
  draftForms: number;

  /** Total responses across all forms */
  totalResponses: number;

  /** Responses received today */
  todayResponses: number;

  /** Average completion rate across all forms */
  averageCompletionRate: number;

  /** Number of critical priority forms */
  criticalForms: number;

  /** Forms expiring within a week */
  expiringSoon: number;
}

/**
 * Props for the FormsContent main component
 */
export interface FormsContentProps {
  /** Initial forms data (optional) */
  initialForms?: HealthcareForm[];

  /** Current user role for permission checks */
  userRole?: string;
}

/**
 * View mode for displaying forms
 */
export type ViewMode = 'grid' | 'list';

/**
 * Sort field options
 */
export type SortField = 'title' | 'created' | 'updated' | 'responses' | 'completion_rate';

/**
 * Sort order options
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Bulk action types
 */
export type BulkAction = 'publish' | 'archive' | 'delete';
