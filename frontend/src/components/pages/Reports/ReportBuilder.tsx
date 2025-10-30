'use client';

import React, { useState } from 'react';
import { 
  Plus,
  Save,
  Play,
  Eye,
  Settings,
  Database,
  Filter,
  SortAsc,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  FileText,
  Calendar,
  Clock,
  Tag,
  User,
  Trash2,
  Edit,
  Copy,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Loader,
  Download,
  Upload
} from 'lucide-react';
import type { Report, ReportCategory, ReportStatus, ReportFrequency } from './ReportCard';

/**
 * Data source types
 */
type DataSource = 'students' | 'medications' | 'appointments' | 'communications' | 'health-records' | 'billing' | 'compliance';

/**
 * Field types for report building
 */
interface ReportField {
  id: string;
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array';
  source: DataSource;
  category: string;
  description?: string;
  required?: boolean;
  isGroupable?: boolean;
  isSortable?: boolean;
  isFilterable?: boolean;
}

/**
 * Filter condition types
 */
type FilterOperator = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in' | 'is_null' | 'not_null';

/**
 * Filter configuration
 */
interface FilterCondition {
  id: string;
  fieldId: string;
  operator: FilterOperator;
  value: unknown;
  secondValue?: unknown; // For 'between' operator
}

/**
 * Sort configuration
 */
interface SortConfig {
  fieldId: string;
  direction: 'asc' | 'desc';
}

/**
 * Chart configuration
 */
interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  aggregate?: 'count' | 'sum' | 'avg' | 'min' | 'max';
}

/**
 * Report configuration
 */
interface ReportConfig {
  id?: string;
  title: string;
  description: string;
  category: ReportCategory;
  frequency: ReportFrequency;
  dataSources: DataSource[];
  selectedFields: string[];
  filters: FilterCondition[];
  sorting: SortConfig[];
  groupBy: string[];
  includeChart: boolean;
  chartConfig?: ChartConfig;
  tags: string[];
  isScheduled: boolean;
  scheduleConfig?: {
    time: string;
    timezone: string;
    recipients: string[];
  };
}

/**
 * Props for the ReportBuilder component
 */
interface ReportBuilderProps {
  /** Existing report to edit (if any) */
  report?: Report;
  /** Available data sources */
  dataSources?: DataSource[];
  /** Available fields by data source */
  availableFields?: Record<DataSource, ReportField[]>;
  /** Loading state */
  loading?: boolean;
  /** Preview data */
  previewData?: unknown[];
  /** Preview loading state */
  previewLoading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Save report handler */
  onSaveReport?: (config: ReportConfig) => void;
  /** Preview report handler */
  onPreviewReport?: (config: ReportConfig) => void;
  /** Run report handler */
  onRunReport?: (config: ReportConfig) => void;
  /** Cancel handler */
  onCancel?: () => void;
  /** Import template handler */
  onImportTemplate?: () => void;
  /** Export template handler */
  onExportTemplate?: (config: ReportConfig) => void;
}

/**
 * ReportBuilder Component
 * 
 * A comprehensive visual report builder component that allows users to create
 * and edit reports by selecting data sources, fields, filters, and visualization
 * options. Provides a drag-and-drop interface with real-time preview capabilities.
 * 
 * @param props - ReportBuilder component props
 * @returns JSX element representing the report builder interface
 */
