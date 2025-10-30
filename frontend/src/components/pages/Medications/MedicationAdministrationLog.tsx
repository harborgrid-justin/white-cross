'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  Clock, 
  User, 
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Pill,
  FileText
} from 'lucide-react';

/**
 * Interface for administration log entry
 */
interface AdministrationLogEntry {
  id: string;
  medicationId: string;
  medicationName: string;
  studentId: string;
  studentName: string;
  dosage: string;
  scheduledTime: string;
  administeredTime?: string;
  administeredBy: string;
  status: 'completed' | 'missed' | 'refused' | 'late';
  notes?: string;
  studentReaction?: string;
  route: string;
  reasonForMissed?: string;
  witnesses?: string[];
}

/**
 * Props for the MedicationAdministrationLog component
 */
interface MedicationAdministrationLogProps {
  /** Array of administration log entries */
  logEntries?: AdministrationLogEntry[];
  /** Loading state */
  loading?: boolean;
  /** Filter by status */
  statusFilter?: 'all' | 'completed' | 'missed' | 'refused' | 'late';
  /** Filter by date range */
  dateRange?: { start: Date; end: Date };
  /** Callback when filter changes */
  onFilterChange?: (filter: 'all' | 'completed' | 'missed' | 'refused' | 'late') => void;
  /** Callback when date range changes */
  onDateRangeChange?: (range: { start: Date; end: Date }) => void;
  /** Callback when log entry is clicked */
  onLogEntryClick?: (entry: AdministrationLogEntry) => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * MedicationAdministrationLog Component
 * 
 * Displays a comprehensive log of medication administrations with filtering,
 * status tracking, and detailed administration records.
 * 
 * @component
 * @example
 * ```tsx
 * <MedicationAdministrationLog 
 *   logEntries={administrationLog}
 *   statusFilter="completed"
 *   onLogEntryClick={handleLogEntryClick}
 * />
 * ```
 */
export const MedicationAdministrationLog = ({
  logEntries = [],
  loading = false,
  statusFilter = 'all',
  dateRange,
  onFilterChange,
  onDateRangeChange,
  onLogEntryClick,
  className = ''
}: MedicationAdministrationLogProps) => {
  const [sortBy, setSortBy] = useState<'time' | 'student' | 'status'>('time');

  const getStatusIcon = (status: AdministrationLogEntry['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'missed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'refused':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'late':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: AdministrationLogEntry['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'missed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refused':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  };

  // Filter log entries
  const filteredEntries = logEntries.filter(entry => {
    if (statusFilter !== 'all' && entry.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Sort log entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    switch (sortBy) {
      case 'time':
        return new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime();
      case 'student':
        return a.studentName.localeCompare(b.studentName);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // Calculate summary statistics
  const totalEntries = logEntries.length;
  const completedCount = logEntries.filter(e => e.status === 'completed').length;
  const missedCount = logEntries.filter(e => e.status === 'missed').length;
  const refusedCount = logEntries.filter(e => e.status === 'refused').length;

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading administration log...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Administration Log</h1>
            <p className="text-sm text-gray-600 mt-1">Track medication administration history and compliance</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{totalEntries}</p>
              </div>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">{completedCount}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Missed</p>
                <p className="text-2xl font-bold text-red-900">{missedCount}</p>
              </div>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Refused</p>
                <p className="text-2xl font-bold text-orange-900">{refusedCount}</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFilterChange && onFilterChange(e.target.value as typeof statusFilter)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
                <option value="refused">Refused</option>
                <option value="late">Late</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Sort by criteria"
            >
              <option value="time">Date & Time</option>
              <option value="student">Student Name</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Log Entries */}
      <div className="px-6 py-4">
        {sortedEntries.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No administration records found</h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? 'No administration records are available for the selected period.'
                : `No ${statusFilter} administration records found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEntries.map((entry) => {
              const scheduled = formatDateTime(entry.scheduledTime);
              const administered = entry.administeredTime ? formatDateTime(entry.administeredTime) : null;

              return (
                <div
                  key={entry.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => onLogEntryClick && onLogEntryClick(entry)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(entry.status)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{entry.medicationName}</h3>
                              <p className="text-sm text-gray-600">{entry.studentName}</p>
                            </div>
                            <span className={`
                              inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border
                              ${getStatusColor(entry.status)}
                            `}>
                              {entry.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Scheduled</p>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span className="text-sm">{scheduled.date}</span>
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-sm">{scheduled.time}</span>
                              </div>
                            </div>
                            
                            {administered && (
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Administered</p>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-3 h-3 text-gray-400" />
                                  <span className="text-sm">{administered.date}</span>
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-sm">{administered.time}</span>
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Dosage & Route</p>
                              <div className="flex items-center space-x-2">
                                <Pill className="w-3 h-3 text-gray-400" />
                                <span className="text-sm">{entry.dosage}</span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-sm capitalize">{entry.route}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>Administered by: {entry.administeredBy}</span>
                            </div>
                          </div>

                          {entry.notes && (
                            <div className="mb-2">
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{entry.notes}</p>
                            </div>
                          )}

                          {entry.studentReaction && (
                            <div className="mb-2">
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Student Reaction</p>
                              <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">{entry.studentReaction}</p>
                            </div>
                          )}

                          {entry.reasonForMissed && (
                            <div className="mb-2">
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Reason for Missed</p>
                              <p className="text-sm text-gray-700 bg-red-50 p-2 rounded">{entry.reasonForMissed}</p>
                            </div>
                          )}

                          {entry.witnesses && entry.witnesses.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Witnesses</p>
                              <div className="flex flex-wrap gap-1">
                                {entry.witnesses.map((witness, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                    {witness}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationAdministrationLog;
