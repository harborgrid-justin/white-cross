/**
 * Advanced Filter Types
 *
 * Type definitions for advanced filtering capabilities
 */

import { z } from 'zod';
import { FilterOperator, SearchEntityType } from './search.types';

// ==================== Filter Field Types ====================

export enum FilterFieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  DATE_RANGE = 'date_range',
  NUMBER_RANGE = 'number_range',
  AUTOCOMPLETE = 'autocomplete',
}

export interface FilterFieldDefinition {
  id: string;
  label: string;
  fieldType: FilterFieldType;
  operators: FilterOperator[];
  defaultOperator: FilterOperator;
  options?: FilterOption[];
  placeholder?: string;
  validation?: z.ZodSchema;
  isRequired?: boolean;
  isMultiple?: boolean;
  entityType?: SearchEntityType;
  dependsOn?: string; // Field ID that this filter depends on
  asyncOptions?: (query: string) => Promise<FilterOption[]>;
}

export interface FilterOption {
  value: string | number | boolean;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
  count?: number; // For faceted filters
}

// ==================== Date Filter Types ====================

export enum DateRangePreset {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  THIS_WEEK = 'this_week',
  LAST_WEEK = 'last_week',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',
  THIS_QUARTER = 'this_quarter',
  LAST_QUARTER = 'last_quarter',
  THIS_YEAR = 'this_year',
  LAST_YEAR = 'last_year',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_90_DAYS = 'last_90_days',
  CUSTOM = 'custom',
}

export interface DateRangeFilter {
  preset?: DateRangePreset;
  startDate?: Date;
  endDate?: Date;
}

export const DateRangeFilterSchema = z.object({
  preset: z.nativeEnum(DateRangePreset).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}).refine(
  data => {
    if (data.preset === DateRangePreset.CUSTOM) {
      return data.startDate && data.endDate;
    }
    return true;
  },
  { message: 'Custom date range requires both start and end dates' }
);

// ==================== Number Range Filter ====================

export interface NumberRangeFilter {
  min?: number;
  max?: number;
  unit?: string;
}

export const NumberRangeFilterSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  unit: z.string().optional(),
}).refine(
  data => data.min !== undefined || data.max !== undefined,
  { message: 'At least one of min or max must be provided' }
);

// ==================== Filter Builder Types ====================

export interface FilterBuilderRule {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  fieldDefinition: FilterFieldDefinition;
}

export interface FilterBuilderGroup {
  id: string;
  operator: 'AND' | 'OR';
  rules: (FilterBuilderRule | FilterBuilderGroup)[];
}

export const FilterBuilderRuleSchema = z.object({
  id: z.string(),
  field: z.string(),
  operator: z.nativeEnum(FilterOperator),
  value: z.any(),
});

// ==================== Saved Filter Types ====================

export interface SavedFilter {
  id: string;
  name: string;
  description?: string;
  entityType: SearchEntityType;
  filters: FilterBuilderGroup;
  isShared: boolean;
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  tags?: string[];
}

export const SavedFilterSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  entityType: z.nativeEnum(SearchEntityType),
  filters: z.any(), // FilterBuilderGroup
  isShared: z.boolean().default(false),
  isDefault: z.boolean().default(false),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  usageCount: z.number().default(0),
  tags: z.array(z.string()).optional(),
});

// ==================== Filter Preset Types ====================

export interface FilterPresetCategory {
  id: string;
  name: string;
  icon?: string;
  presets: FilterPreset[];
}

export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  entityType: SearchEntityType;
  category?: string;
  filters: FilterBuilderGroup;
  icon?: string;
  color?: string;
  isPredefined: boolean;
}

// ==================== Entity-Specific Filter Definitions ====================

