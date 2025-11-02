'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Filter,
  List,
  Grid3x3,
  Edit,
  Eye,
  XCircle,
  CalendarDays,
  Timer,
  Users,
  Activity,
  TrendingUp,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import {
  getAppointments,
  deleteAppointment
} from '@/lib/actions/appointments.actions';
import type { Appointment } from '@/types/domain/appointments';
import { AppointmentStatus, AppointmentType } from '@/types/domain/appointments';

type ViewMode = 'calendar' | 'list' | 'agenda';

interface AppointmentStats {
  totalAppointments: number;
  todayAppointments: number;
  upcomingAppointments: number;
  completedToday: number;
  cancelledToday: number;
  noShowRate: number;
  averageDuration: number;
}

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

  const { confirm, ConfirmDialog } = useConfirmDialog();
  const { toast } = useToast();

  // Load appointments
  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const filters: Record<string, any> = {
          dateFrom: selectedDate.toISOString().split('T')[0],
          dateTo: new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        
        if (statusFilter !== 'all') filters.status = statusFilter;
        if (typeFilter !== 'all') filters.type = typeFilter;
        
        const result = await getAppointments(filters);
        setAppointments(result.appointments);
      } catch (error) {
        console.error('Failed to load appointments:', error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [selectedDate, statusFilter, typeFilter]);

  // Set initial appointments
  useEffect(() => {
    if (initialAppointments.length > 0 && appointments.length === 0) {
      setAppointments(initialAppointments);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate statistics
  const stats: AppointmentStats = useMemo(() => {
    const appts = Array.isArray(appointments) ? appointments : [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAppts = appts.filter(apt => {
      const aptDate = new Date(apt.scheduledAt);
      return aptDate >= today && aptDate < tomorrow;
    });
    
    return {
      totalAppointments: appts.length,
      todayAppointments: todayAppts.length,
      upcomingAppointments: appts.filter(apt => 
        new Date(apt.scheduledAt) > new Date() && apt.status !== AppointmentStatus.CANCELLED
      ).length,
      completedToday: todayAppts.filter(apt => apt.status === AppointmentStatus.COMPLETED).length,
      cancelledToday: todayAppts.filter(apt => apt.status === AppointmentStatus.CANCELLED).length,
      noShowRate: appts.length > 0 
        ? (appts.filter(apt => apt.status === AppointmentStatus.NO_SHOW).length / appts.length) * 100 
        : 0,
      averageDuration: appts.length > 0 
        ? appts.reduce((sum, apt) => sum + apt.duration, 0) / appts.length 
        : 30,
    };
  }, [appointments]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    let filtered = Array.isArray(appointments) ? [...appointments] : [];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(apt => apt.type === typeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.reason?.toLowerCase().includes(query) ||
        apt.notes?.toLowerCase().includes(query) ||
        apt.studentId?.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => 
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
  }, [appointments, statusFilter, typeFilter, searchQuery]);

  // Get appointments for date
  const getAppointmentsForDate = (date: Date): Appointment[] => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    return filteredAppointments.filter(apt => {
      const aptDate = new Date(apt.scheduledAt);
      return aptDate >= targetDate && aptDate < nextDay;
    });
  };

  // Get week dates
  const getCurrentWeekDates = (): Date[] => {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  // Delete appointment
  const handleCancelAppointment = async (appointmentId: string) => {
    const confirmed = await confirm({
      title: 'Delete Appointment',
      description: 'Are you sure you want to delete this appointment? This action cannot be undone.',
      confirmText: 'Delete Appointment',
      cancelText: 'Keep Appointment',
      variant: 'destructive',
    });

    if (confirmed) {
      startTransition(async () => {
        try {
          const result = await deleteAppointment(appointmentId);
          if (result.success) {
            toast({
              title: 'Appointment deleted',
              description: 'The appointment has been successfully deleted.',
            });
            const updatedResult = await getAppointments();
            setAppointments(updatedResult.appointments);
          } else {
            toast({
              title: 'Error',
              description: result.error || 'Failed to delete appointment.',
              variant: 'destructive',
            });
          }
        } catch (error) {
          console.error('Failed to delete appointment:', error);
          toast({
            title: 'Error',
            description: 'Failed to delete appointment. Please try again.',
            variant: 'destructive',
          });
        }
      });
    }
  };

  // Format functions
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      shortTime: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const variants: Record<AppointmentStatus, 'info' | 'warning' | 'success' | 'error' | 'default'> = {
      [AppointmentStatus.SCHEDULED]: 'info',
      [AppointmentStatus.IN_PROGRESS]: 'warning',
      [AppointmentStatus.COMPLETED]: 'success',
      [AppointmentStatus.CANCELLED]: 'error',
      [AppointmentStatus.NO_SHOW]: 'error',
    };
    return <Badge variant={variants[status]}>{status.replace('_', ' ')}</Badge>;
  };

  const getTypeIcon = (type: AppointmentType) => {
    return <Activity className="h-4 w-4" />;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  if (loading) {
    return (
      <div className="space-y-6">
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
    <>
      <ConfirmDialog />
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Today&apos;s Appointments</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{stats.todayAppointments}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">
                    {stats.completedToday} completed, {stats.cancelledToday} cancelled
                  </p>
                </div>
                <CalendarDays className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Upcoming</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{stats.upcomingAppointments}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Next 7 days</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Average Duration</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">{Math.round(stats.averageDuration)}m</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Per appointment</p>
                </div>
                <Timer className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 flex-shrink-0" />
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">No-Show Rate</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">{stats.noShowRate.toFixed(1)}%</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Last 30 days</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 flex-shrink-0" />
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <div className="p-3 sm:p-4 border-b border-border">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="default" size="sm" className="text-xs sm:text-sm">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Schedule</span>
                    <span className="xs:hidden">New</span>
                  </Button>
                  
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm hidden sm:inline-flex">
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Import
                  </Button>

                  <Button variant="outline" size="sm" className="text-xs sm:text-sm hidden sm:inline-flex">
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                  <div className="flex-1 sm:w-48 lg:w-64">
                    <Input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="h-8 sm:h-9 text-xs sm:text-sm"
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className={showFilters ? 'bg-accent' : ''}
                  >
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                    <span className="hidden sm:inline text-xs sm:text-sm">Filters</span>
                  </Button>

                  <div className="flex rounded-lg border border-border">
                    <button
                      onClick={() => setViewMode('calendar')}
                      className={`p-1.5 sm:p-2 ${
                        viewMode === 'calendar' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                      }`}
                      title="Calendar view"
                    >
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 sm:p-2 border-l border-border ${
                        viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                      }`}
                      title="List view"
                    >
                      <List className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('agenda')}
                      className={`p-1.5 sm:p-2 border-l border-border ${
                        viewMode === 'agenda' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                      }`}
                      title="Agenda view"
                    >
                      <Grid3x3 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="pt-3 sm:pt-4 border-t border-border mt-3 sm:mt-4">
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | 'all')}
                      className="w-full h-8 sm:h-9 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-input rounded-md bg-background"
                    >
                      <option value="all">All Statuses</option>
                      <option value={AppointmentStatus.SCHEDULED}>Scheduled</option>
                      <option value={AppointmentStatus.IN_PROGRESS}>In Progress</option>
                      <option value={AppointmentStatus.COMPLETED}>Completed</option>
                      <option value={AppointmentStatus.CANCELLED}>Cancelled</option>
                      <option value={AppointmentStatus.NO_SHOW}>No Show</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as AppointmentType | 'all')}
                      className="w-full h-8 sm:h-9 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-input rounded-md bg-background"
                    >
                      <option value="all">All Types</option>
                      {Object.values(AppointmentType).map(type => (
                        <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Date Range</label>
                    <input
                      type="date"
                      value={selectedDate.toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      className="w-full h-8 sm:h-9 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-input rounded-md bg-background"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setStatusFilter('all');
                        setTypeFilter('all');
                        setSearchQuery('');
                        setSelectedDate(new Date());
                      }}
                      className="w-full text-xs sm:text-sm"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Main Display */}
        <Card>
          <div className="p-6">
            {viewMode === 'calendar' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Week of {getCurrentWeekDates()[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date())}>
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-50 rounded">{day}</div>
                  ))}
                  
                  {getCurrentWeekDates().map((date, index) => {
                    const dayAppointments = getAppointmentsForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={index}
                        className={`min-h-32 p-2 border rounded-lg ${
                          isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                          {date.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {dayAppointments.slice(0, 3).map((apt) => {
                            const { shortTime } = formatDateTime(apt.scheduledAt);
                            return (
                              <div key={apt.id} className="text-xs p-1 rounded bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200">
                                <div className="font-medium">{shortTime}</div>
                                <div className="truncate">{apt.reason}</div>
                              </div>
                            );
                          })}
                          
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
                  <EmptyState
                    icon={Calendar}
                    title="No appointments found"
                    description="Try adjusting your filters or schedule a new appointment to get started."
                    actionLabel="Schedule Appointment"
                    onAction={() => {}}
                  />
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => {
                      const { date, time } = formatDateTime(appointment.scheduledAt);
                      return (
                        <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <input
                                  type="checkbox"
                                  checked={selectedAppointments.has(appointment.id)}
                                  onChange={(e) => {
                                    const newSelected = new Set(selectedAppointments);
                                    e.target.checked ? newSelected.add(appointment.id) : newSelected.delete(appointment.id);
                                    setSelectedAppointments(newSelected);
                                  }}
                                  className="rounded border-gray-300 text-blue-600"
                                />
                                
                                {getTypeIcon(appointment.type)}
                                
                                <div>
                                  <h3 className="font-semibold text-gray-900">{appointment.reason || 'No reason'}</h3>
                                  <p className="text-sm text-gray-600">Student ID: {appointment.studentId}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Date:</span>
                                  <div className="font-medium">{date}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Time:</span>
                                  <div className="font-medium">{time}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Duration:</span>
                                  <div className="font-medium">{appointment.duration} minutes</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Type:</span>
                                  <div className="font-medium">{appointment.type.replace(/_/g, ' ')}</div>
                                </div>
                              </div>
                              
                              {appointment.notes && (
                                <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                                  <strong>Notes:</strong> {appointment.notes}
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2 mt-3">
                                {getStatusBadge(appointment.status)}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <Button variant="ghost" size="sm" title="View details">
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              <Button variant="ghost" size="sm" title="Edit appointment">
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              <Button variant="ghost" size="sm" onClick={() => handleCancelAppointment(appointment.id)} title="Delete">
                                <XCircle className="h-4 w-4" />
                              </Button>
                              
                              <Button variant="ghost" size="sm" title="More options">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                
                <div className="space-y-2">
                  {Array.from({ length: 10 }, (_, i) => {
                    const hour = 8 + i;
                    const hourStart = new Date(selectedDate);
                    hourStart.setHours(hour, 0, 0, 0);
                    const hourEnd = new Date(selectedDate);
                    hourEnd.setHours(hour + 1, 0, 0, 0);
                    
                    const slotAppointments = getAppointmentsForDate(selectedDate).filter(apt => {
                      const aptDate = new Date(apt.scheduledAt);
                      return aptDate >= hourStart && aptDate < hourEnd;
                    });
                    
                    const { shortTime } = formatDateTime(hourStart.toISOString());
                    
                    return (
                      <div key={hour} className="flex border-b border-gray-100 py-3">
                        <div className="w-20 text-sm font-medium text-gray-600">{shortTime}</div>
                        
                        <div className="flex-1">
                          {slotAppointments.length === 0 ? (
                            <div className="text-gray-400 text-sm italic">No appointments</div>
                          ) : (
                            <div className="space-y-2">
                              {slotAppointments.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <div className="flex items-center gap-3">
                                    {getTypeIcon(apt.type)}
                                    <div>
                                      <div className="font-medium text-gray-900">{apt.reason}</div>
                                      <div className="text-sm text-gray-600">Student: {apt.studentId} • {apt.duration} minutes</div>
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
    </>
  );
};

export default AppointmentsContent;
