'use client';

import React, { useState } from 'react';
import { 
  Download,
  FileText,
  Image,
  Table,
  Mail,
  Cloud,
  Settings,
  Calendar,
  Clock,
  Users,
  Filter,
  CheckCircle,
  AlertCircle,
  X,
  ChevronDown,
  ChevronRight,
  Loader2,
  File,
  FileSpreadsheet,
  FileImage,
  Archive,
  Share2,
  Eye,
  Copy,
  Trash2,
  MoreVertical,
  Plus,
  Edit3,
  Save,
  Zap
} from 'lucide-react';

/**
 * Export format types
 */
type ExportFormat = 'pdf' | 'csv' | 'xlsx' | 'json' | 'xml' | 'png' | 'jpeg' | 'svg';

/**
 * Export destination types
 */
type ExportDestination = 'download' | 'email' | 'cloud' | 'ftp' | 'api';

/**
 * Export status types
 */
type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

/**
 * Export priority levels
 */
type ExportPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Export configuration interface
 */
interface ExportConfig {
  id: string;
  name: string;
  reportId: string;
  reportName: string;
  format: ExportFormat;
  destination: ExportDestination;
  settings: {
    includeCharts: boolean;
    includeData: boolean;
    includeHeaders: boolean;
    includeFooters: boolean;
    pageOrientation?: 'portrait' | 'landscape';
    pageSize?: 'A4' | 'A3' | 'Letter' | 'Legal';
    quality?: 'low' | 'medium' | 'high';
    compression?: boolean;
  };
  filters: Record<string, unknown>;
  schedule?: {
    enabled: boolean;
    frequency: 'once' | 'daily' | 'weekly' | 'monthly';
    time: string;
    timezone: string;
  };
  recipients?: string[];
  cloudPath?: string;
  createdAt: string;
  createdBy: string;
}

/**
 * Export job interface
 */
interface ExportJob {
  id: string;
  configId: string;
  configName: string;
  reportName: string;
  format: ExportFormat;
  status: ExportStatus;
  priority: ExportPriority;
  progress: number;
  startedAt: string;
  completedAt?: string;
  fileSize?: number;
  downloadUrl?: string;
  errorMessage?: string;
  estimatedCompletion?: string;
}

/**
 * Export template interface
 */
interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  format: ExportFormat;
  settings: ExportConfig['settings'];
  isDefault: boolean;
  usageCount: number;
  createdAt: string;
}

/**
 * Props for the ReportExport component
 */
interface ReportExportProps {
  /** Available reports for export */
  reports?: Array<{ id: string; name: string; category: string }>;
  /** Export configurations */
  configs?: ExportConfig[];
  /** Active export jobs */
  jobs?: ExportJob[];
  /** Export templates */
  templates?: ExportTemplate[];
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Create export handler */
  onCreateExport?: (config: Partial<ExportConfig>) => void;
  /** Update config handler */
  onUpdateConfig?: (id: string, config: Partial<ExportConfig>) => void;
  /** Delete config handler */
  onDeleteConfig?: (id: string) => void;
  /** Start export job handler */
  onStartJob?: (configId: string) => void;
  /** Cancel job handler */
  onCancelJob?: (jobId: string) => void;
  /** Download file handler */
  onDownloadFile?: (jobId: string) => void;
  /** Save template handler */
  onSaveTemplate?: (template: Partial<ExportTemplate>) => void;
}

/**
 * ReportExport Component
 * 
 * A comprehensive export management component that handles report exports
 * with multiple formats, destinations, scheduling, and job monitoring.
 * Features export templates, bulk operations, and real-time progress tracking.
 * 
 * @param props - ReportExport component props
 * @returns JSX element representing the export management interface
 */
