'use client';

import React, { useState } from 'react';
import { 
  BarChart3,
  Calendar,
  Clock,
  Download,
  Eye,
  FileText,
  Play,
  Settings,
  Share2,
  Star,
  Bookmark,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  User,
  Tag,
  Activity,
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
  Database,
  Filter,
  RefreshCw,
  Loader,
  ChevronRight,
  ChevronDown,
  MoreVertical
} from 'lucide-react';
import type { Report, ReportCategory, ReportStatus, ReportFrequency } from './ReportCard';

/**
 * Report execution status
 */
type ExecutionStatus = 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';

/**
 * Report parameter type
 */
interface ReportParameter {
  id: string;
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
  required: boolean;
  defaultValue?: unknown;
  options?: Array<{ value: string; label: string; }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  description?: string;
}

/**
 * Report execution result
 */
interface ExecutionResult {
  id: string;
  startTime: Date;
  endTime?: Date;
  status: ExecutionStatus;
  recordCount?: number;
  executionTime?: number;
  error?: string;
  downloadUrl?: string;
  previewData?: unknown[];
}

/**
 * Props for the ReportDetail component
 */
interface ReportDetailProps {
  /** Report data to display */
  report: Report;
  /** Current execution result */
  executionResult?: ExecutionResult;
  /** Report parameters */
  parameters?: ReportParameter[];
  /** Recent executions */
  recentExecutions?: ExecutionResult[];
  /** Whether user can edit report */
  canEdit?: boolean;
  /** Whether user can delete report */
  canDelete?: boolean;
  /** Whether user can run report */
  canRun?: boolean;
  /** Whether user can share report */
  canShare?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Run report handler */
  onRunReport?: (parameters: Record<string, unknown>) => void;
  /** Cancel execution handler */
  onCancelExecution?: () => void;
  /** Download result handler */
  onDownloadResult?: (resultId: string, format: 'pdf' | 'excel' | 'csv') => void;
  /** Edit report handler */
  onEditReport?: () => void;
  /** Delete report handler */
  onDeleteReport?: () => void;
  /** Share report handler */
  onShareReport?: () => void;
  /** Clone report handler */
  onCloneReport?: () => void;
  /** Bookmark toggle handler */
  onToggleBookmark?: () => void;
  /** Favorite toggle handler */
  onToggleFavorite?: () => void;
  /** Back navigation handler */
  onBack?: () => void;
}

/**
 * ReportDetail Component
 * 
 * A comprehensive component for displaying detailed report information with
 * execution capabilities, parameter configuration, and result management.
 * Provides a complete interface for report interaction and execution.
 * 
 * @param props - ReportDetail component props
 * @returns JSX element representing the report detail view
 */
