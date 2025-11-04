import { useState, useCallback, useMemo } from 'react';
import type { Report } from '../ReportCard';
import type {
  DataSource,
  StepId,
  ReportConfig,
  ReportField,
  FilterCondition,
  FilterOperator
} from './types';
import { validateConfig, generateFilterId } from './utils';

/**
 * Return type for useReportBuilder hook
 */
export interface UseReportBuilderReturn {
  // State
  reportConfig: ReportConfig;
  activeStep: StepId;
  expandedSources: Record<DataSource, boolean>;
  validationErrors: string[];
  showPreview: boolean;

  // Basic info actions
  updateBasicInfo: (field: keyof ReportConfig, value: unknown) => void;

  // Data source actions
  toggleDataSource: (source: DataSource) => void;
  toggleField: (fieldId: string) => void;
  toggleSourceExpansion: (source: DataSource) => void;

  // Filter actions
  addFilter: () => void;
  updateFilter: (filterId: string, updates: Partial<FilterCondition>) => void;
  removeFilter: (filterId: string) => void;

  // Navigation actions
  setActiveStep: (step: StepId) => void;

  // Preview actions
  setShowPreview: (show: boolean) => void;

  // Validation
  validate: () => string[];

  // Computed values
  getAvailableFields: () => ReportField[];
}

/**
 * Custom hook for managing report builder state
 *
 * Encapsulates all state management logic for the report builder,
 * providing a clean API for components to interact with the state.
 *
 * @param report - Optional existing report to edit
 * @param availableFields - Available fields by data source
 * @returns Report builder state and actions
 */
export const useReportBuilder = (
  report?: Report,
  availableFields?: Record<DataSource, ReportField[]>
): UseReportBuilderReturn => {
  // State management
  const [activeStep, setActiveStep] = useState<StepId>('basic');

  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    title: report?.title || '',
    description: report?.description || '',
    category: report?.category || 'operational',
    frequency: report?.frequency || 'on-demand',
    dataSources: [],
    selectedFields: [],
    filters: [],
    sorting: [],
    groupBy: [],
    includeChart: false,
    tags: report?.tags || [],
    isScheduled: false
  });

  const [expandedSources, setExpandedSources] = useState<Record<DataSource, boolean>>({
    students: true,
    medications: false,
    appointments: false,
    communications: false,
    'health-records': false,
    billing: false,
    compliance: false
  });

  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Basic info actions
  const updateBasicInfo = useCallback((field: keyof ReportConfig, value: unknown) => {
    setReportConfig(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Data source actions
  const toggleDataSource = useCallback((source: DataSource) => {
    setReportConfig(prev => ({
      ...prev,
      dataSources: prev.dataSources.includes(source)
        ? prev.dataSources.filter(s => s !== source)
        : [...prev.dataSources, source]
    }));
  }, []);

  const toggleField = useCallback((fieldId: string) => {
    setReportConfig(prev => ({
      ...prev,
      selectedFields: prev.selectedFields.includes(fieldId)
        ? prev.selectedFields.filter(f => f !== fieldId)
        : [...prev.selectedFields, fieldId]
    }));
  }, []);

  const toggleSourceExpansion = useCallback((source: DataSource) => {
    setExpandedSources(prev => ({
      ...prev,
      [source]: !prev[source]
    }));
  }, []);

  // Filter actions
  const addFilter = useCallback(() => {
    const newFilter: FilterCondition = {
      id: generateFilterId(),
      fieldId: '',
      operator: 'equals',
      value: ''
    };

    setReportConfig(prev => ({
      ...prev,
      filters: [...prev.filters, newFilter]
    }));
  }, []);

  const updateFilter = useCallback((filterId: string, updates: Partial<FilterCondition>) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.map(filter =>
        filter.id === filterId ? { ...filter, ...updates } : filter
      )
    }));
  }, []);

  const removeFilter = useCallback((filterId: string) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.filter(f => f.id !== filterId)
    }));
  }, []);

  // Validation
  const validate = useCallback(() => {
    const errors = validateConfig(reportConfig);
    setValidationErrors(errors);
    return errors;
  }, [reportConfig]);

  // Computed values
  const getAvailableFields = useCallback((): ReportField[] => {
    if (!availableFields) return [];
    return reportConfig.dataSources.flatMap(source => availableFields[source] || []);
  }, [reportConfig.dataSources, availableFields]);

  return {
    // State
    reportConfig,
    activeStep,
    expandedSources,
    validationErrors,
    showPreview,

    // Actions
    updateBasicInfo,
    toggleDataSource,
    toggleField,
    toggleSourceExpansion,
    addFilter,
    updateFilter,
    removeFilter,
    setActiveStep,
    setShowPreview,
    validate,

    // Computed
    getAvailableFields
  };
};
