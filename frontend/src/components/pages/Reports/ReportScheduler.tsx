'use client';

import React, { useState } from 'react';
import { 
  Clock,
  Calendar,
  Mail,
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
  AlertCircle,
  CheckCircle,
  Info,
  Edit,
  Trash2,
  Copy,
  Plus,
  Filter,
  Search,
  MoreVertical,
  User,
  Users,
  FileText,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  X,
  Eye,
  Save
} from 'lucide-react';

/**
 * Schedule frequency options
 */
type ScheduleFrequency = 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

/**
 * Schedule status types
 */
type ScheduleStatus = 'active' | 'paused' | 'stopped' | 'completed' | 'failed' | 'pending';

/**
 * Day of week options
 */
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

/**
 * Month options
 */
type Month = 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december';

/**
 * Schedule configuration interface
 */
interface ScheduleConfig {
  frequency: ScheduleFrequency;
  time: string; // HH:MM format
  timezone: string;
  daysOfWeek?: DayOfWeek[];
  dayOfMonth?: number;
  month?: Month;
  endDate?: string;
  maxExecutions?: number;
}

/**
 * Recipient interface
 */
interface Recipient {
  id: string;
  name: string;
  email: string;
  type: 'user' | 'group' | 'external';
  department?: string;
  role?: string;
}

/**
 * Report schedule interface
 */
interface ReportSchedule {
  id: string;
  reportId: string;
  reportName: string;
  reportCategory: string;
  name: string;
  description: string;
  status: ScheduleStatus;
  config: ScheduleConfig;
  recipients: Recipient[];
  format: 'pdf' | 'excel' | 'csv' | 'json';
  includeCharts: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
  nextRun?: string;
  executionCount: number;
  successCount: number;
  failureCount: number;
  tags: string[];
}

/**
 * Execution history interface
 */
interface ExecutionHistory {
  id: string;
  scheduleId: string;
  executedAt: string;
  status: 'success' | 'failed' | 'partial';
  duration: number;
  recordCount?: number;
  fileSize?: number;
  errorMessage?: string;
  recipients: string[];
}

/**
 * Props for the ReportScheduler component
 */
interface ReportSchedulerProps {
  /** List of report schedules */
  schedules?: ReportSchedule[];
  /** Available recipients */
  availableRecipients?: Recipient[];
  /** Execution history */
  executionHistory?: ExecutionHistory[];
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Create schedule handler */
  onCreateSchedule?: (schedule: Omit<ReportSchedule, 'id' | 'createdAt' | 'updatedAt' | 'executionCount' | 'successCount' | 'failureCount'>) => void;
  /** Update schedule handler */
  onUpdateSchedule?: (id: string, updates: Partial<ReportSchedule>) => void;
  /** Delete schedule handler */
  onDeleteSchedule?: (id: string) => void;
  /** Start schedule handler */
  onStartSchedule?: (id: string) => void;
  /** Pause schedule handler */
  onPauseSchedule?: (id: string) => void;
  /** Stop schedule handler */
  onStopSchedule?: (id: string) => void;
  /** Run schedule now handler */
  onRunNow?: (id: string) => void;
  /** View execution history handler */
  onViewHistory?: (scheduleId: string) => void;
}

/**
 * ReportScheduler Component
 * 
 * A comprehensive report scheduling component that allows users to create,
 * manage, and monitor automated report generation schedules. Supports various
 * frequencies, recipients, and execution monitoring.
 * 
 * @param props - ReportScheduler component props
 * @returns JSX element representing the report scheduler interface
 */
