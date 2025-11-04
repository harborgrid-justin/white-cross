import {
  User,
  FileText,
  Calendar,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import type { DataSource, DataSourceInfo, FilterOperator, ReportConfig } from './types';

/**
 * Gets display information for a data source
 */
export const getDataSourceInfo = (source: DataSource): DataSourceInfo => {
  const sourceInfo: Record<DataSource, DataSourceInfo> = {
    students: {
      label: 'Students',
      icon: User,
      color: 'text-blue-600 bg-blue-100'
    },
    medications: {
      label: 'Medications',
      icon: FileText,
      color: 'text-green-600 bg-green-100'
    },
    appointments: {
      label: 'Appointments',
      icon: Calendar,
      color: 'text-purple-600 bg-purple-100'
    },
    communications: {
      label: 'Communications',
      icon: BarChart3,
      color: 'text-orange-600 bg-orange-100'
    },
    'health-records': {
      label: 'Health Records',
      icon: FileText,
      color: 'text-red-600 bg-red-100'
    },
    billing: {
      label: 'Billing',
      icon: BarChart3,
      color: 'text-yellow-600 bg-yellow-100'
    },
    compliance: {
      label: 'Compliance',
      icon: CheckCircle,
      color: 'text-indigo-600 bg-indigo-100'
    }
  };

  return sourceInfo[source];
};

/**
 * Gets human-readable text for a filter operator
 */
export const getOperatorText = (operator: FilterOperator): string => {
  const operatorMap: Record<FilterOperator, string> = {
    equals: 'Equals',
    not_equals: 'Not Equals',
    contains: 'Contains',
    not_contains: 'Does Not Contain',
    greater_than: 'Greater Than',
    less_than: 'Less Than',
    between: 'Between',
    in: 'In',
    not_in: 'Not In',
    is_null: 'Is Empty',
    not_null: 'Is Not Empty'
  };

  return operatorMap[operator];
};

/**
 * Validates report configuration and returns array of error messages
 */
export const validateConfig = (config: ReportConfig): string[] => {
  const errors: string[] = [];

  if (!config.title.trim()) {
    errors.push('Report title is required');
  }

  if (!config.description.trim()) {
    errors.push('Report description is required');
  }

  if (config.dataSources.length === 0) {
    errors.push('At least one data source must be selected');
  }

  if (config.selectedFields.length === 0) {
    errors.push('At least one field must be selected');
  }

  // Validate filters have required fields
  config.filters.forEach((filter, index) => {
    if (!filter.fieldId) {
      errors.push(`Filter ${index + 1}: Field is required`);
    }
    if (!['is_null', 'not_null'].includes(filter.operator) && !filter.value) {
      errors.push(`Filter ${index + 1}: Value is required for ${getOperatorText(filter.operator)} operator`);
    }
  });

  // Validate chart configuration if enabled
  if (config.includeChart && !config.chartConfig?.type) {
    errors.push('Chart type is required when chart visualization is enabled');
  }

  // Validate schedule configuration if enabled
  if (config.isScheduled) {
    if (!config.scheduleConfig?.time) {
      errors.push('Schedule time is required when automatic scheduling is enabled');
    }
    if (!config.scheduleConfig?.timezone) {
      errors.push('Schedule timezone is required when automatic scheduling is enabled');
    }
    if (!config.scheduleConfig?.recipients || config.scheduleConfig.recipients.length === 0) {
      errors.push('At least one email recipient is required when automatic scheduling is enabled');
    }
  }

  return errors;
};

/**
 * Generates a unique ID for filter conditions
 */
export const generateFilterId = (): string => {
  return `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
