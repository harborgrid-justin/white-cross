'use client';

import React, { useState } from 'react';
import type { ReportDetailProps, TabType } from './types';
import ReportDetailHeader from './components/ReportDetailHeader';
import ExecutionStatusBar from './components/ExecutionStatusBar';
import ReportDetailTabs from './components/ReportDetailTabs';
import OverviewTab from './components/OverviewTab';
import ParametersTab from './components/ParametersTab';
import HistoryTab from './components/HistoryTab';
import ParameterPanel from './components/ParameterPanel';

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
const ReportDetail: React.FC<ReportDetailProps> = ({
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
}) => {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [parameterValues, setParameterValues] = useState<Record<string, unknown>>({});
  const [showParameterPanel, setShowParameterPanel] = useState<boolean>(false);

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

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <ReportDetailHeader
        report={report}
        executionResult={executionResult}
        canEdit={canEdit}
        canRun={canRun}
        canShare={canShare}
        loading={loading}
        onBack={onBack}
        onToggleBookmark={onToggleBookmark}
        onToggleFavorite={onToggleFavorite}
        onShareReport={onShareReport}
        onCloneReport={onCloneReport}
        onEditReport={onEditReport}
        onRunReport={handleRunReport}
      />

      {/* Current Execution Status */}
      {executionResult && (
        <ExecutionStatusBar
          executionResult={executionResult}
          onCancelExecution={onCancelExecution}
          onDownloadResult={onDownloadResult}
        />
      )}

      {/* Tab Navigation */}
      <ReportDetailTabs
        activeTab={activeTab}
        parametersCount={parameters.length}
        historyCount={recentExecutions.length}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <OverviewTab report={report} />
        )}

        {/* Parameters Tab */}
        {activeTab === 'parameters' && (
          <ParametersTab
            parameters={parameters}
            parameterValues={parameterValues}
            onParameterChange={handleParameterChange}
          />
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <HistoryTab
            recentExecutions={recentExecutions}
            onDownloadResult={onDownloadResult}
          />
        )}
      </div>

      {/* Parameter Panel Modal */}
      <ParameterPanel
        isOpen={showParameterPanel}
        parameters={parameters}
        parameterValues={parameterValues}
        onParameterChange={handleParameterChange}
        onExecute={handleExecuteWithParameters}
        onClose={() => setShowParameterPanel(false)}
      />
    </div>
  );
};

export default ReportDetail;