export const STUDENT_FILTERS: FilterFieldDefinition[] = [
  {
    id: 'grade',
    label: 'Grade',
    fieldType: FilterFieldType.SELECT,
    operators: [FilterOperator.EQUALS, FilterOperator.IN],
    defaultOperator: FilterOperator.EQUALS,
    options: [
      { value: 'PK', label: 'Pre-K' },
      { value: 'K', label: 'Kindergarten' },
      { value: '1', label: '1st Grade' },
      { value: '2', label: '2nd Grade' },
      { value: '3', label: '3rd Grade' },
      { value: '4', label: '4th Grade' },
      { value: '5', label: '5th Grade' },
      { value: '6', label: '6th Grade' },
      { value: '7', label: '7th Grade' },
      { value: '8', label: '8th Grade' },
      { value: '9', label: '9th Grade' },
      { value: '10', label: '10th Grade' },
      { value: '11', label: '11th Grade' },
      { value: '12', label: '12th Grade' },
    ],
    isMultiple: true,
  },
  {
    id: 'schoolId',
    label: 'School',
    fieldType: FilterFieldType.SELECT,
    operators: [FilterOperator.EQUALS, FilterOperator.IN],
    defaultOperator: FilterOperator.EQUALS,
    isMultiple: true,
    // Options loaded dynamically from schools API
  },
  {
    id: 'isActive',
    label: 'Active Status',
    fieldType: FilterFieldType.BOOLEAN,
    operators: [FilterOperator.EQUALS],
    defaultOperator: FilterOperator.EQUALS,
    options: [
      { value: true, label: 'Active' },
      { value: false, label: 'Inactive' },
    ],
  },
  {
    id: 'hasHealthConditions',
    label: 'Has Health Conditions',
    fieldType: FilterFieldType.BOOLEAN,
    operators: [FilterOperator.EQUALS],
    defaultOperator: FilterOperator.EQUALS,
  },
  {
    id: 'hasMedications',
    label: 'Has Active Medications',
    fieldType: FilterFieldType.BOOLEAN,
    operators: [FilterOperator.EQUALS],
    defaultOperator: FilterOperator.EQUALS,
  },
  {
    id: 'enrollmentDate',
    label: 'Enrollment Date',
    fieldType: FilterFieldType.DATE_RANGE,
    operators: [FilterOperator.BETWEEN, FilterOperator.GREATER_THAN, FilterOperator.LESS_THAN],
    defaultOperator: FilterOperator.BETWEEN,
  },
];

export const MEDICATION_FILTERS: FilterFieldDefinition[] = [
  {
    id: 'medicationType',
    label: 'Medication Type',
    fieldType: FilterFieldType.SELECT,
    operators: [FilterOperator.EQUALS, FilterOperator.IN],
    defaultOperator: FilterOperator.EQUALS,
    options: [
      { value: 'prescription', label: 'Prescription' },
      { value: 'otc', label: 'Over-the-Counter' },
      { value: 'controlled', label: 'Controlled Substance' },
      { value: 'supplement', label: 'Supplement' },
    ],
    isMultiple: true,
  },
  {
    id: 'isActive',
    label: 'Status',
    fieldType: FilterFieldType.SELECT,
    operators: [FilterOperator.EQUALS],
    defaultOperator: FilterOperator.EQUALS,
    options: [
      { value: true, label: 'Active' },
      { value: false, label: 'Inactive' },
    ],
  },
  {
    id: 'expirationDate',
    label: 'Expiration Date',
    fieldType: FilterFieldType.DATE_RANGE,
    operators: [FilterOperator.BETWEEN, FilterOperator.LESS_THAN],
    defaultOperator: FilterOperator.LESS_THAN,
  },
  {
    id: 'requiresAuthorization',
    label: 'Requires Authorization',
    fieldType: FilterFieldType.BOOLEAN,
    operators: [FilterOperator.EQUALS],
    defaultOperator: FilterOperator.EQUALS,
  },
  {
    id: 'dosageFrequency',
    label: 'Dosage Frequency',
    fieldType: FilterFieldType.SELECT,
    operators: [FilterOperator.EQUALS, FilterOperator.IN],
    defaultOperator: FilterOperator.EQUALS,
    options: [
      { value: 'daily', label: 'Daily' },
      { value: 'twice_daily', label: 'Twice Daily' },
      { value: 'three_times_daily', label: 'Three Times Daily' },
      { value: 'as_needed', label: 'As Needed' },
      { value: 'weekly', label: 'Weekly' },
    ],
    isMultiple: true,
  },
];