const ReportScheduler = ({
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
}: ReportSchedulerProps) => {
  // State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<ScheduleStatus | 'all'>('all');
  const [selectedSchedule, setSelectedSchedule] = useState<ReportSchedule | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [expandedSchedules, setExpandedSchedules] = useState<Record<string, boolean>>({});

  // New schedule form state
  const [newSchedule, setNewSchedule] = useState<Partial<ReportSchedule>>({
    name: '',
    description: '',
    status: 'pending',
    config: {
      frequency: 'daily',
      time: '09:00',
      timezone: 'America/New_York'
    },
    recipients: [],
    format: 'pdf',
    includeCharts: true,
    tags: []
  });

  /**
   * Gets status badge styling
   */
  const getStatusBadge = (status: ScheduleStatus) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      paused: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Paused' },
      stopped: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Stopped' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
      pending: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Pending' }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  /**
   * Gets frequency display text
   */
  const getFrequencyText = (config: ScheduleConfig): string => {
    switch (config.frequency) {
      case 'once':
        return 'One time';
      case 'hourly':
        return 'Every hour';
      case 'daily':
        return `Daily at ${config.time}`;
      case 'weekly':
        return `Weekly on ${config.daysOfWeek?.join(', ') || 'weekdays'} at ${config.time}`;
      case 'monthly':
        return `Monthly on day ${config.dayOfMonth || 1} at ${config.time}`;
      case 'quarterly':
        return `Quarterly at ${config.time}`;
      case 'yearly':
        return `Yearly in ${config.month || 'January'} at ${config.time}`;
      default:
        return 'Custom';
    }
  };

  /**
   * Formats date string
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Calculates success rate
   */
  const getSuccessRate = (schedule: ReportSchedule): number => {
    if (schedule.executionCount === 0) return 0;
    return Math.round((schedule.successCount / schedule.executionCount) * 100);
  };

  /**
   * Filters schedules based on search and status
   */
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.reportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /**
   * Handles schedule action
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
        setShowEditModal(true);
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
    }
  };

  /**
   * Handles create schedule
   */
  const handleCreateSchedule = () => {
    if (newSchedule.name && newSchedule.config && onCreateSchedule) {
      onCreateSchedule(newSchedule as Omit<ReportSchedule, 'id' | 'createdAt' | 'updatedAt' | 'executionCount' | 'successCount' | 'failureCount'>);
      setShowCreateModal(false);
      setNewSchedule({
        name: '',
        description: '',
        status: 'pending',
        config: {
          frequency: 'daily',
          time: '09:00',
          timezone: 'America/New_York'
        },
        recipients: [],
        format: 'pdf',
        includeCharts: true,
        tags: []
      });
    }
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

      {/* Filters */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md 
                         leading-5 bg-white placeholder-gray-500 focus:outline-none 
                         focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 
                         focus:border-blue-500 sm:text-sm"
                placeholder="Search schedules..."
                aria-label="Search schedules"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as ScheduleStatus | 'all')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm 
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="stopped">Stopped</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schedules List */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first report schedule'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 
                         bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Schedule
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSchedules.map((schedule) => {
              const isExpanded = expandedSchedules[schedule.id];
              const successRate = getSuccessRate(schedule);
              
              return (
                <div key={schedule.id} className="border border-gray-200 rounded-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setExpandedSchedules(prev => ({
                            ...prev,
                            [schedule.id]: !prev[schedule.id]
                          }))}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          aria-label={isExpanded ? 'Collapse schedule details' : 'Expand schedule details'}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-gray-900">{schedule.name}</h3>
                            {getStatusBadge(schedule.status)}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{schedule.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Report: {schedule.reportName}</span>
                            <span>•</span>
                            <span>{getFrequencyText(schedule.config)}</span>
                            <span>•</span>
                            <span>{schedule.recipients.length} recipients</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {/* Quick Stats */}
                        <div className="text-right text-sm">
                          <div className="text-gray-900 font-medium">
                            {successRate}% success
                          </div>
                          <div className="text-gray-500">
                            {schedule.executionCount} runs
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-1">
                          {schedule.status === 'active' && (
                            <button
                              onClick={() => handleScheduleAction('pause', schedule)}
                              className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded"
                              title="Pause schedule"
                              aria-label="Pause schedule"
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          )}
                          
                          {schedule.status === 'paused' && (
                            <button
                              onClick={() => handleScheduleAction('start', schedule)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                              title="Resume schedule"
                              aria-label="Resume schedule"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          
                          {schedule.status === 'pending' && (
                            <button
                              onClick={() => handleScheduleAction('start', schedule)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                              title="Start schedule"
                              aria-label="Start schedule"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleScheduleAction('run-now', schedule)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            title="Run now"
                            aria-label="Run schedule now"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleScheduleAction('edit', schedule)}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                            title="Edit schedule"
                            aria-label="Edit schedule"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleScheduleAction('history', schedule)}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                            title="View history"
                            aria-label="View execution history"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleScheduleAction('delete', schedule)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            title="Delete schedule"
                            aria-label="Delete schedule"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Schedule Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Frequency:</span>
                                <span className="text-gray-900">{getFrequencyText(schedule.config)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Timezone:</span>
                                <span className="text-gray-900">{schedule.config.timezone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Format:</span>
                                <span className="text-gray-900 uppercase">{schedule.format}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Include Charts:</span>
                                <span className="text-gray-900">{schedule.includeCharts ? 'Yes' : 'No'}</span>
                              </div>
                              {schedule.nextRun && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Next Run:</span>
                                  <span className="text-gray-900">{formatDate(schedule.nextRun)}</span>
                                </div>
                              )}
                              {schedule.lastRun && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Last Run:</span>
                                  <span className="text-gray-900">{formatDate(schedule.lastRun)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Recipients ({schedule.recipients.length})</h4>
                            <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
                              {schedule.recipients.map((recipient) => (
                                <div key={recipient.id} className="flex items-center space-x-2">
                                  <div className="flex-shrink-0">
                                    {recipient.type === 'group' ? (
                                      <Users className="w-3 h-3 text-gray-400" />
                                    ) : (
                                      <User className="w-3 h-3 text-gray-400" />
                                    )}
                                  </div>
                                  <span className="text-gray-900 truncate">{recipient.name}</span>
                                  <span className="text-gray-500 text-xs">({recipient.email})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {schedule.tags.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-1">
                              {schedule.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Schedule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Create New Schedule</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Name *
                </label>
                <input
                  type="text"
                  value={newSchedule.name || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter schedule name"
                  aria-label="Schedule name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newSchedule.description || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewSchedule(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe this schedule"
                  aria-label="Schedule description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <select
                    value={newSchedule.config?.frequency || 'daily'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewSchedule(prev => ({
                      ...prev,
                      config: { ...prev.config!, frequency: e.target.value as ScheduleFrequency }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md 
                             focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Schedule frequency"
                  >
                    <option value="once">One Time</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newSchedule.config?.time || '09:00'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSchedule(prev => ({
                      ...prev,
                      config: { ...prev.config!, time: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md 
                             focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Schedule time"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border 
                         border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSchedule}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                         border border-transparent rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2 inline" />
                Create Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Execution History - {selectedSchedule.name}
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Close history modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {executionHistory.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No execution history available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {executionHistory
                    .filter(history => history.scheduleId === selectedSchedule.id)
                    .map((history) => (
                      <div key={history.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${
                              history.status === 'success' ? 'bg-green-100 text-green-600' :
                              history.status === 'failed' ? 'bg-red-100 text-red-600' :
                              'bg-yellow-100 text-yellow-600'
                            }`}>
                              {history.status === 'success' ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : history.status === 'failed' ? (
                                <AlertCircle className="w-4 h-4" />
                              ) : (
                                <Info className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {formatDate(history.executedAt)}
                              </div>
                              <div className="text-sm text-gray-500">
                                Duration: {Math.round(history.duration / 1000)}s
                                {history.recordCount && ` • ${history.recordCount} records`}
                                {history.fileSize && ` • ${Math.round(history.fileSize / 1024)}KB`}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            Sent to {history.recipients.length} recipients
                          </div>
                        </div>
                        
                        {history.errorMessage && (
                          <div className="mt-3 p-3 bg-red-50 rounded-md">
                            <div className="text-sm text-red-800">
                              <strong>Error:</strong> {history.errorMessage}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportScheduler;
