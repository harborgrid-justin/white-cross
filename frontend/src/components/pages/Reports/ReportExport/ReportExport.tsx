'use client';

import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import type { 
  ExportConfig, 
  ExportJob, 
  ExportTemplate, 
  ReportReference,
  ExportFilters
} from './types';
import { ExportConfigs } from './ExportConfigs';
import { ExportJobs } from './ExportJobs';
import { ExportTemplates } from './ExportTemplates';
import { CreateExportModal } from './CreateExportModal';

/**
 * Props for the ReportExport component
 */
interface ReportExportProps {
  /** Available reports for export */
  reports?: ReportReference[];
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
 */
const ReportExport: React.FC<ReportExportProps> = ({
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
}) => {
  // State
  const [activeTab, setActiveTab] = useState<'configs' | 'jobs' | 'templates'>('configs');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ExportConfig | null>(null);
  const [filters, setFilters] = useState<ExportFilters>({
    status: 'all',
    format: 'all',
    priority: 'all'
  });

  // Event handlers
  const handleCreateNew = () => {
    setSelectedConfig(null);
    setShowCreateModal(true);
  };

  const handleEditConfig = (config: ExportConfig) => {
    setSelectedConfig(config);
    setShowCreateModal(true);
  };

  const handleModalSubmit = (config: Partial<ExportConfig>) => {
    if (selectedConfig?.id) {
      onUpdateConfig?.(selectedConfig.id, config);
    } else {
      onCreateExport?.(config);
    }
    setSelectedConfig(null);
  };

  const handleUseTemplate = (template: ExportTemplate) => {
    setSelectedConfig({
      id: '',
      name: '',
      reportId: '',
      reportName: '',
      format: template.format,
      destination: 'download',
      settings: template.settings,
      filters: {},
      createdAt: '',
      createdBy: ''
    });
    setShowCreateModal(true);
  };

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
            onClick={handleCreateNew}
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
            <ExportConfigs
              configs={configs}
              onCreateNew={handleCreateNew}
              onStartJob={onStartJob || (() => {})}
              onEditConfig={handleEditConfig}
              onDeleteConfig={onDeleteConfig || (() => {})}
            />
          )}

          {/* Export Jobs Tab */}
          {activeTab === 'jobs' && (
            <ExportJobs
              jobs={jobs}
              filters={filters}
              onFiltersChange={setFilters}
              onCancelJob={onCancelJob || (() => {})}
              onDownloadFile={onDownloadFile || (() => {})}
            />
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <ExportTemplates
              templates={templates}
              onUseTemplate={handleUseTemplate}
              onSaveTemplate={onSaveTemplate}
            />
          )}
        </div>
      )}

      {/* Create/Edit Export Modal */}
      <CreateExportModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedConfig(null);
        }}
        onSubmit={handleModalSubmit}
        reports={reports}
        initialData={selectedConfig || undefined}
      />
    </div>
  );
};

export default ReportExport;