const ReportExport = ({
  reports = [],
  configs = [],
  jobs = [],
  templates = [],
  loading = false,
  className = '',
  onCreateExport,
  onUpdateConfig,
  onDeleteConfig,
  onStartJob,
  onCancelJob,
  onDownloadFile,
  onSaveTemplate
}: ReportExportProps) => {
  // State
  const [activeTab, setActiveTab] = useState<'configs' | 'jobs' | 'templates'>('configs');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ExportConfig | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    settings: true,
    schedule: false,
    advanced: false
  });
  const [filters, setFilters] = useState({
    status: 'all' as ExportStatus | 'all',
    format: 'all' as ExportFormat | 'all',
    priority: 'all' as ExportPriority | 'all'
  });

  // Form state for new export
  const [newExport, setNewExport] = useState<Partial<ExportConfig>>({
    name: '',
    reportId: '',
    format: 'pdf',
    destination: 'download',
    settings: {
      includeCharts: true,
      includeData: true,
      includeHeaders: true,
      includeFooters: true,
      pageOrientation: 'portrait',
      pageSize: 'A4',
      quality: 'high',
      compression: false
    },
    filters: {},
    recipients: []
  });

  /**
   * Gets format icon
   */
  const getFormatIcon = (format: ExportFormat) => {
    const icons = {
      pdf: FileText,
      csv: File,
      xlsx: FileSpreadsheet,
      json: File,
      xml: File,
      png: FileImage,
      jpeg: FileImage,
      svg: FileImage
    };
    return icons[format] || FileText;
  };

  /**
   * Gets status color and icon
   */
  const getStatusDisplay = (status: ExportStatus) => {
    const config = {
      pending: { color: 'text-yellow-600 bg-yellow-100', icon: Clock },
      processing: { color: 'text-blue-600 bg-blue-100', icon: Loader2 },
      completed: { color: 'text-green-600 bg-green-100', icon: CheckCircle },
      failed: { color: 'text-red-600 bg-red-100', icon: AlertCircle },
      cancelled: { color: 'text-gray-600 bg-gray-100', icon: X }
    };
    return config[status];
  };

  /**
   * Gets priority color
   */
  const getPriorityColor = (priority: ExportPriority) => {
    const colors = {
      low: 'text-gray-600 bg-gray-100',
      normal: 'text-blue-600 bg-blue-100',
      high: 'text-orange-600 bg-orange-100',
      urgent: 'text-red-600 bg-red-100'
    };
    return colors[priority];
  };

  /**
   * Formats file size
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Handles form submission
   */
  const handleSubmitExport = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExport.name && newExport.reportId) {
      onCreateExport?.(newExport);
      setShowCreateModal(false);
      setNewExport({
        name: '',
        reportId: '',
        format: 'pdf',
        destination: 'download',
        settings: {
          includeCharts: true,
          includeData: true,
          includeHeaders: true,
          includeFooters: true,
          pageOrientation: 'portrait',
          pageSize: 'A4',
          quality: 'high',
          compression: false
        },
        filters: {},
        recipients: []
      });
    }
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

  /**
   * Filters jobs based on current filters
   */
  const filteredJobs = jobs.filter(job => {
    if (filters.status !== 'all' && job.status !== filters.status) return false;
    if (filters.format !== 'all' && job.format !== filters.format) return false;
    if (filters.priority !== 'all' && job.priority !== filters.priority) return false;
    return true;
  });

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report Export</h1>
            <p className="text-gray-600 mt-1">
              Manage report exports, formats, and delivery options
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                     bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Export
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <nav className="flex space-x-8">
            {[
              { id: 'configs' as const, label: 'Export Configs', count: configs.length },
              { id: 'jobs' as const, label: 'Export Jobs', count: jobs.length },
              { id: 'templates' as const, label: 'Templates', count: templates.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="p-6">
          {/* Export Configurations Tab */}
          {activeTab === 'configs' && (
            <div className="space-y-6">
              {configs.length === 0 ? (
                <div className="text-center py-12">
                  <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Export Configurations</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first export configuration to get started.
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                             bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Export Config
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {configs.map((config) => {
                    const FormatIcon = getFormatIcon(config.format);
                    return (
                      <div key={config.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 rounded-lg p-2">
                              <FormatIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{config.name}</h3>
                              <p className="text-sm text-gray-600">{config.reportName}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => onStartJob?.(config.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                              title="Start export"
                              aria-label="Start export"
                            >
                              <Zap className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedConfig(config)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md"
                              title="Edit config"
                              aria-label="Edit config"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteConfig?.(config.id)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                              title="Delete config"
                              aria-label="Delete config"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Format:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                           bg-blue-100 text-blue-800`}>
                              {config.format.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Destination:</span>
                            <span className="text-gray-900 capitalize">{config.destination}</span>
                          </div>
                          
                          {config.schedule?.enabled && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Schedule:</span>
                              <span className="text-gray-900 capitalize">{config.schedule.frequency}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Created:</span>
                            <span className="text-gray-900">
                              {new Date(config.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Export Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex items-center space-x-4">
                <select
                  value={filters.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    setFilters(prev => ({ ...prev, status: e.target.value as ExportStatus | 'all' }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Filter by status"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                <select
                  value={filters.format}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    setFilters(prev => ({ ...prev, format: e.target.value as ExportFormat | 'all' }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Filter by format"
                >
                  <option value="all">All Formats</option>
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel</option>
                  <option value="json">JSON</option>
                </select>
                
                <select
                  value={filters.priority}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    setFilters(prev => ({ ...prev, priority: e.target.value as ExportPriority | 'all' }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Filter by priority"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Jobs List */}
              {filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Export Jobs</h3>
                  <p className="text-gray-600">
                    No export jobs match your current filters.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Export
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progress
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Priority
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Started
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredJobs.map((job) => {
                          const FormatIcon = getFormatIcon(job.format);
                          const statusConfig = getStatusDisplay(job.status);
                          const StatusIcon = statusConfig.icon;
                          
                          return (
                            <tr key={job.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FormatIcon className="w-4 h-4 text-gray-400 mr-3" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{job.configName}</div>
                                    <div className="text-sm text-gray-500">{job.reportName}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                  <StatusIcon className={`w-3 h-3 mr-1 ${job.status === 'processing' ? 'animate-spin' : ''}`} />
                                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        job.status === 'completed' ? 'bg-green-600' :
                                        job.status === 'failed' ? 'bg-red-600' :
                                        'bg-blue-600'
                                      }`}
                                      style={{ width: `${job.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-gray-600">{job.progress}%</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(job.priority)}`}>
                                  {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {job.fileSize ? formatFileSize(job.fileSize) : '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(job.startedAt).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  {job.status === 'completed' && job.downloadUrl && (
                                    <button
                                      onClick={() => onDownloadFile?.(job.id)}
                                      className="text-blue-600 hover:text-blue-900"
                                      aria-label="Download file"
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                  )}
                                  {(job.status === 'pending' || job.status === 'processing') && (
                                    <button
                                      onClick={() => onCancelJob?.(job.id)}
                                      className="text-red-600 hover:text-red-900"
                                      aria-label="Cancel job"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              {templates.length === 0 ? (
                <div className="text-center py-12">
                  <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Export Templates</h3>
                  <p className="text-gray-600">
                    Save frequently used export configurations as templates.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {templates.map((template) => {
                    const FormatIcon = getFormatIcon(template.format);
                    return (
                      <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-purple-100 rounded-lg p-2">
                              <FormatIcon className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                              <p className="text-sm text-gray-600">{template.description}</p>
                            </div>
                          </div>
                          
                          {template.isDefault && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Default
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Format:</span>
                            <span className="text-gray-900 uppercase">{template.format}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Usage:</span>
                            <span className="text-gray-900">{template.usageCount} times</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Created:</span>
                            <span className="text-gray-900">
                              {new Date(template.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setNewExport(prev => ({
                                ...prev,
                                format: template.format,
                                settings: template.settings
                              }));
                              setShowCreateModal(true);
                            }}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 
                                     bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Use Template
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create Export Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmitExport}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Create Export Configuration</h3>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Basic Information</h4>
                  
                  <div>
                    <label htmlFor="exportName" className="block text-sm font-medium text-gray-700 mb-1">
                      Export Name
                    </label>
                    <input
                      type="text"
                      id="exportName"
                      value={newExport.name || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setNewExport(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                               focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter export configuration name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="reportSelect" className="block text-sm font-medium text-gray-700 mb-1">
                      Report
                    </label>
                    <select
                      id="reportSelect"
                      value={newExport.reportId || ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                        setNewExport(prev => ({ ...prev, reportId: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                               focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a report</option>
                      {reports.map((report) => (
                        <option key={report.id} value={report.id}>
                          {report.name} ({report.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="formatSelect" className="block text-sm font-medium text-gray-700 mb-1">
                        Format
                      </label>
                      <select
                        id="formatSelect"
                        value={newExport.format || 'pdf'}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                          setNewExport(prev => ({ ...prev, format: e.target.value as ExportFormat }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                                 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pdf">PDF</option>
                        <option value="csv">CSV</option>
                        <option value="xlsx">Excel</option>
                        <option value="json">JSON</option>
                        <option value="xml">XML</option>
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="destinationSelect" className="block text-sm font-medium text-gray-700 mb-1">
                        Destination
                      </label>
                      <select
                        id="destinationSelect"
                        value={newExport.destination || 'download'}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                          setNewExport(prev => ({ ...prev, destination: e.target.value as ExportDestination }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                                 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="download">Download</option>
                        <option value="email">Email</option>
                        <option value="cloud">Cloud Storage</option>
                        <option value="ftp">FTP</option>
                        <option value="api">API Endpoint</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Export Settings */}
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => toggleSection('settings')}
                    className="flex items-center w-full text-left"
                    aria-label="Toggle export settings"
                  >
                    {expandedSections.settings ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />
                    )}
                    <h4 className="text-md font-medium text-gray-900">Export Settings</h4>
                  </button>
                  
                  {expandedSections.settings && (
                    <div className="pl-7 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newExport.settings?.includeCharts || false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setNewExport(prev => ({
                                ...prev,
                                settings: { 
                                  includeCharts: true,
                                  includeData: true,
                                  includeHeaders: true,
                                  includeFooters: true,
                                  pageOrientation: 'portrait' as const,
                                  pageSize: 'A4' as const,
                                  quality: 'high' as const,
                                  compression: false,
                                  ...prev.settings, 
                                  includeCharts: e.target.checked 
                                }
                              }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Include Charts</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newExport.settings?.includeData || false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setNewExport(prev => ({
                                ...prev,
                                settings: { 
                                  includeCharts: true,
                                  includeData: true,
                                  includeHeaders: true,
                                  includeFooters: true,
                                  pageOrientation: 'portrait' as const,
                                  pageSize: 'A4' as const,
                                  quality: 'high' as const,
                                  compression: false,
                                  ...prev.settings, 
                                  includeData: e.target.checked 
                                }
                              }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Include Data</span>
                        </label>
                      </div>
                      
                      {(newExport.format === 'pdf') && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="pageOrientation" className="block text-sm font-medium text-gray-700 mb-1">
                              Page Orientation
                            </label>
                            <select
                              id="pageOrientation"
                              value={newExport.settings?.pageOrientation || 'portrait'}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                                setNewExport(prev => ({
                                  ...prev,
                                  settings: { 
                                    includeCharts: true,
                                    includeData: true,
                                    includeHeaders: true,
                                    includeFooters: true,
                                    pageOrientation: 'portrait' as const,
                                    pageSize: 'A4' as const,
                                    quality: 'high' as const,
                                    compression: false,
                                    ...prev.settings, 
                                    pageOrientation: e.target.value as 'portrait' | 'landscape' 
                                  }
                                }))}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="portrait">Portrait</option>
                              <option value="landscape">Landscape</option>
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="pageSize" className="block text-sm font-medium text-gray-700 mb-1">
                              Page Size
                            </label>
                            <select
                              id="pageSize"
                              value={newExport.settings?.pageSize || 'A4'}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                                setNewExport(prev => ({
                                  ...prev,
                                  settings: { 
                                    includeCharts: true,
                                    includeData: true,
                                    includeHeaders: true,
                                    includeFooters: true,
                                    pageOrientation: 'portrait' as const,
                                    pageSize: 'A4' as const,
                                    quality: 'high' as const,
                                    compression: false,
                                    ...prev.settings, 
                                    pageSize: e.target.value as 'A4' | 'A3' | 'Letter' | 'Legal' 
                                  }
                                }))}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="A4">A4</option>
                              <option value="A3">A3</option>
                              <option value="Letter">Letter</option>
                              <option value="Legal">Legal</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                           rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent 
                           rounded-md hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2 inline" />
                  Create Export
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportExport;
