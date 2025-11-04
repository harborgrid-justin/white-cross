'use client';

import React, { useState } from 'react';
import { Loader2, Plus, Copy } from 'lucide-react';

import type { ReportPermissionsProps } from './types';
import {
  usePermissionFilters,
  useAccessLogFilters,
  useBulkSelection,
  usePermissionForm,
  useTemplateForm
} from './hooks';
import { PermissionsTable } from './PermissionsTable';
import { TemplatesGrid } from './TemplatesGrid';
import { AccessLogsTable } from './AccessLogsTable';
import { PermissionModal } from './PermissionModal';
import { TemplateModal } from './TemplateModal';

/**
 * ReportPermissions Component
 *
 * A comprehensive permissions management component that handles user and group
 * access control for reports with role-based permissions, templates, and audit logs.
 * Features bulk operations, inheritance, and detailed access tracking.
 *
 * This component has been refactored into smaller, focused sub-components:
 * - PermissionsTable: Permission rules display and management
 * - TemplatesGrid: Permission templates display
 * - AccessLogsTable: Access audit log display
 * - PermissionModal: Create/edit permission rules
 * - TemplateModal: Create/edit templates
 *
 * @param props - ReportPermissions component props
 * @returns JSX element representing the permissions management interface
 */
export const ReportPermissions: React.FC<ReportPermissionsProps> = ({
  entities = [],
  rules = [],
  templates = [],
  accessLogs = [],
  reports = [],
  loading = false,
  className = '',
  onCreateRule,
  onUpdateRule,
  onDeleteRule,
  onCreateTemplate,
  onApplyTemplate,
  onBulkPermissionChange
}) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<'permissions' | 'templates' | 'logs'>('permissions');

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Permission filters and data
  const {
    searchTerm: permissionSearch,
    setSearchTerm: setPermissionSearch,
    filters,
    updateFilter,
    filteredRules
  } = usePermissionFilters(rules);

  // Access log filters
  const {
    searchTerm: logSearch,
    setSearchTerm: setLogSearch,
    filteredLogs
  } = useAccessLogFilters(accessLogs);

  // Bulk selection for permissions
  const {
    selectedIds: selectedRules,
    handleSelect,
    toggleSelectAll,
    isAllSelected,
    setSelectedIds: setSelectedRules
  } = useBulkSelection(filteredRules);

  // Permission form
  const {
    formData: permissionFormData,
    updateField: updatePermissionField,
    handleSubmit: handlePermissionSubmit,
    resetForm: resetPermissionForm,
    isValid: isPermissionValid
  } = usePermissionForm((rule) => {
    onCreateRule?.(rule);
    setShowCreateModal(false);
    resetPermissionForm();
  });

  // Template form
  const {
    formData: templateFormData,
    updateField: updateTemplateField,
    handleSubmit: handleTemplateSubmit,
    resetForm: resetTemplateForm,
    isValid: isTemplateValid
  } = useTemplateForm((template) => {
    onCreateTemplate?.(template);
    setShowTemplateModal(false);
    resetTemplateForm();
  });

  // Handle bulk delete
  const handleBulkDelete = (ruleIds: string[]) => {
    ruleIds.forEach(id => onDeleteRule?.(id));
    setSelectedRules([]);
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report Permissions</h1>
            <p className="text-gray-600 mt-1">
              Manage user and group access to reports and data
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Copy className="w-4 h-4 mr-2" />
              New Template
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white
                       bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Permission
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <nav className="flex space-x-8">
            {[
              { id: 'permissions' as const, label: 'Permissions', count: rules.length },
              { id: 'templates' as const, label: 'Templates', count: templates.length },
              { id: 'logs' as const, label: 'Access Logs', count: accessLogs.length }
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

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="p-6">
          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <PermissionsTable
              rules={filteredRules}
              searchTerm={permissionSearch}
              filters={filters}
              selectedRules={selectedRules}
              isAllSelected={isAllSelected}
              onSearchChange={setPermissionSearch}
              onFilterChange={updateFilter}
              onSelectRule={handleSelect}
              onSelectAll={toggleSelectAll}
              onEditRule={(id) => {
                // TODO: Implement edit functionality
                console.log('Edit rule:', id);
              }}
              onDeleteRule={onDeleteRule}
              onBulkDelete={handleBulkDelete}
              onCreateRule={() => setShowCreateModal(true)}
            />
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <TemplatesGrid
              templates={templates}
              onApplyTemplate={(templateId) => {
                // TODO: Implement apply template with entity selection
                onApplyTemplate?.(templateId, []);
              }}
              onCreateTemplate={() => setShowTemplateModal(true)}
            />
          )}

          {/* Access Logs Tab */}
          {activeTab === 'logs' && (
            <AccessLogsTable
              logs={filteredLogs}
              searchTerm={logSearch}
              onSearchChange={setLogSearch}
              maxLogs={50}
            />
          )}
        </div>
      )}

      {/* Permission Modal */}
      <PermissionModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetPermissionForm();
        }}
        onSubmit={handlePermissionSubmit}
        formData={permissionFormData}
        onFieldChange={updatePermissionField}
        entities={entities}
        reports={reports}
        isValid={isPermissionValid}
      />

      {/* Template Modal */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => {
          setShowTemplateModal(false);
          resetTemplateForm();
        }}
        onSubmit={handleTemplateSubmit}
        formData={templateFormData}
        onFieldChange={updateTemplateField}
        isValid={isTemplateValid}
      />
    </div>
  );
};

// Re-export types for convenience
export type {
  PermissionLevel,
  PermissionScope,
  EntityType,
  PermissionAction,
  PermissionEntity,
  PermissionRule,
  PermissionTemplate,
  AccessLogEntry,
  ReportReference,
  PermissionFilters,
  ReportPermissionsProps
} from './types';

export default ReportPermissions;
