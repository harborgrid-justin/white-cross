/**
 * WF-COMM-TEMPLATES-TYPES | Template Type Definitions
 * Purpose: Shared TypeScript interfaces and types for template management
 * Upstream: Communications system | Dependencies: None
 * Downstream: Template components | Called by: All template components
 * Related: Template management, message composition
 * Exports: MessageTemplate, TemplateCategory, template constants
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Type safety for template operations
 * LLM Context: Central type definitions for template system
 */

/**
 * Message template definition
 */
export interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  content: string;
  variables: string[];
  usage: number;
  lastUsed?: string;
  createdAt: string;
  createdBy: string;
  isPublic: boolean;
}

/**
 * Template category definition
 */
export interface TemplateCategory {
  value: string;
  label: string;
}

/**
 * Template editor form state
 */
export interface TemplateFormData {
  name: string;
  category: string;
  subject: string;
  content: string;
  isPublic: boolean;
}

/**
 * Template filter state
 */
export interface TemplateFilters {
  searchTerm: string;
  category: string;
}

/**
 * Props for template selection callback
 */
export type OnTemplateSelected = (template: MessageTemplate) => void;

/**
 * Template categories available in the system
 */
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'medications', label: 'Medications' },
  { value: 'health-screenings', label: 'Health Screenings' },
  { value: 'immunizations', label: 'Immunizations' },
  { value: 'allergies', label: 'Allergies' },
  { value: 'health-alerts', label: 'Health Alerts' },
  { value: 'permissions', label: 'Permission Slips' },
  { value: 'injuries', label: 'Injuries/Incidents' },
  { value: 'general', label: 'General Communication' },
];

/**
 * Initial form state for new templates
 */
export const INITIAL_TEMPLATE_FORM: TemplateFormData = {
  name: '',
  category: 'general',
  subject: '',
  content: '',
  isPublic: true,
};