export const DOCUMENT_FILTERS: FilterFieldDefinition[] = [
  {
    id: 'documentType',
    label: 'Document Type',
    fieldType: FilterFieldType.SELECT,
    operators: [FilterOperator.EQUALS, FilterOperator.IN],
    defaultOperator: FilterOperator.EQUALS,
    options: [
      { value: 'medical_record', label: 'Medical Record' },
      { value: 'consent_form', label: 'Consent Form' },
      { value: 'immunization_record', label: 'Immunization Record' },
      { value: 'report', label: 'Report' },
      { value: 'note', label: 'Note' },
      { value: 'other', label: 'Other' },
    ],
    isMultiple: true,
  },
  {
    id: 'fileType',
    label: 'File Type',
    fieldType: FilterFieldType.SELECT,
    operators: [FilterOperator.EQUALS, FilterOperator.IN],
    defaultOperator: FilterOperator.EQUALS,
    options: [
      { value: 'pdf', label: 'PDF' },
      { value: 'doc', label: 'Word Document' },
      { value: 'xlsx', label: 'Excel Spreadsheet' },
      { value: 'jpg', label: 'JPEG Image' },
      { value: 'png', label: 'PNG Image' },
    ],
    isMultiple: true,
  },
  {
    id: 'uploadDate',
    label: 'Upload Date',
    fieldType: FilterFieldType.DATE_RANGE,
    operators: [FilterOperator.BETWEEN, FilterOperator.GREATER_THAN],
    defaultOperator: FilterOperator.BETWEEN,
  },
  {
    id: 'fileSize',
    label: 'File Size (MB)',
    fieldType: FilterFieldType.NUMBER_RANGE,
    operators: [FilterOperator.BETWEEN, FilterOperator.LESS_THAN],
    defaultOperator: FilterOperator.LESS_THAN,
  },
  {
    id: 'isPHI',
    label: 'Contains PHI',
    fieldType: FilterFieldType.BOOLEAN,
    operators: [FilterOperator.EQUALS],
    defaultOperator: FilterOperator.EQUALS,
  },
];

export const APPOINTMENT_FILTERS: FilterFieldDefinition[] = [
  {
    id: 'appointmentType',
    label: 'Appointment Type',
    fieldType: FilterFieldType.SELECT,
    operators: [FilterOperator.EQUALS, FilterOperator.IN],
    defaultOperator: FilterOperator.EQUALS,
    options: [
      { value: 'checkup', label: 'Checkup' },
      { value: 'follow_up', label: 'Follow-up' },
      { value: 'medication', label: 'Medication Administration' },
      { value: 'screening', label: 'Screening' },
      { value: 'emergency', label: 'Emergency' },
    ],
    isMultiple: true,
  },
  {
    id: 'status',
    label: 'Status',
    fieldType: FilterFieldType.SELECT,
    operators: [FilterOperator.EQUALS, FilterOperator.IN],
    defaultOperator: FilterOperator.EQUALS,
    options: [
      { value: 'scheduled', label: 'Scheduled', color: 'blue' },
      { value: 'completed', label: 'Completed', color: 'green' },
      { value: 'cancelled', label: 'Cancelled', color: 'red' },
      { value: 'no-show', label: 'No Show', color: 'orange' },
    ],
    isMultiple: true,
  },
  {
    id: 'scheduledDate',
    label: 'Appointment Date',
    fieldType: FilterFieldType.DATE_RANGE,
    operators: [FilterOperator.BETWEEN, FilterOperator.GREATER_THAN],
    defaultOperator: FilterOperator.BETWEEN,
  },
];

