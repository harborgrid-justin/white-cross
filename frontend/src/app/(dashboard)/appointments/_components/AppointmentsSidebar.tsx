'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar,
  Clock,
  Plus,
  Activity,
  AlertCircle,
  Bell,
  CheckCircle,
  XCircle,
  Stethoscope,
  Shield,
  FileText,
  User,
  RefreshCw,
  Download,
  Settings,
  ChevronRight,
  Thermometer
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  getAppointments
} from '@/lib/actions/appointments.actions';
import { 
  Appointment, 
  AppointmentStatus, 
  AppointmentType 
} from '@/types/domain/appointments';

interface QuickStats {
  todayTotal: number;
  todayCompleted: number;
  todayPending: number;
  todayUrgent: number;
  upcomingWeek: number;
  overdueAppointments: number;
}

interface RecentActivity {
  id: string;
  type: 'appointment_created' | 'appointment_completed' | 'appointment_cancelled' | 'appointment_rescheduled';
  appointmentId: string;
  studentName?: string;
  timestamp: string;
  description: string;
}

interface UpcomingAppointment {
  id: string;
  studentId: string;
  studentName?: string;
  type: AppointmentType;
  scheduledAt: string;
  status: AppointmentStatus;
  timeUntil: string;
  reason: string;
}

interface FilterOptions {
  status: string;
  type: string;
}

interface AppointmentsSidebarProps {
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  onFilterChange?: (filters: FilterOptions) => void;
  className?: string;
}

