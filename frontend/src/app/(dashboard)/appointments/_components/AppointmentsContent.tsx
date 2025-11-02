'use client';

/**
 * Force dynamic rendering for real-time appointment data
 */


import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { 
  Calendar,
  Clock,
  Plus,
  Filter,
  List,
  Grid3x3,
  FileText,
  Edit,
  Eye,
  XCircle,
  AlertCircle,
  MessageSquare,
  CalendarDays,
  Timer,
  Users,
  Activity,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/input';
import { 
  getAppointments,
  createAppointment,
  updateAppointment,
  rescheduleAppointment,
  cancelAppointment,
  type Appointment,
  type CreateAppointmentData
} from '@/app/appointments/actions';

// Healthcare appointment types and statuses
type AppointmentType = 'routine_checkup' | 'medication_administration' | 'injury_assessment' | 'health_screening' | 'immunization' | 'counseling' | 'emergency' | 'follow_up' | 'consultation' | 'physical_exam';
type AppointmentStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
type AppointmentPriority = 'low' | 'medium' | 'high' | 'urgent';
type ViewMode = 'calendar' | 'list' | 'agenda';

interface AppointmentStats {
  totalAppointments: number;
  todayAppointments: number;
  upcomingAppointments: number;
  completedToday: number;
  cancelledToday: number;
  noShowRate: number;
  averageDuration: number;
  busyHours: string[];
}

// Remove unused interfaces - Student and TimeSlot will be added when needed

interface AppointmentsContentProps {
  initialAppointments?: Appointment[];
  userRole?: string;
}

const AppointmentsContent: React.FC<AppointmentsContentProps> = ({ 
  initialAppointments = []
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AppointmentType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState<Set<string>>(new Set());
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [, startTransition] = useTransition();

  // Load appointments on component mount and when filters change
  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const filters = {
          ...(statusFilter !== 'all' && { status: statusFilter }),
          ...(typeFilter !== 'all' && { appointmentType: typeFilter }),
          dateFrom: selectedDate.toISOString().split('T')[0],
          dateTo: new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        
        const result = await getAppointments(filters);
        setAppointments(result.appointments);
      } catch (error) {
        console.error('Failed to load appointments:', error);
        // Set empty array on error to avoid infinite loading state
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [selectedDate, statusFilter, typeFilter]);

  // Set initial appointments if provided (from server-side props)
  useEffect(() => {
    if (initialAppointments.length > 0) {
      setAppointments(initialAppointments);
      setLoading(false);
    }
  }, [initialAppointments.length]);

  // Calculate appointment statistics
  const stats: AppointmentStats = useMemo(() => {
    // Defensive check: ensure appointments is an array
    const appts = Array.isArray(appointments) ? appointments : [];
    const today = new Date().toISOString().split('T')[0];
    const todayAppts = appts.filter(apt => apt?.scheduledDate === today);
    
    return {
      totalAppointments: appts.length,
      todayAppointments: todayAppts.length,
      upcomingAppointments: appts.filter(apt => 
        apt && new Date(apt.scheduledDate) > new Date() && apt.status !== 'cancelled'
      ).length,
      completedToday: todayAppts.filter(apt => apt?.status === 'completed').length,
      cancelledToday: todayAppts.filter(apt => apt?.status === 'cancelled').length,
      noShowRate: appts.filter(apt => apt?.status === 'no-show').length / Math.max(appts.length, 1) * 100,
      averageDuration: appts.length > 0 
        ? appts.reduce((sum, apt) => sum + (apt?.duration || 30), 0) / appts.length 
        : 30,
      busyHours: ['09:00', '10:00', '11:00', '14:00', '15:00'] // Mock busy hours
    };
  }, [appointments]);

  // Filter and search appointments
  const filteredAppointments = useMemo(() => {
    // Defensive check: ensure appointments is an array
    const appts = Array.isArray(appointments) ? appointments : [];
    let filtered = appts;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt?.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(apt => apt?.appointmentType === typeFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(apt =>
        apt && (
          apt.reason?.toLowerCase().includes(query) ||
          apt.notes?.toLowerCase().includes(query) ||
          apt.studentId?.toLowerCase().includes(query) ||
          apt.appointmentType?.toLowerCase().includes(query)
        )
      );
    }

    // Sort by date and time
    return filtered.sort((a, b) => {
      if (!a || !b) return 0;
      const dateCompare = new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
      if (dateCompare !== 0) return dateCompare;
      
      const timeA = a.scheduledTime || '00:00';
      const timeB = b.scheduledTime || '00:00';
      return timeA.localeCompare(timeB);
    });
  }, [appointments, statusFilter, typeFilter, searchQuery]);

  // Get appointments for specific date
  const getAppointmentsForDate = (date: Date): Appointment[] => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredAppointments.filter(apt => apt.scheduledDate === dateStr);
  };

  // Get current week dates
  const getCurrentWeekDates = (): Date[] => {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay()); // Start from Sunday
    
    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  // Appointment action handlers using server actions
  const handleCancelAppointment = async (appointmentId: string, reason?: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      startTransition(async () => {
        try {
          const result = await cancelAppointment(appointmentId, reason || 'Cancelled by user');
          if (result.success) {
            const updatedResult = await getAppointments();
            setAppointments(updatedResult.appointments);
          }
        } catch (error) {
          console.error('Failed to cancel appointment:', error);
        }
      });
    }
  };

  // Utility functions
  const getStatusBadge = (status: AppointmentStatus) => {
    const variants = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      'no-show': 'bg-orange-100 text-orange-800',
      rescheduled: 'bg-purple-100 text-purple-800'
    };
    return <Badge className={variants[status]}>{status.replace('-', ' ').replace('_', ' ')}</Badge>;
  };

  const getPriorityBadge = (priority: AppointmentPriority) => {
    const variants = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800', 
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return <Badge className={variants[priority]}>{priority}</Badge>;
  };

  const getTypeIcon = (type: AppointmentType) => {
    const icons = {
      routine_checkup: Activity,
      medication_administration: FileText,
      injury_assessment: AlertCircle,
      health_screening: Eye,
      immunization: Shield,
      counseling: Users,
      emergency: AlertTriangle,
      follow_up: RefreshCw,
      consultation: MessageSquare,
      physical_exam: Activity
    };
    const IconComponent = icons[type as keyof typeof icons] || Activity;
    return <IconComponent className="h-4 w-4" />;
  };

  const formatTime = (time?: string): string => {
    if (!time) return 'No time set';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <div className="p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <div className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Appointment Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today&apos;s Appointments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.todayAppointments}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.completedToday} completed, {stats.cancelledToday} cancelled
                </p>
              </div>
              <CalendarDays className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.upcomingAppointments}</p>
                <p className="text-xs text-gray-500 mt-1">Next 7 days</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Duration</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{Math.round(stats.averageDuration)}m</p>
                <p className="text-xs text-gray-500 mt-1">Per appointment</p>
              </div>
              <Timer className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">No-Show Rate</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.noShowRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Appointment Management Controls */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Primary Actions */}
            <div className="flex items-center gap-3">
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
              
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Schedule
              </Button>

              {selectedAppointments.size > 0 && (
                <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                  <span className="text-sm text-gray-600">
                    {selectedAppointments.size} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Handle bulk reschedule */}}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Handle bulk cancel */}}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-3">
              <div className="w-64">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search appointments, students, or reasons..."
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-gray-100' : ''}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <div className="flex rounded-lg border border-gray-300">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'calendar'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Calendar view"
                  aria-label="Switch to calendar view"
                >
                  <Calendar className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm border-l border-gray-300 ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="List view"
                  aria-label="Switch to list view"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('agenda')}
                  className={`px-3 py-2 text-sm border-l border-gray-300 ${
                    viewMode === 'agenda'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Agenda view"
                  aria-label="Switch to agenda view"
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by status"
                  >
                    <option value="all">All Statuses</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No Show</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as AppointmentType | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by appointment type"
                  >
                    <option value="all">All Types</option>
                    <option value="routine_checkup">Routine Checkup</option>
                    <option value="medication_administration">Medication</option>
                    <option value="injury_assessment">Injury Assessment</option>
                    <option value="health_screening">Health Screening</option>
                    <option value="immunization">Immunization</option>
                    <option value="counseling">Counseling</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Select date range"
                    aria-label="Select date range for appointments"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatusFilter('all');
                      setTypeFilter('all');
                      setSearchQuery('');
                      setSelectedDate(new Date());
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Main Appointment Display */}
      <Card>
        <div className="p-6">
          {viewMode === 'calendar' && (
            <div>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Week of {getCurrentWeekDates()[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeek(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-50 rounded">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {getCurrentWeekDates().map((date, index) => {
                  const dayAppointments = getAppointmentsForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-32 p-2 border rounded-lg ${
                        isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                      } hover:shadow-sm transition-shadow`}
                    >
                      <div className={`text-sm font-medium mb-2 ${
                        isToday ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {date.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 3).map((apt) => (
                          <div
                            key={apt.id}
                            className="text-xs p-1 rounded bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                            onClick={() => {/* Handle appointment click */}}
                          >
                            <div className="font-medium">{formatTime(apt.scheduledTime)}</div>
                            <div className="truncate">{apt.reason}</div>
                          </div>
                        ))}
                        
                        {dayAppointments.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayAppointments.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'list' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Appointments ({filteredAppointments.length})
              </h2>
              
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium mb-2">No appointments found</p>
                  <p className="text-sm text-gray-400 mb-4">
                    Try adjusting your filters or schedule a new appointment.
                  </p>
                  <Button variant="default">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <input
                              type="checkbox"
                              checked={selectedAppointments.has(appointment.id)}
                              onChange={(e) => {
                                const newSelected = new Set(selectedAppointments);
                                if (e.target.checked) {
                                  newSelected.add(appointment.id);
                                } else {
                                  newSelected.delete(appointment.id);
                                }
                                setSelectedAppointments(newSelected);
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              aria-label={`Select appointment: ${appointment.reason}`}
                            />
                            
                            {getTypeIcon(appointment.appointmentType as AppointmentType)}
                            
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {appointment.reason || 'No reason provided'}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Student ID: {appointment.studentId}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Date:</span>
                              <div className="font-medium">{formatDate(appointment.scheduledDate)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Time:</span>
                              <div className="font-medium">{formatTime(appointment.scheduledTime)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Duration:</span>
                              <div className="font-medium">{appointment.duration || 30} minutes</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Type:</span>
                              <div className="font-medium capitalize">
                                {appointment.appointmentType.replace('_', ' ')}
                              </div>
                            </div>
                          </div>
                          
                          {appointment.notes && (
                            <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                              <strong>Notes:</strong> {appointment.notes}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mt-3">
                            {getStatusBadge(appointment.status)}
                            {getPriorityBadge(appointment.priority || 'medium')}
                          </div>
                        </div>
                        
                        {/* Appointment Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="ghost" size="sm" title="View details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Button variant="ghost" size="sm" title="Edit appointment">
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                            title="Cancel appointment"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          
                          <Button variant="ghost" size="sm" title="More options">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {viewMode === 'agenda' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Daily Agenda - {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              
              {/* Time Slots Grid */}
              <div className="space-y-2">
                {Array.from({ length: 10 }, (_, i) => {
                  const hour = 8 + i; // 8 AM to 5 PM
                  const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
                  const slotAppointments = getAppointmentsForDate(selectedDate).filter(
                    apt => apt.scheduledTime?.startsWith(hour.toString().padStart(2, '0'))
                  );
                  
                  return (
                    <div key={timeSlot} className="flex border-b border-gray-100 py-3">
                      <div className="w-20 text-sm font-medium text-gray-600">
                        {formatTime(timeSlot)}
                      </div>
                      
                      <div className="flex-1">
                        {slotAppointments.length === 0 ? (
                          <div className="text-gray-400 text-sm italic">No appointments</div>
                        ) : (
                          <div className="space-y-2">
                            {slotAppointments.map((apt) => (
                              <div
                                key={apt.id}
                                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                              >
                                <div className="flex items-center gap-3">
                                  {getTypeIcon(apt.appointmentType as AppointmentType)}
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {apt.reason}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Student: {apt.studentId} • {apt.duration || 30} minutes
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(apt.status)}
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AppointmentsContent;



