'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  AlertCircle,
  CheckCircle,
  XCircle,
  Pill,
  User
} from 'lucide-react';

/**
 * Interface for scheduled medication dose
 */
interface ScheduledDose {
  id: string;
  medicationId: string;
  medicationName: string;
  studentName: string;
  studentId: string;
  dosage: string;
  scheduledTime: string;
  status: 'pending' | 'completed' | 'missed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  route: string;
  notes?: string;
  administeredBy?: string;
  administeredAt?: string;
}

/**
 * Props for the MedicationSchedule component
 */
interface MedicationScheduleProps {
  /** Array of scheduled doses */
  scheduledDoses?: ScheduledDose[];
  /** Loading state */
  loading?: boolean;
  /** Selected date */
  selectedDate?: Date;
  /** Callback when date changes */
  onDateChange?: (date: Date) => void;
  /** Callback when dose is administered */
  onAdministerDose?: (dose: ScheduledDose) => void;
  /** Callback when dose is marked as missed */
  onMarkMissed?: (dose: ScheduledDose) => void;
  /** Callback when dose is clicked */
  onDoseClick?: (dose: ScheduledDose) => void;
  /** Filter by status */
  statusFilter?: 'all' | 'pending' | 'completed' | 'missed' | 'overdue';
  /** Callback when filter changes */
  onFilterChange?: (filter: 'all' | 'pending' | 'completed' | 'missed' | 'overdue') => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * MedicationSchedule Component
 * 
 * Displays medication administration schedule with calendar navigation,
 * status filtering, and administration tracking capabilities.
 * 
 * @component
 * @example
 * ```tsx
 * <MedicationSchedule 
 *   scheduledDoses={doses}
 *   selectedDate={currentDate}
 *   onDateChange={setCurrentDate}
 *   onAdministerDose={handleAdminister}
 * />
 * ```
 */
export const MedicationSchedule = ({
  scheduledDoses = [],
  loading = false,
  selectedDate = new Date(),
  onDateChange,
  onAdministerDose,
  onMarkMissed,
  onDoseClick,
  statusFilter = 'all',
  onFilterChange,
  className = ''
}: MedicationScheduleProps) => {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  const handleDateChange = (newDate: Date) => {
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    handleDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    handleDateChange(newDate);
  };

  const handleToday = () => {
    handleDateChange(new Date());
  };

  const getStatusIcon = (status: ScheduledDose['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'missed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: ScheduledDose['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'missed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'overdue':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getPriorityColor = (priority: ScheduledDose['priority']) => {
    switch (priority) {
      case 'critical':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Filter doses based on selected filters
  const filteredDoses = scheduledDoses.filter(dose => {
    if (statusFilter !== 'all' && dose.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Group doses by time for better organization
  const groupedDoses = filteredDoses.reduce((groups, dose) => {
    const time = formatTime(dose.scheduledTime);
    if (!groups[time]) {
      groups[time] = [];
    }
    groups[time].push(dose);
    return groups;
  }, {} as Record<string, ScheduledDose[]>);

  const timeSlots = Object.keys(groupedDoses).sort((a, b) => {
    const timeA = new Date(`1970/01/01 ${a}`);
    const timeB = new Date(`1970/01/01 ${b}`);
    return timeA.getTime() - timeB.getTime();
  });

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medication schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Medication Schedule</h1>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Week
              </button>
            </div>
          </div>
        </div>

        {/* Date navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousDay}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Previous day"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {formatDate(selectedDate)}
                </h2>
                {isToday(selectedDate) && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Today
                  </span>
                )}
              </div>
              
              <button
                onClick={handleNextDay}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Next day"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <button
              onClick={handleToday}
              className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFilterChange && onFilterChange(e.target.value as typeof statusFilter)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
              <option value="missed">Missed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schedule content */}
      <div className="px-6 py-4">
        {filteredDoses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Pill className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No medications scheduled
            </h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? 'There are no medication doses scheduled for this date.'
                : `There are no ${statusFilter} medication doses for this date.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {timeSlots.map(timeSlot => (
              <div key={timeSlot} className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-16 h-8 bg-gray-100 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{timeSlot}</span>
                  </div>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                
                <div className="ml-20 space-y-3">
                  {groupedDoses[timeSlot].map(dose => (
                    <div
                      key={dose.id}
                      className={`
                        border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer
                        border-l-4 ${getPriorityColor(dose.priority)}
                      `}
                      onClick={() => onDoseClick && onDoseClick(dose)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 pt-1">
                              {getStatusIcon(dose.status)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="text-sm font-semibold text-gray-900 truncate">
                                  {dose.medicationName}
                                </h4>
                                <span className={`
                                  inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border
                                  ${getStatusColor(dose.status)}
                                `}>
                                  {dose.status}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                <div className="flex items-center space-x-1">
                                  <User className="w-3 h-3" />
                                  <span>{dose.studentName}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Pill className="w-3 h-3" />
                                  <span>{dose.dosage}</span>
                                </div>
                                <span className="capitalize">{dose.route}</span>
                              </div>
                              
                              {dose.notes && (
                                <p className="text-sm text-gray-600 mt-2">{dose.notes}</p>
                              )}
                              
                              {dose.administeredBy && dose.administeredAt && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Administered by {dose.administeredBy} at {formatTime(dose.administeredAt)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        {dose.status === 'pending' && (
                          <div className="flex items-center space-x-2 ml-4">
                            {onMarkMissed && (
                              <button
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  onMarkMissed(dose);
                                }}
                                className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded border border-red-300 transition-colors"
                              >
                                Mark Missed
                              </button>
                            )}
                            {onAdministerDose && (
                              <button
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  onAdministerDose(dose);
                                }}
                                className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                              >
                                Administer
                              </button>
                            )}
                          </div>
                        )}
                        
                        {dose.status === 'overdue' && onAdministerDose && (
                          <div className="ml-4">
                            <button
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                onAdministerDose(dose);
                              }}
                              className="px-3 py-1 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded transition-colors"
                            >
                              Administer Late
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredDoses.length > 0 && (
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {filteredDoses.filter(d => d.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {filteredDoses.filter(d => d.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {filteredDoses.filter(d => d.status === 'overdue').length}
              </p>
              <p className="text-sm text-gray-600">Overdue</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {filteredDoses.filter(d => d.status === 'missed').length}
              </p>
              <p className="text-sm text-gray-600">Missed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationSchedule;
