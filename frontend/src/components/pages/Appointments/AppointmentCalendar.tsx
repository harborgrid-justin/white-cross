'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  MoreHorizontal,
  MapPin,
  Video
} from 'lucide-react';
import type { Appointment, AppointmentStatus } from './AppointmentCard';

/**
 * Calendar view types
 */
type CalendarView = 'month' | 'week' | 'day';

/**
 * Calendar cell data
 */
interface CalendarCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  appointments: Appointment[];
}

/**
 * Props for the AppointmentCalendar component
 */
interface AppointmentCalendarProps {
  /** Appointments to display in calendar */
  appointments?: Appointment[];
  /** Default calendar view */
  defaultView?: CalendarView;
  /** Default selected date */
  defaultDate?: Date;
  /** Whether to show filters */
  showFilters?: boolean;
  /** Whether to show toolbar */
  showToolbar?: boolean;
  /** Whether to show appointment count per day */
  showAppointmentCount?: boolean;
  /** Whether appointments are editable */
  editable?: boolean;
  /** Whether to highlight weekends */
  highlightWeekends?: boolean;
  /** Working hours for calendar display */
  workingHours?: { start: string; end: string };
  /** Custom CSS classes */
  className?: string;
  /** Date change handler */
  onDateChange?: (date: Date) => void;
  /** View change handler */
  onViewChange?: (view: CalendarView) => void;
  /** Appointment click handler */
  onAppointmentClick?: (appointment: Appointment) => void;
  /** Create appointment handler */
  onCreateAppointment?: (date: Date, time?: string) => void;
  /** Edit appointment handler */
  onEditAppointment?: (appointment: Appointment) => void;
  /** Delete appointment handler */
  onDeleteAppointment?: (appointmentId: string) => void;
  /** Export calendar handler */
  onExportCalendar?: (format: 'pdf' | 'ical' | 'csv') => void;
  /** Import calendar handler */
  onImportCalendar?: (file: File) => void;
  /** Refresh appointments handler */
  onRefresh?: () => void;
  /** Filter change handler */
  onFilterChange?: (filters: CalendarFilters) => void;
}

/**
 * Calendar filter options
 */
interface CalendarFilters {
  status?: AppointmentStatus[];
  providers?: string[];
  types?: string[];
  search?: string;
}

/**
 * AppointmentCalendar Component
 * 
 * A comprehensive calendar component for viewing and managing appointments
 * with support for different views (month, week, day), filtering, and
 * appointment management features.
 * 
 * @param props - AppointmentCalendar component props
 * @returns JSX element representing the appointment calendar
 */