const AppointmentsSidebar: React.FC<AppointmentsSidebarProps> = ({
  selectedDate = new Date(),
  onFilterChange,
  className = ''
}) => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStats>({
    todayTotal: 0,
    todayCompleted: 0,
    todayPending: 0,
    todayUrgent: 0,
    upcomingWeek: 0,
    overdueAppointments: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
    type: 'all'
  });

  const calculateQuickStats = (aptList: Appointment[]) => {
    const appts = Array.isArray(aptList) ? aptList : [];
    const today = new Date().toISOString().split('T')[0];
    
    // Filter today's appointments by parsing scheduledAt ISO datetime
    const todayAppointments = appts.filter(apt => {
      if (!apt?.scheduledAt) return false;
      const aptDate = apt.scheduledAt.split('T')[0];
      return aptDate === today;
    });
    
    const stats: QuickStats = {
      todayTotal: todayAppointments.length,
      todayCompleted: todayAppointments.filter(apt => 
        apt?.status === AppointmentStatus.COMPLETED
      ).length,
      todayPending: todayAppointments.filter(apt => 
        apt?.status === AppointmentStatus.SCHEDULED
      ).length,
      todayUrgent: todayAppointments.filter(apt => 
        apt?.type === AppointmentType.EMERGENCY
      ).length,
      upcomingWeek: appts.filter(apt => 
        apt?.scheduledAt && 
        new Date(apt.scheduledAt) > new Date() && 
        apt?.status !== AppointmentStatus.CANCELLED
      ).length,
      overdueAppointments: appts.filter(apt => 
        apt?.scheduledAt && 
        new Date(apt.scheduledAt) < new Date() && 
        apt?.status === AppointmentStatus.SCHEDULED
      ).length
    };
    
    setQuickStats(stats);
  };

  const calculateTimeUntil = (scheduledAt: string): string => {
    const aptDateTime = new Date(scheduledAt);
    const now = new Date();
    const diffMs = aptDateTime.getTime() - now.getTime();
    
    if (diffMs < 0) return 'Overdue';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours < 1) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h ${diffMins}m`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d`;
    }
  };

  const generateUpcomingAppointments = useCallback((aptList: Appointment[]) => {
    const appts = Array.isArray(aptList) ? aptList : [];
    const upcoming = appts
      .filter(apt => 
        apt?.scheduledAt && 
        new Date(apt.scheduledAt) >= new Date() && 
        apt?.status === AppointmentStatus.SCHEDULED
      )
      .sort((a, b) => {
        return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
      })
      .slice(0, 5)
      .map(apt => ({
        id: apt.id,
        studentId: apt.studentId,
        studentName: `Student ${apt.studentId.slice(-3)}`,
        type: apt.type,
        scheduledAt: apt.scheduledAt,
        status: apt.status,
        timeUntil: calculateTimeUntil(apt.scheduledAt),
        reason: apt.reason || 'No reason provided'
      }));
    
    setUpcomingAppointments(upcoming);
  }, []);

  const generateRecentActivity = useCallback((aptList: Appointment[]) => {
    const appts = Array.isArray(aptList) ? aptList : [];
    const activities: RecentActivity[] = appts
      .filter(apt => {
        if (!apt?.updatedAt) return false;
        const aptDate = new Date(apt.updatedAt);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return aptDate > dayAgo;
      })
      .map(apt => ({
        id: `activity-${apt.id}`,
        type: (apt.status === AppointmentStatus.COMPLETED ? 'appointment_completed' : 'appointment_created') as RecentActivity['type'],
        appointmentId: apt.id,
        studentName: `Student ${apt.studentId.slice(-3)}`,
        timestamp: apt.updatedAt,
        description: `${apt.status === AppointmentStatus.COMPLETED ? 'Completed' : 'Scheduled'} ${formatAppointmentType(apt.type)} appointment`
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);
    
    setRecentActivity(activities);
  }, []);

  // Load appointments and calculate stats
  useEffect(() => {
    const loadAppointmentData = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const result = await getAppointments({
          dateFrom: today,
          dateTo: nextWeek
        });
        
        setAppointments(result.appointments);
        calculateQuickStats(result.appointments);
        generateUpcomingAppointments(result.appointments);
        generateRecentActivity(result.appointments);
      } catch (error) {
        console.error('Failed to load appointment data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointmentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    const icons = {
      [AppointmentStatus.SCHEDULED]: Clock,
      [AppointmentStatus.IN_PROGRESS]: Activity,
      [AppointmentStatus.COMPLETED]: CheckCircle,
      [AppointmentStatus.CANCELLED]: XCircle,
      [AppointmentStatus.NO_SHOW]: AlertCircle
    };
    return icons[status] || Clock;
  };

  const getTypeIcon = (type: AppointmentType) => {
    const icons = {
      [AppointmentType.ROUTINE_CHECKUP]: Stethoscope,
      [AppointmentType.MEDICATION_ADMINISTRATION]: FileText,
      [AppointmentType.INJURY_ASSESSMENT]: AlertCircle,
      [AppointmentType.ILLNESS_EVALUATION]: Activity,
      [AppointmentType.SCREENING]: Shield,
      [AppointmentType.FOLLOW_UP]: RefreshCw,
      [AppointmentType.EMERGENCY]: AlertCircle
    };
    return icons[type] || Activity;
  };

  const formatAppointmentType = (type: AppointmentType): string => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTime = (scheduledAt: string): string => {
    const date = new Date(scheduledAt);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHour}:${displayMinutes} ${ampm}`;
  };

  const formatRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return time.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card>
          <div className="p-4 animate-pulse">
            <div className="h-5 bg-gray-200 rounded mb-3"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 animate-pulse">
            <div className="h-5 bg-gray-200 rounded mb-3"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quick Actions */}
      <Card>
        <div className="p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="default" className="w-full text-xs sm:text-sm" size="sm">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              <span className="hidden xs:inline">Schedule Appointment</span>
              <span className="xs:hidden">Schedule</span>
            </Button>
            
            <Button variant="outline" className="w-full text-xs sm:text-sm" size="sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              <span className="hidden xs:inline">View Calendar</span>
              <span className="xs:hidden">Calendar</span>
            </Button>
            
            <Button variant="outline" className="w-full text-xs sm:text-sm" size="sm">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              <span className="hidden xs:inline">Export Schedule</span>
              <span className="xs:hidden">Export</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Today's Quick Stats */}
      <Card>
        <div className="p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">Today&apos;s Overview</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="text-center p-2 sm:p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">{quickStats.todayTotal}</div>
              <div className="text-[10px] sm:text-xs text-blue-800 dark:text-blue-300">Total</div>
            </div>
            
            <div className="text-center p-2 sm:p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">{quickStats.todayCompleted}</div>
              <div className="text-[10px] sm:text-xs text-green-800 dark:text-green-300">Completed</div>
            </div>
            
            <div className="text-center p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <div className="text-base sm:text-lg font-bold text-yellow-600 dark:text-yellow-400">{quickStats.todayPending}</div>
              <div className="text-[10px] sm:text-xs text-yellow-800 dark:text-yellow-300">Pending</div>
            </div>
            
            <div className="text-center p-2 sm:p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400">{quickStats.todayUrgent}</div>
              <div className="text-[10px] sm:text-xs text-red-800 dark:text-red-300">Urgent</div>
            </div>
          </div>
          
          {quickStats.overdueAppointments > 0 && (
            <div className="mt-2 sm:mt-3 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center text-red-800 dark:text-red-300">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">
                  {quickStats.overdueAppointments} overdue appointment{quickStats.overdueAppointments !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Search */}
      <Card>
        <div className="p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">Quick Search</h3>
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="h-8 sm:h-9 text-xs sm:text-sm"
          />
        </div>
      </Card>

      {/* Filter Controls */}
      <Card>
        <div className="p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">Filters</h3>
          <div className="space-y-2 sm:space-y-3">
            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-muted-foreground mb-1">
                Status
              </label>
              <select
                value={activeFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full h-8 sm:h-9 px-2 py-1 text-xs sm:text-sm border border-input rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                aria-label="Filter by appointment status"
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
              <label className="block text-[10px] sm:text-xs font-medium text-muted-foreground mb-1">
                Type
              </label>
              <select
                value={activeFilters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full h-8 sm:h-9 px-2 py-1 text-xs sm:text-sm border border-input rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                aria-label="Filter by appointment type"
              >
                <option value="all">All Types</option>
                <option value={AppointmentType.ROUTINE_CHECKUP}>Routine Checkup</option>
                <option value={AppointmentType.MEDICATION_ADMINISTRATION}>Medication</option>
                <option value={AppointmentType.INJURY_ASSESSMENT}>Injury Assessment</option>
                <option value={AppointmentType.ILLNESS_EVALUATION}>Illness Evaluation</option>
                <option value={AppointmentType.SCREENING}>Screening</option>
                <option value={AppointmentType.FOLLOW_UP}>Follow Up</option>
                <option value={AppointmentType.EMERGENCY}>Emergency</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <div className="p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3 flex items-center">
            <span>Upcoming Appointments</span>
            <Badge variant="secondary" className="ml-2 text-[10px] sm:text-xs">
              {upcomingAppointments.length}
            </Badge>
          </h3>
          
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-3 sm:py-4">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {upcomingAppointments.map((appointment) => {
                const StatusIcon = getStatusIcon(appointment.status);
                const TypeIcon = getTypeIcon(appointment.type);
                const isEmergency = appointment.type === AppointmentType.EMERGENCY;
                
                return (
                  <div
                    key={appointment.id}
                    className="p-2 sm:p-3 border border-border rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                        <TypeIcon className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 ${isEmergency ? 'text-red-500' : 'text-muted-foreground'}`} />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-medium text-foreground truncate">
                            {appointment.studentName}
                          </div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground">
                            {formatTime(appointment.scheduledAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className={`text-[10px] sm:text-xs font-medium ${isEmergency ? 'text-red-500' : 'text-blue-500'}`}>
                          {appointment.timeUntil}
                        </div>
                        <StatusIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground ml-auto" />
                      </div>
                    </div>
                    
                    <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                      {appointment.reason}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1.5 sm:mt-2">
                      <Badge variant={isEmergency ? 'error' : 'secondary'} className="text-[10px] sm:text-xs">
                        {formatAppointmentType(appointment.type)}
                      </Badge>
                      <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
              
              <Button variant="ghost" className="w-full text-[10px] sm:text-xs" size="sm">
                <span>View All Appointments</span>
                <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">Recent Activity</h3>
          
          {recentActivity.length === 0 ? (
            <div className="text-center py-3 sm:py-4">
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {recentActivity.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-2 sm:gap-3 text-[10px] sm:text-xs"
                >
                  <div className={`mt-0.5 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full flex-shrink-0 ${
                    activity.type === 'appointment_completed' ? 'bg-green-500' :
                    activity.type === 'appointment_cancelled' ? 'bg-red-500' :
                    activity.type === 'appointment_rescheduled' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground font-medium truncate">
                      {activity.description}
                    </div>
                    <div className="text-muted-foreground truncate">
                      {activity.studentName}
                    </div>
                    <div className="text-muted-foreground/70 mt-0.5 sm:mt-1">
                      {formatRelativeTime(activity.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {recentActivity.length > 5 && (
                <Button variant="ghost" className="w-full text-[10px] sm:text-xs" size="sm">
                  <span>View All Activity</span>
                  <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-1" />
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Healthcare Alerts */}
      <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
        <div className="p-3 sm:p-4">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <h3 className="text-xs sm:text-sm font-semibold text-orange-900 dark:text-orange-200">Healthcare Alerts</h3>
          </div>
          
          <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
            <div className="flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white dark:bg-background rounded border border-orange-200 dark:border-orange-800">
              <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-orange-900 dark:text-orange-200">
                  3 students require immunization follow-up
                </div>
                <div className="text-orange-700 dark:text-orange-300 mt-0.5 sm:mt-1">
                  Due within next 7 days
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white dark:bg-background rounded border border-orange-200 dark:border-orange-800">
              <Thermometer className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-orange-900 dark:text-orange-200">
                  Seasonal health screening reminder
                </div>
                <div className="text-orange-700 dark:text-orange-300 mt-0.5 sm:mt-1">
                  Monthly screening due for Grade 3-5
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Settings */}
      <Card>
        <div className="p-3 sm:p-4">
          <Button variant="ghost" className="w-full text-xs sm:text-sm justify-start" size="sm">
            <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            <span>Appointment Settings</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AppointmentsSidebar;
