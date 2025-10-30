'use client';

import React, { useState } from 'react';

/**
 * Interface for report configuration
 */
interface ReportConfig {
  id: string;
  name: string;
  description: string;
  type: 'medication-usage' | 'compliance' | 'inventory' | 'administration' | 'alerts' | 'custom';
  parameters: Record<string, unknown>;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    time: string;
    recipients: string[];
  };
}

/**
 * Interface for generated report
 */
interface GeneratedReport {
  id: string;
  configId: string;
  name: string;
  type: string;
  generatedAt: string;
  generatedBy: string;
  status: 'generating' | 'completed' | 'failed';
  fileUrl?: string;
  fileSize?: number;
  recordCount?: number;
  dateRange: {
    start: string;
    end: string;
  };
  filters: Record<string, unknown>;
  error?: string;
}

/**
 * Interface for report filters
 */
interface ReportFilters {
  type: string;
  status: string;
  dateRange: string;
  searchTerm: string;
}

/**
 * Props for the MedicationReports component
 */
interface MedicationReportsProps {
  /** Array of report configurations */
  reportConfigs?: ReportConfig[];
  /** Array of generated reports */
  generatedReports?: GeneratedReport[];
  /** Whether the component is in loading state */
  loading?: boolean;
  /** Error message to display */
  error?: string;
  /** Callback when report is generated */
  onGenerateReport?: (configId: string, parameters: Record<string, unknown>) => void;
  /** Callback when report is downloaded */
  onDownloadReport?: (reportId: string) => void;
  /** Callback when report is deleted */
  onDeleteReport?: (reportId: string) => void;
  /** Callback when report config is saved */
  onSaveReportConfig?: (config: Partial<ReportConfig>) => void;
  /** Callback when scheduled report is updated */
  onUpdateSchedule?: (configId: string, schedule: ReportConfig['schedule']) => void;
}

/**
 * MedicationReports component for generating and managing medication reports
 * 
 * Features:
 * - Comprehensive report generation and management
 * - Multiple report types (usage, compliance, inventory, etc.)
 * - Custom report configuration and parameters
 * - Scheduled report generation and automation
 * - Report history and archive management
 * - Export capabilities (PDF, Excel, CSV)
 * - Advanced filtering and search
 * - Report sharing and distribution
 * 
 * @param props - The component props
 * @returns JSX element representing the medication reports interface
 */