const ReportBuilder = ({
  report,
  dataSources = ['students', 'medications', 'appointments', 'communications', 'health-records'],
  availableFields = {
    students: [],
    medications: [],
    appointments: [],
    communications: [],
    'health-records': [],
    billing: [],
    compliance: []
  },
  loading = false,
  previewData = [],
  previewLoading = false,
  className = '',
  onSaveReport,
  onPreviewReport,
  onRunReport,
  onCancel,
  onImportTemplate,
  onExportTemplate
}: ReportBuilderProps) => {
  // State
  const [activeStep, setActiveStep] = useState<'basic' | 'data' | 'filters' | 'visualization' | 'schedule'>('basic');
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

  /**
   * Gets data source display info
   */
  const getDataSourceInfo = (source: DataSource) => {
    const sourceInfo = {
      students: { label: 'Students', icon: User, color: 'text-blue-600 bg-blue-100' },
      medications: { label: 'Medications', icon: FileText, color: 'text-green-600 bg-green-100' },
      appointments: { label: 'Appointments', icon: Calendar, color: 'text-purple-600 bg-purple-100' },
      communications: { label: 'Communications', icon: BarChart3, color: 'text-orange-600 bg-orange-100' },
      'health-records': { label: 'Health Records', icon: FileText, color: 'text-red-600 bg-red-100' },
      billing: { label: 'Billing', icon: BarChart3, color: 'text-yellow-600 bg-yellow-100' },
      compliance: { label: 'Compliance', icon: CheckCircle, color: 'text-indigo-600 bg-indigo-100' }
    };
    return sourceInfo[source];
  };

  /**
   * Gets filter operator display text
   */
  const getOperatorText = (operator: FilterOperator): string => {
    const operatorMap = {
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
   * Validates report configuration
   */
  const validateConfig = (config: ReportConfig): string[] => {
    const errors: string[] = [];

    if (!config.title.trim()) errors.push('Report title is required');
    if (!config.description.trim()) errors.push('Report description is required');
    if (config.dataSources.length === 0) errors.push('At least one data source must be selected');
    if (config.selectedFields.length === 0) errors.push('At least one field must be selected');

    return errors;
  };

  /**
   * Handles basic info update
   */
  const updateBasicInfo = (field: keyof ReportConfig, value: unknown) => {
    setReportConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handles data source toggle
   */
  const toggleDataSource = (source: DataSource) => {
    setReportConfig(prev => ({
      ...prev,
      dataSources: prev.dataSources.includes(source)
        ? prev.dataSources.filter(s => s !== source)
        : [...prev.dataSources, source]
    }));
  };

  /**
   * Handles field selection toggle
   */
  const toggleField = (fieldId: string) => {
    setReportConfig(prev => ({
      ...prev,
      selectedFields: prev.selectedFields.includes(fieldId)
        ? prev.selectedFields.filter(f => f !== fieldId)
        : [...prev.selectedFields, fieldId]
    }));
  };

  /**
   * Adds new filter condition
   */
  const addFilter = () => {
    const newFilter: FilterCondition = {
      id: `filter_${Date.now()}`,
      fieldId: '',
      operator: 'equals',
      value: ''
    };

    setReportConfig(prev => ({
      ...prev,
      filters: [...prev.filters, newFilter]
    }));
  };

  /**
   * Updates filter condition
   */
  const updateFilter = (filterId: string, updates: Partial<FilterCondition>) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.map(filter =>
        filter.id === filterId ? { ...filter, ...updates } : filter
      )
    }));
  };

  /**
   * Removes filter condition
   */
  const removeFilter = (filterId: string) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.filter(f => f.id !== filterId)
    }));
  };

  /**
   * Handles save
   */
  const handleSave = () => {
    const errors = validateConfig(reportConfig);
    setValidationErrors(errors);

    if (errors.length === 0) {
      onSaveReport?.(reportConfig);
    }
  };

  /**
   * Handles preview
   */
  const handlePreview = () => {
    const errors = validateConfig(reportConfig);
    setValidationErrors(errors);

    if (errors.length === 0) {
      setShowPreview(true);
      onPreviewReport?.(reportConfig);
    }
  };

  /**
   * Gets available fields for selected data sources
   */
  const getAvailableFields = (): ReportField[] => {
    return reportConfig.dataSources.flatMap(source => availableFields[source] || []);
  };

  const steps = [
    { id: 'basic', label: 'Basic Info', icon: Info },
    { id: 'data', label: 'Data Sources', icon: Database },
    { id: 'filters', label: 'Filters & Sorting', icon: Filter },
    { id: 'visualization', label: 'Visualization', icon: BarChart3 },
    { id: 'schedule', label: 'Schedule', icon: Clock }
  ];

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {report ? 'Edit Report' : 'Create New Report'}
            </h1>
            <p className="text-gray-600 mt-1">
              Build custom reports with visual tools and real-time preview
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {onImportTemplate && (
              <button
                onClick={onImportTemplate}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Template
              </button>
            )}
            
            {onExportTemplate && (
              <button
                onClick={() => onExportTemplate(reportConfig)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Template
              </button>
            )}
            
            <button
              onClick={handlePreview}
              disabled={previewLoading}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 
                       bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {previewLoading ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              Preview
            </button>
            
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                       bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Report
            </button>
            
            {onCancel && (
              <button
                onClick={onCancel}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="border-b border-red-200 bg-red-50 p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Step Navigation */}
        <div className="w-64 border-r border-gray-200 bg-gray-50">
          <nav className="p-4 space-y-2">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = activeStep === step.id;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id as typeof activeStep)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${isActive
                      ? 'text-blue-700 bg-blue-100 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <StepIcon className="w-4 h-4 mr-3" />
                  {step.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Step Content */}
        <div className="flex-1 p-6">
          {/* Basic Info Step */}
          {activeStep === 'basic' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Title *
                    </label>
                    <input
                      type="text"
                      value={reportConfig.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBasicInfo('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md 
                               focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter report title"
                      aria-label="Report title"
                      aria-required="true"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={reportConfig.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateBasicInfo('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md 
                               focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe what this report shows"
                      aria-label="Report description"
                      aria-required="true"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={reportConfig.category}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateBasicInfo('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                 focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Report category"
                      >
                        <option value="clinical">Clinical</option>
                        <option value="financial">Financial</option>
                        <option value="operational">Operational</option>
                        <option value="compliance">Compliance</option>
                        <option value="patient-satisfaction">Patient Satisfaction</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency
                      </label>
                      <select
                        value={reportConfig.frequency}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateBasicInfo('frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                 focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Report frequency"
                      >
                        <option value="on-demand">On Demand</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={reportConfig.tags.join(', ')}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                        updateBasicInfo('tags', tags);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md 
                               focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter tags separated by commas"
                      aria-label="Report tags"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Sources Step */}
          {activeStep === 'data' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Data Sources</h2>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {dataSources.map((source) => {
                    const sourceInfo = getDataSourceInfo(source);
                    const SourceIcon = sourceInfo.icon;
                    const isSelected = reportConfig.dataSources.includes(source);
                    
                    return (
                      <div
                        key={source}
                        className={`
                          p-4 border rounded-lg cursor-pointer transition-colors
                          ${isSelected
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                        onClick={() => toggleDataSource(source)}
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg ${sourceInfo.color} mr-3`}>
                            <SourceIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">{sourceInfo.label}</h3>
                            <p className="text-sm text-gray-600">
                              {availableFields[source]?.length || 0} fields available
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleDataSource(source)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            aria-label={`Select ${sourceInfo.label} data source`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {reportConfig.dataSources.length > 0 && (
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Select Fields</h3>
                    <div className="space-y-4">
                      {reportConfig.dataSources.map((source) => {
                        const sourceInfo = getDataSourceInfo(source);
                        const SourceIcon = sourceInfo.icon;
                        const fields = availableFields[source] || [];
                        const isExpanded = expandedSources[source];
                        
                        return (
                          <div key={source} className="border border-gray-200 rounded-lg">
                            <button
                              onClick={() => setExpandedSources(prev => ({
                                ...prev,
                                [source]: !prev[source]
                              }))}
                              className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50"
                            >
                              <div className="flex items-center">
                                <div className={`p-2 rounded-lg ${sourceInfo.color} mr-3`}>
                                  <SourceIcon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  {sourceInfo.label} ({fields.length} fields)
                                </span>
                              </div>
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                            
                            {isExpanded && (
                              <div className="border-t border-gray-200">
                                <div className="p-4 grid grid-cols-2 gap-3">
                                  {fields.map((field) => (
                                    <label key={field.id} className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={reportConfig.selectedFields.includes(field.id)}
                                        onChange={() => toggleField(field.id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        aria-describedby={`${field.id}-desc`}
                                      />
                                      <span className="ml-2 text-sm text-gray-700">{field.label}</span>
                                      {field.description && (
                                        <span id={`${field.id}-desc`} className="sr-only">{field.description}</span>
                                      )}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Filters Step */}
          {activeStep === 'filters' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Filters & Sorting</h2>
                  <button
                    onClick={addFilter}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 
                             bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Filter
                  </button>
                </div>
                
                {reportConfig.filters.length > 0 && (
                  <div className="space-y-4">
                    {reportConfig.filters.map((filter) => (
                      <div key={filter.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <select
                            value={filter.fieldId}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFilter(filter.id, { fieldId: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md 
                                     focus:ring-blue-500 focus:border-blue-500"
                            aria-label="Select field for filter"
                          >
                            <option value="">Select field</option>
                            {getAvailableFields().map((field) => (
                              <option key={field.id} value={field.id}>
                                {field.label}
                              </option>
                            ))}
                          </select>
                          
                          <select
                            value={filter.operator}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFilter(filter.id, { operator: e.target.value as FilterOperator })}
                            className="px-3 py-2 border border-gray-300 rounded-md 
                                     focus:ring-blue-500 focus:border-blue-500"
                            aria-label="Select filter operator"
                          >
                            <option value="equals">Equals</option>
                            <option value="not_equals">Not Equals</option>
                            <option value="contains">Contains</option>
                            <option value="greater_than">Greater Than</option>
                            <option value="less_than">Less Than</option>
                            <option value="between">Between</option>
                            <option value="is_null">Is Empty</option>
                            <option value="not_null">Is Not Empty</option>
                          </select>
                          
                          {!['is_null', 'not_null'].includes(filter.operator) && (
                            <input
                              type="text"
                              value={filter.value as string || ''}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFilter(filter.id, { value: e.target.value })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md 
                                       focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Filter value"
                              aria-label="Filter value"
                            />
                          )}
                          
                          <button
                            onClick={() => removeFilter(filter.id)}
                            className="p-2 text-red-600 hover:text-red-800"
                            title="Remove filter"
                            aria-label="Remove filter"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visualization Step */}
          {activeStep === 'visualization' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Visualization Options</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reportConfig.includeChart}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBasicInfo('includeChart', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        aria-describedby="chart-option-desc"
                      />
                      <span id="chart-option-desc" className="ml-2 text-sm font-medium text-gray-700">Include Chart</span>
                    </label>
                  </div>
                  
                  {reportConfig.includeChart && (
                    <div className="pl-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Chart Type
                        </label>
                        <div className="grid grid-cols-5 gap-3">
                          {[
                            { type: 'bar', icon: BarChart3, label: 'Bar Chart' },
                            { type: 'line', icon: LineChart, label: 'Line Chart' },
                            { type: 'pie', icon: PieChart, label: 'Pie Chart' },
                            { type: 'area', icon: LineChart, label: 'Area Chart' },
                            { type: 'scatter', icon: BarChart3, label: 'Scatter Plot' }
                          ].map(({ type, icon: Icon, label }) => (
                            <button
                              key={type}
                              onClick={() => updateBasicInfo('chartConfig', { 
                                ...reportConfig.chartConfig, 
                                type 
                              })}
                              className={`
                                p-3 border rounded-lg text-center transition-colors
                                ${reportConfig.chartConfig?.type === type
                                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300'
                                }
                              `}
                              aria-label={`Select ${label}`}
                              title={`Select ${label}`}
                            >
                              <Icon className="w-6 h-6 mx-auto mb-1" />
                              <span className="text-xs">{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Schedule Step */}
          {activeStep === 'schedule' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Configuration</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reportConfig.isScheduled}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBasicInfo('isScheduled', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        aria-describedby="schedule-option-desc"
                      />
                      <span id="schedule-option-desc" className="ml-2 text-sm font-medium text-gray-700">Enable Automatic Scheduling</span>
                    </label>
                  </div>
                  
                  {reportConfig.isScheduled && (
                    <div className="pl-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time
                          </label>
                          <input
                            type="time"
                            value={reportConfig.scheduleConfig?.time || '09:00'}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              updateBasicInfo('scheduleConfig', {
                                ...reportConfig.scheduleConfig,
                                time: e.target.value
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                     focus:ring-blue-500 focus:border-blue-500"
                            aria-label="Schedule time"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <select
                            value={reportConfig.scheduleConfig?.timezone || 'UTC'}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                              updateBasicInfo('scheduleConfig', {
                                ...reportConfig.scheduleConfig,
                                timezone: e.target.value
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                     focus:ring-blue-500 focus:border-blue-500"
                            aria-label="Schedule timezone"
                          >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Recipients
                        </label>
                        <textarea
                          value={reportConfig.scheduleConfig?.recipients?.join(', ') || ''}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            const recipients = e.target.value.split(',').map(email => email.trim()).filter(Boolean);
                            updateBasicInfo('scheduleConfig', {
                              ...reportConfig.scheduleConfig,
                              recipients
                            });
                          }}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                   focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter email addresses separated by commas"
                          aria-label="Email recipients for scheduled reports"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Report Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Close preview"
                title="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {previewLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : previewData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {reportConfig.selectedFields.map((fieldId) => {
                          const field = getAvailableFields().find(f => f.id === fieldId);
                          return (
                            <th key={fieldId} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {field?.label || fieldId}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewData.slice(0, 10).map((row, index) => (
                        <tr key={index}>
                          {reportConfig.selectedFields.map((fieldId) => (
                            <td key={fieldId} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {String((row as Record<string, unknown>)[fieldId] || '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No preview data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportBuilder;
