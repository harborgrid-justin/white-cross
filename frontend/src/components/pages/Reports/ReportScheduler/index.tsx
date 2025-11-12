'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { ReportSchedule, Recipient, ExecutionHistory, ReportSchedulerProps } from '../types';
import { ScheduleList } from './ScheduleList';
import { CreateScheduleModal } from './CreateScheduleModal';
import { ExecutionHistoryModal } from './ExecutionHistoryModal';

/**
 * ReportScheduler Component
 *
 * A comprehensive report scheduling component that allows users to create,
 * manage, and monitor automated report generation schedules. Supports various
 * frequencies, recipients, and execution monitoring.
 *
 * Features:
 * - Create and manage report schedules
 * - Search and filter schedules
 * - Start, pause, stop, and run schedules
 * - View execution history
 * - Manage recipients and delivery settings
 *
 * @param props - ReportScheduler component props
 * @returns JSX element representing the report scheduler interface
 */
const ReportScheduler: React.FC<ReportSchedulerProps> = ({
  schedules = [],
  availableRecipients = [],
  executionHistory = [],
  loading = false,
  className = '',
  onCreateSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onStartSchedule,
  onPauseSchedule,
  onStopSchedule,
  onRunNow,
  onViewHistory
}) => {
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ReportSchedule | null>(null);

  /**
   * Handles schedule actions (start, pause, stop, edit, delete, etc.)
   */
  const handleScheduleAction = (action: string, schedule: ReportSchedule) => {
    switch (action) {
      case 'start':
        onStartSchedule?.(schedule.id);
        break;

      case 'pause':
        onPauseSchedule?.(schedule.id);
        break;

      case 'stop':
        onStopSchedule?.(schedule.id);
        break;

      case 'run-now':
        onRunNow?.(schedule.id);
        break;

      case 'edit':
        setSelectedSchedule(schedule);
        // Note: Edit functionality can be added by creating an EditScheduleModal component
        // For now, this would need to be implemented
        if (onUpdateSchedule) {
          // Placeholder for edit functionality
          console.log('Edit schedule:', schedule.id);
        }
        break;

      case 'delete':
        if (window.confirm('Are you sure you want to delete this schedule?')) {
          onDeleteSchedule?.(schedule.id);
        }
        break;

      case 'history':
        setSelectedSchedule(schedule);
        onViewHistory?.(schedule.id);
        setShowHistoryModal(true);
        break;

      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  /**
   * Handles creating a new schedule
   */
  const handleCreateSchedule = (
    schedule: Omit<ReportSchedule, 'id' | 'createdAt' | 'updatedAt' | 'executionCount' | 'successCount' | 'failureCount'>
  ) => {
    onCreateSchedule?.(schedule);
    setShowCreateModal(false);
  };

  /**
   * Handles closing the history modal
   */
  const handleCloseHistory = () => {
    setShowHistoryModal(false);
    setSelectedSchedule(null);
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report Scheduler</h1>
            <p className="text-gray-600 mt-1">
              Manage automated report generation and delivery schedules
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white
                     bg-blue-600 border border-transparent rounded-md hover:bg-blue-700
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Schedule
          </button>
        </div>
      </div>

      {/* Schedule List with Filters */}
      <ScheduleList
        schedules={schedules}
        loading={loading}
        onScheduleAction={handleScheduleAction}
        onCreateClick={() => setShowCreateModal(true)}
      />

      {/* Create Schedule Modal */}
      <CreateScheduleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateSchedule}
      />

      {/* Execution History Modal */}
      <ExecutionHistoryModal
        isOpen={showHistoryModal}
        schedule={selectedSchedule}
        executionHistory={executionHistory}
        onClose={handleCloseHistory}
      />
    </div>
  );
};

export default ReportScheduler;

// Re-export for convenience
export { ReportScheduler };