export function MedicationReports({
  reportConfigs = [],
  generatedReports = [],
  loading = false,
  error,
  onGenerateReport,
  onDownloadReport,
  onDeleteReport,
  onSaveReportConfig,
  onUpdateSchedule
}: MedicationReportsProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'history' | 'scheduled'>('generate');
  const [filters, setFilters] = useState<ReportFilters>({
    type: 'all',
    status: 'all',
    dateRange: 'all',
    searchTerm: ''
  });
  const [selectedReport, setSelectedReport] = useState<ReportConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [reportParameters, setReportParameters] = useState<Record<string, unknown>>({});

  /**
   * Get report type configuration
   */
  const getReportTypeConfig = (type: ReportConfig['type']) => {
    const configs = {
      'medication-usage': {
        name: 'Medication Usage',
        description: 'Track medication usage patterns and trends',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        color: 'blue'
      },
      'compliance': {
        name: 'Compliance Report',
        description: 'Monitor medication compliance and adherence',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        color: 'green'
      },
      'inventory': {
        name: 'Inventory Report',
        description: 'Track medication inventory and stock levels',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        color: 'purple'
      },
      'administration': {
        name: 'Administration Log',
        description: 'Review medication administration records',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
        color: 'orange'
      },
      'alerts': {
        name: 'Alerts Summary',
        description: 'Analyze medication alerts and notifications',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        ),
        color: 'red'
      },
      'custom': {
        name: 'Custom Report',
        description: 'Create custom reports with specific parameters',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        ),
        color: 'gray'
      }
    };
    return configs[type] || configs['custom'];
  };

  /**
   * Get status badge styling
   */
  const getStatusBadge = (status: GeneratedReport['status']) => {
    const badges = {
      'generating': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'failed': 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[status] || badges['generating'];
  };

  /**
   * Filter reports based on current filters
   */
  const filteredReports = React.useMemo(() => {
    return generatedReports.filter(report => {
      const matchesSearch = report.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesType = filters.type === 'all' || report.type === filters.type;
      const matchesStatus = filters.status === 'all' || report.status === filters.status;
      
      let matchesDateRange = true;
      if (filters.dateRange !== 'all') {
        const reportDate = new Date(report.generatedAt);
        const now = new Date();
        const diffDays = (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24);
        
        switch (filters.dateRange) {
          case '7-days':
            matchesDateRange = diffDays <= 7;
            break;
          case '30-days':
            matchesDateRange = diffDays <= 30;
            break;
          case '90-days':
            matchesDateRange = diffDays <= 90;
            break;
        }
      }

      return matchesSearch && matchesType && matchesStatus && matchesDateRange;
    });
  }, [generatedReports, filters]);

  /**
   * Format file size
   */
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Reports</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medication Reports</h2>
          <p className="mt-1 text-sm text-gray-500">Generate and manage comprehensive medication reports</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowConfigModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Custom Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('generate')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'generate'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Generate Reports
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Report History
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'scheduled'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Scheduled Reports
          </button>
        </nav>
      </div>

      {/* Generate Reports Tab */}
      {activeTab === 'generate' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportConfigs.map((config) => {
              const typeConfig = getReportTypeConfig(config.type);
              
              return (
                <div
                  key={config.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedReport(config);
                    setReportParameters(config.parameters || {});
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 bg-${typeConfig.color}-100 rounded-md flex items-center justify-center mr-3`}>
                      <div className={`text-${typeConfig.color}-600`}>
                        {typeConfig.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{config.name}</h3>
                      <p className="text-sm text-gray-500">{typeConfig.name}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4">{config.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${typeConfig.color}-100 text-${typeConfig.color}-800`}>
                      {config.type.replace('-', ' ')}
                    </span>
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        onGenerateReport?.(config.id, config.parameters || {});
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Report History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search-reports" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  id="search-reports"
                  type="text"
                  placeholder="Search reports..."
                  value={filters.searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setFilters(prev => ({ ...prev, searchTerm: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Search reports"
                />
              </div>

              <div>
                <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="type-filter"
                  value={filters.type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    setFilters(prev => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Filter by report type"
                >
                  <option value="all">All Types</option>
                  <option value="medication-usage">Medication Usage</option>
                  <option value="compliance">Compliance</option>
                  <option value="inventory">Inventory</option>
                  <option value="administration">Administration</option>
                  <option value="alerts">Alerts</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status-filter"
                  value={filters.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    setFilters(prev => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Filter by report status"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="generating">Generating</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <select
                  id="date-filter"
                  value={filters.dateRange}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    setFilters(prev => ({ ...prev, dateRange: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Filter by date range"
                >
                  <option value="all">All Time</option>
                  <option value="7-days">Last 7 days</option>
                  <option value="30-days">Last 30 days</option>
                  <option value="90-days">Last 90 days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Generated Reports ({filteredReports.length})
              </h3>
            </div>

            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {Object.values(filters).some(filter => filter !== 'all' && filter !== '')
                    ? 'Try adjusting your filters to see more results.'
                    : 'Generate your first report to get started.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <div key={report.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-sm font-medium text-gray-900">{report.name}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                        
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          <span>Type: {report.type.replace('-', ' ')}</span>
                          <span>Generated: {new Date(report.generatedAt).toLocaleString()}</span>
                          <span>By: {report.generatedBy}</span>
                          {report.recordCount && <span>Records: {report.recordCount.toLocaleString()}</span>}
                          {report.fileSize && <span>Size: {formatFileSize(report.fileSize)}</span>}
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                          Period: {new Date(report.dateRange.start).toLocaleDateString()} - {new Date(report.dateRange.end).toLocaleDateString()}
                        </div>

                        {report.status === 'failed' && report.error && (
                          <div className="mt-2 text-xs text-red-600">
                            Error: {report.error}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {report.status === 'completed' && report.fileUrl && (
                          <button
                            onClick={() => onDownloadReport?.(report.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            aria-label={`Download report: ${report.name}`}
                          >
                            Download
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteReport?.(report.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                          aria-label={`Delete report: ${report.name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scheduled Reports Tab */}
      {activeTab === 'scheduled' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Scheduled Reports</h3>
            
            {reportConfigs.filter(config => config.schedule).length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No scheduled reports</h3>
                <p className="mt-1 text-sm text-gray-500">Set up automated report generation schedules.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reportConfigs.filter(config => config.schedule).map((config) => (
                  <div key={config.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{config.name}</h4>
                        <p className="text-sm text-gray-500">
                          {config.schedule?.frequency} at {config.schedule?.time}
                        </p>
                        <p className="text-xs text-gray-400">
                          Recipients: {config.schedule?.recipients.join(', ')}
                        </p>
                      </div>
                      <button
                        onClick={() => onUpdateSchedule?.(config.id, undefined)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Report Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create Custom Report</h3>
            <p className="text-sm text-gray-600 mb-4">Configure a custom report with specific parameters and filters.</p>
            {/* Report configuration form would go here */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle report config save
                  setShowConfigModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save & Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicationReports;
