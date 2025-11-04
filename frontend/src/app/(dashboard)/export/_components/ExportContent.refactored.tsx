/**
 * ExportContent Component - White Cross Healthcare Platform (REFACTORED)
 *
 * Main orchestrator component for healthcare data export management featuring:
 * - Student health records export
 * - Medication logs and compliance reports
 * - HIPAA-compliant data export formats
 * - Audit trail and activity logging
 * - Custom report generation
 *
 * This component has been refactored into smaller, maintainable sub-components:
 * - ExportFormatSelector: Format and configuration selection
 * - ExportFieldMapping: Field selection and preview
 * - ExportJobList: Export queue management
 * - ExportTemplateGrid: Template management
 * - ExportHistory: Audit trail
 * - useExportOperations: Custom hook for export logic
 *
 * @component ExportContent
 */

'use client';

import React, { useState } from 'react';
import { Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/navigation/Tabs';

// Import sub-components
import ExportFormatSelector from './ExportFormatSelector';
import ExportFieldMapping from './ExportFieldMapping';
import ExportJobList from './ExportJobList';
import ExportTemplateGrid from './ExportTemplateGrid';
import ExportHistory from './ExportHistory';

// Import custom hook and mock data generators
import {
  useExportOperations,
  generateMockExportJobs,
  generateMockExportTemplates,
  generateMockAuditEntries
} from './useExportOperations';

export default function ExportContent() {
  // Tab state
  const [selectedTab, setSelectedTab] = useState('create');

  // Use custom hook for export operations
  const {
    exportConfig,
    updateExportConfig,
    fields,
    toggleField,
    toggleAllFields,
    previewData,
    createExport,
    downloadExport,
    isSubmitting
  } = useExportOperations();

  // Mock data - In real implementation, these would come from API/state management
  const exportJobs = generateMockExportJobs();
  const exportTemplates = generateMockExportTemplates();
  const auditEntries = generateMockAuditEntries();

  // Event handlers
  const handleViewJob = (jobId: string) => {
    console.log('View job:', jobId);
    // Implement job details view
  };

  const handlePreviewTemplate = (templateId: string) => {
    console.log('Preview template:', templateId);
    // Implement template preview modal
  };

  const handleUseTemplate = (templateId: string) => {
    console.log('Use template:', templateId);
    // Implement template application logic
    setSelectedTab('create');
  };

  const handleCreateTemplate = () => {
    console.log('Create new template');
    // Implement template creation flow
  };

  const handleViewFullAuditLog = () => {
    console.log('View full audit log');
    // Implement full audit log view
  };

  const handleExportSettings = () => {
    console.log('Open export settings');
    // Implement settings modal
  };

  const handleNewExport = () => {
    setSelectedTab('create');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Data Export</h1>
          <p className="text-gray-600 mt-1">
            Export healthcare data with HIPAA compliance and audit tracking
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSettings}
          >
            <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
            Export Settings
          </Button>
          <Button
            size="sm"
            onClick={handleNewExport}
          >
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            New Export
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create Export</TabsTrigger>
          <TabsTrigger value="jobs">Export Jobs</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Create Export Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export Configuration */}
            <ExportFormatSelector
              config={exportConfig}
              onConfigChange={updateExportConfig}
              onSubmit={createExport}
              isSubmitting={isSubmitting}
            />

            {/* Export Preview and Field Mapping */}
            <ExportFieldMapping
              fields={fields}
              previewData={previewData}
              onFieldToggle={toggleField}
              onToggleAll={toggleAllFields}
            />
          </div>
        </TabsContent>

        {/* Export Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <ExportJobList
            jobs={exportJobs}
            onDownload={downloadExport}
            onView={handleViewJob}
            hasMore={false}
          />
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <ExportTemplateGrid
            templates={exportTemplates}
            onPreview={handlePreviewTemplate}
            onUse={handleUseTemplate}
            onCreateNew={handleCreateTemplate}
          />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <ExportHistory
            entries={auditEntries}
            onViewFullLog={handleViewFullAuditLog}
            isHipaaCompliant={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
