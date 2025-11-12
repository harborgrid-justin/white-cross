/**
 * Type definitions for Communication Templates
 *
 * This module contains all TypeScript interfaces and type definitions
 * used by the CommunicationTemplates component and its sub-components.
 */

/**
 * Communication template data structure
 */
export interface CommunicationTemplate {
  /** Unique identifier */
  id: string;
  /** Template name */
  name: string;
  /** Communication type */
  type: 'email' | 'sms' | 'phone_script' | 'chat';
  /** Template category */
  category: 'emergency' | 'routine' | 'appointment' | 'medication' | 'general';
  /** Email subject line (optional, for email templates) */
  subject?: string;
  /** Template content with variable placeholders */
  content: string;
  /** List of variable names used in the template */
  variables: string[];
  /** Tags for categorization and search */
  tags: string[];
  /** Whether the template is active and available for use */
  isActive: boolean;
  /** Number of times this template has been used */
  usage_count: number;
  /** User who created the template */
  created_by: string;
  /** ISO timestamp of creation */
  created_at: string;
  /** ISO timestamp of last update */
  updated_at: string;
  /** ISO timestamp of last usage (optional) */
  last_used?: string;
}

/**
 * Template filter options
 */
export interface TemplateFilters {
  /** Search query string */
  search: string;
  /** Filter by template type */
  type: string;
  /** Filter by template category */
  category: string;
  /** Filter by tags */
  tags: string[];
  /** Filter by active status */
  status: 'all' | 'active' | 'inactive';
  /** Sort field */
  sortBy: 'name' | 'usage_count' | 'created_at' | 'updated_at';
  /** Sort direction */
  sortOrder: 'asc' | 'desc';
}

/**
 * Props for the CommunicationTemplates component
 */
export interface CommunicationTemplatesProps {
  /** Additional CSS classes */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Callback when template is selected for use */
  onUseTemplate?: (template: CommunicationTemplate) => void;
  /** Callback when template is edited */
  onEditTemplate?: (template: CommunicationTemplate) => void;
  /** Callback when template is deleted */
  onDeleteTemplate?: (templateId: string) => void;
  /** Callback when new template is created */
  onCreateTemplate?: () => void;
}
