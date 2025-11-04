import React from 'react';
import {
  Save,
  Eye,
  Loader,
  Upload,
  Download,
  AlertCircle,
  Info,
  Database,
  Filter,
  BarChart3,
  Clock
} from 'lucide-react';
import type { StepId, ReportConfig } from './types';
import type { UseReportBuilderReturn } from './hooks';

/**
 * Step configuration
 */
interface Step {
  id: StepId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Props for BuilderCanvas component
 */
export interface BuilderCanvasProps {
  /** Report builder state and actions from useReportBuilder hook */
  builderState: UseReportBuilderReturn;
  /** Loading state for save operation */
  loading?: boolean;
  /** Preview loading state */
  previewLoading?: boolean;
  /** Save report handler */
  onSaveReport?: (config: ReportConfig) => void;
  /** Preview report handler */
  onPreviewReport?: (config: ReportConfig) => void;
  /** Cancel handler */
  onCancel?: () => void;
  /** Import template handler */
  onImportTemplate?: () => void;
  /** Export template handler */
  onExportTemplate?: (config: ReportConfig) => void;
  /** Whether editing an existing report */
  isEditing?: boolean;
  /** Child components to render for each step */
  children: Record<StepId, React.ReactNode>;
}

/**
 * BuilderCanvas Component
 *
 * Main orchestrator component for the report builder.
 * Manages step navigation, header actions, and validation display.
 *
 * @param props - Component props
 * @returns JSX element for report builder canvas
 */
export const BuilderCanvas = React.memo<BuilderCanvasProps>(({
  builderState,
  loading = false,
  previewLoading = false,
  onSaveReport,
  onPreviewReport,
  onCancel,
  onImportTemplate,
  onExportTemplate,
  isEditing = false,
  children
}) => {
  const {
    reportConfig,
    activeStep,
    validationErrors,
    setActiveStep,
    validate
  } = builderState;

  // Step configuration
  const steps: Step[] = [
    { id: 'basic', label: 'Basic Info', icon: Info },
    { id: 'data', label: 'Data Sources', icon: Database },
    { id: 'filters', label: 'Filters & Sorting', icon: Filter },
    { id: 'visualization', label: 'Visualization', icon: BarChart3 },
    { id: 'schedule', label: 'Schedule', icon: Clock }
  ];

  /**
   * Handles save action with validation
   */
  const handleSave = () => {
    const errors = validate();

    if (errors.length === 0) {
      onSaveReport?.(reportConfig);
    }
  };

  /**
   * Handles preview action with validation
   */
  const handlePreview = () => {
    const errors = validate();

    if (errors.length === 0) {
      onPreviewReport?.(reportConfig);
    }
  };

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Report' : 'Create New Report'}
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
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Import report template"
              >
                <Upload className="w-4 h-4 mr-2" aria-hidden="true" />
                Import Template
              </button>
            )}

            {onExportTemplate && (
              <button
                onClick={() => onExportTemplate(reportConfig)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Export report template"
              >
                <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                Export Template
              </button>
            )}

            <button
              onClick={handlePreview}
              disabled={previewLoading}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700
                       bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Preview report"
            >
              {previewLoading ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
              ) : (
                <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
              )}
              Preview
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white
                       bg-blue-600 border border-transparent rounded-md hover:bg-blue-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Save report"
            >
              {loading ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="w-4 h-4 mr-2" aria-hidden="true" />
              )}
              Save Report
            </button>

            {onCancel && (
              <button
                onClick={onCancel}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Cancel report creation"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="border-b border-red-200 bg-red-50 p-4 flex-shrink-0" role="alert">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" aria-hidden="true" />
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

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Step Navigation */}
        <div className="w-64 border-r border-gray-200 bg-gray-50 flex-shrink-0">
          <nav className="p-4 space-y-2" aria-label="Report builder steps">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = activeStep === step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
                    transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isActive
                      ? 'text-blue-700 bg-blue-100 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <StepIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                  {step.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Step Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children[activeStep]}
        </div>
      </div>
    </div>
  );
});

BuilderCanvas.displayName = 'BuilderCanvas';

export default BuilderCanvas;