const ReportDetail = ({
  report,
  executionResult,
  parameters = [],
  recentExecutions = [],
  canEdit = false,
  canDelete = false,
  canRun = true,
  canShare = true,
  loading = false,
  className = '',
  onRunReport,
  onCancelExecution,
  onDownloadResult,
  onEditReport,
  onDeleteReport,
  onShareReport,
  onCloneReport,
  onToggleBookmark,
  onToggleFavorite,
  onBack
}: ReportDetailProps) => {
  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'parameters' | 'history'>('overview');
  const [parameterValues, setParameterValues] = useState<Record<string, unknown>>({});
  const [showParameterPanel, setShowParameterPanel] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    parameters: false,
    history: false
  });

  /**
   * Gets category display info
   */
  const getCategoryInfo = (category: ReportCategory) => {
    const categoryInfo = {
      clinical: { icon: Activity, color: 'text-blue-600 bg-blue-100', label: 'Clinical' },
      financial: { icon: FileText, color: 'text-green-600 bg-green-100', label: 'Financial' },
      operational: { icon: BarChart3, color: 'text-purple-600 bg-purple-100', label: 'Operational' },
      compliance: { icon: CheckCircle, color: 'text-orange-600 bg-orange-100', label: 'Compliance' },
      'patient-satisfaction': { icon: Star, color: 'text-yellow-600 bg-yellow-100', label: 'Patient Satisfaction' },
      custom: { icon: FileText, color: 'text-gray-600 bg-gray-100', label: 'Custom' }
    };
    return categoryInfo[category];
  };

  /**
   * Gets status display info
   */
  const getStatusInfo = (status: ReportStatus) => {
    const statusInfo = {
      draft: { color: 'text-gray-600 bg-gray-100', label: 'Draft' },
      published: { color: 'text-green-600 bg-green-100', label: 'Published' },
      archived: { color: 'text-red-600 bg-red-100', label: 'Archived' },
      scheduled: { color: 'text-blue-600 bg-blue-100', label: 'Scheduled' }
    };
    return statusInfo[status];
  };

  /**
   * Gets execution status display info
   */
  const getExecutionStatusInfo = (status: ExecutionStatus) => {
    const statusInfo = {
      idle: { color: 'text-gray-600 bg-gray-100', icon: Clock, label: 'Ready' },
      running: { color: 'text-blue-600 bg-blue-100', icon: Loader, label: 'Running' },
      completed: { color: 'text-green-600 bg-green-100', icon: CheckCircle, label: 'Completed' },
      failed: { color: 'text-red-600 bg-red-100', icon: AlertCircle, label: 'Failed' },
      cancelled: { color: 'text-orange-600 bg-orange-100', icon: AlertCircle, label: 'Cancelled' }
    };
    return statusInfo[status];
  };

  /**
   * Handles parameter value change
   */
  const handleParameterChange = (parameterId: string, value: unknown) => {
    setParameterValues(prev => ({
      ...prev,
      [parameterId]: value
    }));
  };

  /**
   * Handles report execution
   */
  const handleRunReport = () => {
    if (parameters.length > 0) {
      setShowParameterPanel(true);
    } else {
      onRunReport?.(parameterValues);
    }
  };

  /**
   * Handles execution with parameters
   */
  const handleExecuteWithParameters = () => {
    onRunReport?.(parameterValues);
    setShowParameterPanel(false);
  };

  /**
   * Toggles section expansion
   */
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const categoryInfo = getCategoryInfo(report.category);
  const statusInfo = getStatusInfo(report.status);
  const CategoryIcon = categoryInfo.icon;

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                title="Back"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            )}
            
            <div className={`p-3 rounded-lg ${categoryInfo.color}`}>
              <CategoryIcon className="w-6 h-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900 truncate">{report.title}</h1>
                {report.isFavorite && (
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                )}
                {report.isBookmarked && (
                  <Bookmark className="w-5 h-5 text-blue-500 fill-current" />
                )}
              </div>
              
              <p className="text-gray-600 mt-1">{report.description}</p>
              
              <div className="flex items-center space-x-4 mt-3">
                <span className="text-sm text-gray-500">{categoryInfo.label}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">By {report.author.name}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">Updated {report.lastUpdated.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {onToggleBookmark && (
              <button
                onClick={onToggleBookmark}
                className={`p-2 rounded-lg ${report.isBookmarked ? 'text-blue-600 bg-blue-100' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                title="Bookmark"
              >
                <Bookmark className={`w-4 h-4 ${report.isBookmarked ? 'fill-current' : ''}`} />
              </button>
            )}
            
            {onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                className={`p-2 rounded-lg ${report.isFavorite ? 'text-yellow-600 bg-yellow-100' : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'}`}
                title="Favorite"
              >
                <Star className={`w-4 h-4 ${report.isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
            
            {canShare && onShareReport && (
              <button
                onClick={onShareReport}
                className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
            
            {onCloneReport && (
              <button
                onClick={onCloneReport}
                className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50"
                title="Clone"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
            
            {canEdit && onEditReport && (
              <button
                onClick={onEditReport}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
            )}
            
            {canRun && (
              <button
                onClick={handleRunReport}
                disabled={executionResult?.status === 'running' || loading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                         bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {executionResult?.status === 'running' ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Running
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Report
                  </>
                )}
              </button>
            )}
            
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100" title="More Options">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Current Execution Status */}
      {executionResult && executionResult.status !== 'idle' && (
        <div className="border-b border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {(() => {
                const statusInfo = getExecutionStatusInfo(executionResult.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <>
                    <div className={`p-2 rounded-lg ${statusInfo.color}`}>
                      <StatusIcon className={`w-4 h-4 ${executionResult.status === 'running' ? 'animate-spin' : ''}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Report {statusInfo.label}
                      </p>
                      <p className="text-sm text-gray-600">
                        Started {executionResult.startTime.toLocaleString()}
                        {executionResult.endTime && (
                          <> • Finished {executionResult.endTime.toLocaleString()}</>
                        )}
                        {executionResult.executionTime && (
                          <> • Duration: {executionResult.executionTime}s</>
                        )}
                        {executionResult.recordCount && (
                          <> • {executionResult.recordCount.toLocaleString()} records</>
                        )}
                      </p>
                      {executionResult.error && (
                        <p className="text-sm text-red-600 mt-1">{executionResult.error}</p>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
            
            <div className="flex items-center space-x-2">
              {executionResult.status === 'running' && onCancelExecution && (
                <button
                  onClick={onCancelExecution}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 
                           bg-white border border-red-300 rounded-md hover:bg-red-50"
                >
                  Cancel
                </button>
              )}
              
              {executionResult.status === 'completed' && executionResult.downloadUrl && onDownloadResult && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onDownloadResult(executionResult.id, 'pdf')}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 
                             bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </button>
                  <button
                    onClick={() => onDownloadResult(executionResult.id, 'excel')}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 
                             bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Excel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`
                py-4 px-1 border-b-2 text-sm font-medium
                ${activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Overview
            </button>
            {parameters.length > 0 && (
              <button
                onClick={() => setActiveTab('parameters')}
                className={`
                  py-4 px-1 border-b-2 text-sm font-medium
                  ${activeTab === 'parameters'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Parameters ({parameters.length})
              </button>
            )}
            {recentExecutions.length > 0 && (
              <button
                onClick={() => setActiveTab('history')}
                className={`
                  py-4 px-1 border-b-2 text-sm font-medium
                  ${activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                History ({recentExecutions.length})
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Eye className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Views</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">{report.metrics.views.toLocaleString()}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Download className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Downloads</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">{report.metrics.downloads.toLocaleString()}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Share2 className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Shares</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">{report.metrics.shares.toLocaleString()}</p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Details</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Frequency</dt>
                    <dd className="text-sm text-gray-900">{report.frequency.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="text-sm text-gray-900">{report.createdDate.toLocaleDateString()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Generated</dt>
                    <dd className="text-sm text-gray-900">
                      {report.lastGenerated ? report.lastGenerated.toLocaleDateString() : 'Never'}
                    </dd>
                  </div>
                  {report.nextScheduled && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Next Scheduled</dt>
                      <dd className="text-sm text-gray-900">{report.nextScheduled.toLocaleDateString()}</dd>
                    </div>
                  )}
                  {report.recordCount && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Record Count</dt>
                      <dd className="text-sm text-gray-900">{report.recordCount.toLocaleString()}</dd>
                    </div>
                  )}
                  {report.estimatedRunTime && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Estimated Run Time</dt>
                      <dd className="text-sm text-gray-900">{report.estimatedRunTime} seconds</dd>
                    </div>
                  )}
                </dl>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                {report.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {report.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium 
                                 text-gray-700 bg-gray-100 rounded-full"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No tags assigned</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Parameters Tab */}
        {activeTab === 'parameters' && parameters.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Report Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {parameters.map((param) => (
                <div key={param.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {param.label}
                    {param.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {param.type === 'string' && (
                    <input
                      type="text"
                      value={(parameterValues[param.id] as string) || param.defaultValue || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleParameterChange(param.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md 
                               focus:ring-blue-500 focus:border-blue-500"
                      placeholder={param.description}
                    />
                  )}
                  
                  {param.type === 'number' && (
                    <input
                      type="number"
                      value={(parameterValues[param.id] as number) || param.defaultValue || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleParameterChange(param.id, parseFloat(e.target.value))}
                      min={param.validation?.min}
                      max={param.validation?.max}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md 
                               focus:ring-blue-500 focus:border-blue-500"
                      placeholder={param.description}
                      title={param.description || param.label}
                      aria-label={param.label}
                    />
                  )}
                  
                  {param.type === 'date' && (
                    <input
                      type="date"
                      value={(parameterValues[param.id] as string) || param.defaultValue || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleParameterChange(param.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md 
                               focus:ring-blue-500 focus:border-blue-500"
                      title={param.description || param.label}
                      aria-label={param.label}
                    />
                  )}
                  
                  {param.type === 'boolean' && (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(parameterValues[param.id] as boolean) || (param.defaultValue as boolean) || false}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleParameterChange(param.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{param.description}</span>
                    </label>
                  )}
                  
                  {param.type === 'select' && param.options && (
                    <select
                      value={(parameterValues[param.id] as string) || param.defaultValue || ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleParameterChange(param.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md 
                               focus:ring-blue-500 focus:border-blue-500"
                      title={param.description || param.label}
                      aria-label={param.label}
                    >
                      <option value="">Select an option</option>
                      {param.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {param.description && (
                    <p className="text-xs text-gray-500">{param.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && recentExecutions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Execution History</h3>
            <div className="space-y-3">
              {recentExecutions.map((execution) => {
                const statusInfo = getExecutionStatusInfo(execution.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={execution.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {statusInfo.label} • {execution.startTime.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {execution.executionTime && `Duration: ${execution.executionTime}s`}
                            {execution.recordCount && ` • ${execution.recordCount.toLocaleString()} records`}
                          </p>
                          {execution.error && (
                            <p className="text-sm text-red-600 mt-1">{execution.error}</p>
                          )}
                        </div>
                      </div>
                      
                      {execution.status === 'completed' && execution.downloadUrl && onDownloadResult && (
                        <button
                          onClick={() => onDownloadResult(execution.id, 'pdf')}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 
                                   bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Parameter Panel Modal */}
      {showParameterPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Configure Parameters</h3>
              <p className="text-sm text-gray-600 mt-1">Set parameter values before running the report</p>
            </div>
            
            <div className="p-6 space-y-4">
              {parameters.map((param) => (
                <div key={param.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {param.label}
                    {param.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {param.type === 'string' && (
                    <input
                      type="text"
                      value={(parameterValues[param.id] as string) || param.defaultValue || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleParameterChange(param.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md 
                               focus:ring-blue-500 focus:border-blue-500"
                      placeholder={param.description}
                    />
                  )}
                  
                  {param.description && (
                    <p className="text-xs text-gray-500">{param.description}</p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowParameterPanel(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                         rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteWithParameters}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent 
                         rounded-md hover:bg-blue-700"
              >
                Run Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetail;