const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments = [],
  defaultView = 'month',
  defaultDate = new Date(),
  showFilters = true,
  showToolbar = true,
  showAppointmentCount = true,
  editable = true,
  highlightWeekends = true,
  workingHours = { start: '08:00', end: '18:00' },
  className = '',
  onDateChange,
  onViewChange,
  onAppointmentClick,
  onCreateAppointment,
  onEditAppointment,
  onDeleteAppointment,
  onExportCalendar,
  onImportCalendar,
  onRefresh,
  onFilterChange
}) => {
  // State
  const [currentDate, setCurrentDate] = useState<Date>(defaultDate);
  const [currentView, setCurrentView] = useState<CalendarView>(defaultView);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filters, setFilters] = useState<CalendarFilters>({});
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Gets the current month name
   */
  const getCurrentMonthName = (): string => {
    return currentDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  /**
   * Gets the start of the week for a given date
   */
  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  /**
   * Gets calendar cells for month view
   */
  const getMonthCells = useMemo((): CalendarCell[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = getWeekStart(firstDay);
    const cells: CalendarCell[] = [];
    const today = new Date();

    // Generate 42 cells (6 weeks * 7 days)
    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + i);
      
      const dayAppointments = appointments.filter(apt => 
        new Date(apt.dateTime).toDateString() === cellDate.toDateString()
      );

      cells.push({
        date: cellDate,
        isCurrentMonth: cellDate.getMonth() === month,
        isToday: cellDate.toDateString() === today.toDateString(),
        isSelected: selectedDate?.toDateString() === cellDate.toDateString(),
        appointments: dayAppointments
      });
    }

    return cells;
  }, [currentDate, appointments, selectedDate]);

  /**
   * Gets appointments for the current week
   */
  const getWeekAppointments = useMemo(() => {
    const weekStart = getWeekStart(currentDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return appointments.filter(apt => {
      const aptDate = new Date(apt.dateTime);
      return aptDate >= weekStart && aptDate <= weekEnd;
    });
  }, [currentDate, appointments]);

  /**
   * Gets appointments for the current day
   */
  const getDayAppointments = useMemo(() => {
    return appointments.filter(apt => 
      new Date(apt.dateTime).toDateString() === currentDate.toDateString()
    );
  }, [currentDate, appointments]);

  /**
   * Handles navigation (previous/next)
   */
  const handleNavigation = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (currentView) {
      case 'month':
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  }, [currentDate, currentView, onDateChange]);

  /**
   * Handles view change
   */
  const handleViewChange = useCallback((view: CalendarView) => {
    setCurrentView(view);
    onViewChange?.(view);
  }, [onViewChange]);

  /**
   * Handles date selection
   */
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    onDateChange?.(date);
  }, [onDateChange]);

  /**
   * Handles appointment status styling
   */
  const getAppointmentStatusColor = (status: AppointmentStatus): string => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
      confirmed: 'bg-green-100 text-green-700 border-green-200',
      'checked-in': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'in-progress': 'bg-purple-100 text-purple-700 border-purple-200',
      completed: 'bg-gray-100 text-gray-700 border-gray-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
      'no-show': 'bg-orange-100 text-orange-700 border-orange-200',
      rescheduled: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };
    return colors[status] || colors.scheduled;
  };

  /**
   * Renders the calendar toolbar
   */
  const renderToolbar = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleNavigation('prev')}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label="Previous period"
            >
              <ChevronLeft size={20} />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
              {getCurrentMonthName()}
            </h2>
            
            <button
              onClick={() => handleNavigation('next')}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label="Next period"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Today Button */}
          <button
            onClick={() => {
              const today = new Date();
              setCurrentDate(today);
              setSelectedDate(today);
              onDateChange?.(today);
            }}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                     rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500"
          >
            Today
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex rounded-md shadow-sm">
            {(['month', 'week', 'day'] as CalendarView[]).map((view) => (
              <button
                key={view}
                onClick={() => handleViewChange(view)}
                className={`
                  px-4 py-2 text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${view === 'month' ? 'rounded-l-md' : view === 'day' ? 'rounded-r-md' : ''}
                  ${currentView === view
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>

          {/* Filter Button */}
          {showFilters && (
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                aria-label="Filter appointments"
              >
                <Filter size={20} />
              </button>
              
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search appointments..."
                          value={filters.search || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newFilters = { ...filters, search: e.target.value };
                            setFilters(newFilters);
                            onFilterChange?.(newFilters);
                          }}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md 
                                   focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Status
                      </label>
                      <div className="space-y-2">
                        {['scheduled', 'confirmed', 'completed', 'cancelled'].map((status) => (
                          <label key={status} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.status?.includes(status as AppointmentStatus) || false}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const currentStatus = filters.status || [];
                                const newStatus = e.target.checked
                                  ? [...currentStatus, status as AppointmentStatus]
                                  : currentStatus.filter(s => s !== status);
                                const newFilters = { ...filters, status: newStatus };
                                setFilters(newFilters);
                                onFilterChange?.(newFilters);
                              }}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 capitalize">
                              {status.replace('-', ' ')}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={() => {
              setLoading(true);
              onRefresh?.();
              setTimeout(() => setLoading(false), 1000);
            }}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            aria-label="Refresh calendar"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>

          {/* Create Appointment Button */}
          {editable && (
            <button
              onClick={() => onCreateAppointment?.(selectedDate || currentDate)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 
                       border border-transparent rounded-md hover:bg-blue-700 focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-2" />
              New Appointment
            </button>
          )}

          {/* Export/Import Menu */}
          <div className="relative">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label="More options"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders month view
   */
  const renderMonthView = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map((day) => (
            <div key={day} className="p-4 text-sm font-medium text-gray-700 text-center bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {getMonthCells.map((cell, index) => (
            <div
              key={index}
              onClick={() => handleDateSelect(cell.date)}
              className={`
                min-h-[120px] p-2 border-r border-b border-gray-200 cursor-pointer transition-colors
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                ${!cell.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                ${cell.isToday ? 'bg-blue-50' : ''}
                ${cell.isSelected ? 'bg-blue-100 ring-2 ring-blue-500' : ''}
                ${highlightWeekends && (cell.date.getDay() === 0 || cell.date.getDay() === 6) ? 'bg-orange-50' : ''}
              `}
              role="button"
              tabIndex={0}
              aria-label={`${cell.date.toDateString()}, ${cell.appointments.length} appointments`}
            >
              {/* Date Number */}
              <div className="flex items-center justify-between mb-2">
                <span className={`
                  text-sm font-medium
                  ${cell.isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}
                `}>
                  {cell.date.getDate()}
                </span>
                
                {showAppointmentCount && cell.appointments.length > 0 && (
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {cell.appointments.length}
                  </span>
                )}
              </div>

              {/* Appointments */}
              <div className="space-y-1">
                {cell.appointments.slice(0, 3).map((appointment) => (
                  <div
                    key={appointment.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAppointmentClick?.(appointment);
                    }}
                    className={`
                      text-xs p-1 rounded border truncate cursor-pointer hover:shadow-sm
                      ${getAppointmentStatusColor(appointment.status)}
                    `}
                    title={`${appointment.patient.name} - ${appointment.reason}`}
                  >
                    <div className="font-medium truncate">
                      {new Date(appointment.dateTime).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit' 
                      })}
                    </div>
                    <div className="truncate">
                      {appointment.patient.name}
                    </div>
                  </div>
                ))}
                
                {cell.appointments.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{cell.appointments.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renders week view
   */
  const renderWeekView = () => {
    const weekStart = getWeekStart(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    });

    const timeSlots = Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return `${hour}:00`;
    });

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Week Day Headers */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4 text-sm font-medium text-gray-700 bg-gray-50"></div>
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="p-4 text-sm font-medium text-gray-700 text-center bg-gray-50">
              <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className={`
                text-lg mt-1
                ${day.toDateString() === new Date().toDateString() 
                  ? 'bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto' 
                  : ''
                }
              `}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="max-h-96 overflow-y-auto">
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 border-b border-gray-100">
              <div className="p-2 text-xs text-gray-500 bg-gray-50 border-r border-gray-200">
                {time}
              </div>
              {weekDays.map((day) => {
                const dayAppointments = getWeekAppointments.filter(apt => {
                  const aptDate = new Date(apt.dateTime);
                  return aptDate.toDateString() === day.toDateString() &&
                         aptDate.getHours() === parseInt(time.split(':')[0]);
                });

                return (
                  <div
                    key={`${day.toISOString()}-${time}`}
                    className="p-1 border-r border-gray-200 min-h-[60px] cursor-pointer hover:bg-gray-50"
                    onClick={() => onCreateAppointment?.(day, time)}
                  >
                    {dayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAppointmentClick?.(appointment);
                        }}
                        className={`
                          text-xs p-1 rounded border mb-1 cursor-pointer hover:shadow-sm
                          ${getAppointmentStatusColor(appointment.status)}
                        `}
                      >
                        {appointment.patient.name}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renders day view
   */
  const renderDayView = () => {
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return `${hour}:00`;
    });

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Day Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {getDayAppointments.length} appointments scheduled
          </p>
        </div>

        {/* Time Slots */}
        <div className="max-h-96 overflow-y-auto">
          {timeSlots.map((time) => {
            const hourAppointments = getDayAppointments.filter(apt => {
              const aptDate = new Date(apt.dateTime);
              return aptDate.getHours() === parseInt(time.split(':')[0]);
            });

            return (
              <div key={time} className="flex border-b border-gray-100">
                <div className="w-20 p-2 text-xs text-gray-500 bg-gray-50 border-r border-gray-200">
                  {time}
                </div>
                <div 
                  className="flex-1 p-2 min-h-[60px] cursor-pointer hover:bg-gray-50"
                  onClick={() => onCreateAppointment?.(currentDate, time)}
                >
                  {hourAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppointmentClick?.(appointment);
                      }}
                      className={`
                        p-3 rounded border mb-2 cursor-pointer hover:shadow-sm
                        ${getAppointmentStatusColor(appointment.status)}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">
                            {appointment.patient.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {appointment.reason}
                          </div>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            {appointment.location.isVirtual ? (
                              <><Video size={12} className="mr-1" />Virtual</>
                            ) : (
                              <><MapPin size={12} className="mr-1" />{appointment.location.room}</>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {editable && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditAppointment?.(appointment);
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600"
                                aria-label="Edit appointment"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteAppointment?.(appointment.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-600"
                                aria-label="Delete appointment"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * Renders the current view based on currentView state
   */
  const renderCurrentView = () => {
    switch (currentView) {
      case 'week':
        return renderWeekView();
      case 'day':
        return renderDayView();
      default:
        return renderMonthView();
    }
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 ${className}`}>
      {/* Toolbar */}
      {showToolbar && renderToolbar()}

      {/* Calendar View */}
      {renderCurrentView()}

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
          <span>Scheduled</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
          <span>Confirmed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