export const INCIDENT_FILTERS: FilterFieldDefinition[] = [
  {
    id: 'incidentType',
    label: 'Incident Type',
    fieldType: FilterFieldType.SELECT,
    operators: [FilterOperator.EQUALS, FilterOperator.IN],
    defaultOperator: FilterOperator.EQUALS,
    options: [
      { value: 'injury', label: 'Injury' },
      { value: 'illness', label: 'Illness' },
      { value: 'behavioral', label: 'Behavioral' },
      { value: 'allergic_reaction', label: 'Allergic Reaction' },
      { value: 'other', label: 'Other' },
    ],
    isMultiple: true,
  },
  {
    id: 'severity',
    label: 'Severity',
    fieldType: FilterFieldType.SELECT,
    operators: [FilterOperator.EQUALS, FilterOperator.IN],
    defaultOperator: FilterOperator.EQUALS,
    options: [
      { value: 'low', label: 'Low', color: 'green' },
      { value: 'medium', label: 'Medium', color: 'yellow' },
      { value: 'high', label: 'High', color: 'orange' },
      { value: 'critical', label: 'Critical', color: 'red' },
    ],
    isMultiple: true,
  },
  {
    id: 'status',
    label: 'Status',
    fieldType: FilterFieldType.SELECT,
    operators: [FilterOperator.EQUALS, FilterOperator.IN],
    defaultOperator: FilterOperator.EQUALS,
    options: [
      { value: 'open', label: 'Open' },
      { value: 'investigating', label: 'Investigating' },
      { value: 'resolved', label: 'Resolved' },
      { value: 'closed', label: 'Closed' },
    ],
    isMultiple: true,
  },
  {
    id: 'dateReported',
    label: 'Report Date',
    fieldType: FilterFieldType.DATE_RANGE,
    operators: [FilterOperator.BETWEEN, FilterOperator.GREATER_THAN],
    defaultOperator: FilterOperator.BETWEEN,
  },
];

// ==================== Filter Utilities ====================

export const getFilterDefinitionsForEntity = (
  entityType: SearchEntityType
): FilterFieldDefinition[] => {
  switch (entityType) {
    case SearchEntityType.STUDENT:
      return STUDENT_FILTERS;
    case SearchEntityType.MEDICATION:
      return MEDICATION_FILTERS;
    case SearchEntityType.DOCUMENT:
      return DOCUMENT_FILTERS;
    case SearchEntityType.APPOINTMENT:
      return APPOINTMENT_FILTERS;
    case SearchEntityType.INCIDENT:
      return INCIDENT_FILTERS;
    default:
      return [];
  }
};

export const getOperatorLabel = (operator: FilterOperator): string => {
  const labels: Record<FilterOperator, string> = {
    [FilterOperator.EQUALS]: 'equals',
    [FilterOperator.NOT_EQUALS]: 'does not equal',
    [FilterOperator.CONTAINS]: 'contains',
    [FilterOperator.NOT_CONTAINS]: 'does not contain',
    [FilterOperator.STARTS_WITH]: 'starts with',
    [FilterOperator.ENDS_WITH]: 'ends with',
    [FilterOperator.GREATER_THAN]: 'is greater than',
    [FilterOperator.LESS_THAN]: 'is less than',
    [FilterOperator.GREATER_THAN_OR_EQUAL]: 'is greater than or equal to',
    [FilterOperator.LESS_THAN_OR_EQUAL]: 'is less than or equal to',
    [FilterOperator.BETWEEN]: 'is between',
    [FilterOperator.IN]: 'is one of',
    [FilterOperator.NOT_IN]: 'is not one of',
    [FilterOperator.IS_NULL]: 'is empty',
    [FilterOperator.IS_NOT_NULL]: 'is not empty',
    [FilterOperator.REGEX]: 'matches pattern',
  };
  return labels[operator];
};
