'use client';

/**
 * Force dynamic rendering for real-time appointment data
 */
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar,
  Clock,
  Plus,
  Users,
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
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SearchInput } from '@/components/ui/SearchInput';
import { 
  getAppointments,
  type Appointment
} from '@/app/appointments/actions';

// Healthcare appointment types and priorities
type AppointmentStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
type AppointmentPriority = 'low' | 'medium' | 'high' | 'urgent';
type AppointmentType = 'routine_checkup' | 'medication_administration' | 'injury_assessment' | 'health_screening' | 'immunization' | 'counseling' | 'emergency' | 'follow_up' | 'consultation' | 'physical_exam';

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
  appointmentType: AppointmentType;
  scheduledTime: string;
  priority: AppointmentPriority;
  status: AppointmentStatus;
  timeUntil: string;
  reason: string;
}

interface FilterOptions {
  status: string;
  type: string;
  priority: string;
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
    type: 'all',
    priority: 'all'
  });

  const calculateQuickStats = (aptList: Appointment[]) => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = aptList.filter(apt => apt.scheduledDate === today);
    
    const stats: QuickStats = {
      todayTotal: todayAppointments.length,
      todayCompleted: todayAppointments.filter(apt => apt.status === 'completed').length,
      todayPending: todayAppointments.filter(apt => 
        ['scheduled', 'confirmed'].includes(apt.status)
      ).length,
      todayUrgent: todayAppointments.filter(apt => apt.priority === 'urgent').length,
      upcomingWeek: aptList.filter(apt => 
        new Date(apt.scheduledDate) > new Date() && 
        apt.status !== 'cancelled'
      ).length,
      overdueAppointments: aptList.filter(apt => 
        new Date(apt.scheduledDate) < new Date() && 
        ['scheduled', 'confirmed'].includes(apt.status)
      ).length
    };
    
    setQuickStats(stats);
  };

  const calculateTimeUntil = (date: string, time?: string): string => {
    const aptDateTime = new Date(`${date}T${time || '00:00'}`);
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
    const upcoming = aptList
      .filter(apt => 
        new Date(apt.scheduledDate) >= new Date() && 
        ['scheduled', 'confirmed'].includes(apt.status)
      )
      .sort((a, b) => {
        const dateCompare = new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
        if (dateCompare !== 0) return dateCompare;
        return (a.scheduledTime || '').localeCompare(b.scheduledTime || '');
      })
      .slice(0, 5)
      .map(apt => ({
        id: apt.id,
        studentId: apt.studentId,
        studentName: `Student ${apt.studentId.slice(-3)}`, // Mock student name
        appointmentType: apt.appointmentType as AppointmentType,
        scheduledTime: apt.scheduledTime || '00:00',
        priority: apt.priority as AppointmentPriority || 'medium',
        status: apt.status as AppointmentStatus,
        timeUntil: calculateTimeUntil(apt.scheduledDate, apt.scheduledTime),
        reason: apt.reason || 'No reason provided'
      }));
    
    setUpcomingAppointments(upcoming);
  }, []);

  const generateRecentActivity = useCallback((aptList: Appointment[]) => {
    const activities: RecentActivity[] = aptList
      .filter(apt => {
        const aptDate = new Date(apt.updatedAt);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return aptDate > dayAgo;
      })
      .map(apt => ({
        id: `activity-${apt.id}`,
        type: (apt.status === 'completed' ? 'appointment_completed' : 'appointment_created') as RecentActivity['type'],
        appointmentId: apt.id,
        studentName: `Student ${apt.studentId.slice(-3)}`,
        timestamp: apt.updatedAt,
        description: `${apt.status === 'completed' ? 'Completed' : 'Scheduled'} ${apt.appointmentType.replace('_', ' ')} appointment`
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
  }, [selectedDate, generateUpcomingAppointments, generateRecentActivity]);

  // Mock data for development
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: 'apt-001',
        studentId: 'student-001',
        appointmentType: 'routine_checkup',
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: '09:00',
        duration: 30,
        status: 'scheduled',
        priority: 'medium',
        reason: 'Annual physical examination',
        notes: 'Student reports feeling well',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'apt-002',
        studentId: 'student-002',
        appointmentType: 'medication_administration',
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: '10:30',
        duration: 15,
        status: 'confirmed',
        priority: 'high',
        reason: 'Daily insulin administration',
        notes: 'Type 1 diabetes management',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'apt-003',
        studentId: 'student-003',
        appointmentType: 'injury_assessment',
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: '14:00',
        duration: 20,
        status: 'completed',
        priority: 'urgent',
        reason: 'Playground injury assessment',
        notes: 'Minor scrape, treated and bandaged',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    if (appointments.length === 0) {
      setAppointments(mockAppointments);
      calculateQuickStats(mockAppointments);
      generateUpcomingAppointments(mockAppointments);
      generateRecentActivity(mockAppointments);
      setLoading(false);
    }
  }, [appointments.length, generateRecentActivity, generateUpcomingAppointments]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    const icons = {
      scheduled: Clock,
      confirmed: CheckCircle,
      'in-progress': Activity,
      completed: CheckCircle,
      cancelled: XCircle,
      'no-show': AlertCircle,
      rescheduled: RefreshCw
    };
    return icons[status] || Clock;
  };

  const getPriorityColor = (priority: AppointmentPriority) => {
    const colors = {
      low: 'text-gray-500',
      medium: 'text-blue-500',
      high: 'text-orange-500',
      urgent: 'text-red-500'
    };
    return colors[priority] || 'text-gray-500';
  };

  const getTypeIcon = (type: AppointmentType) => {
    const icons = {
      routine_checkup: Stethoscope,
      medication_administration: FileText,
      injury_assessment: AlertCircle,
      health_screening: Activity,
      immunization: Shield,
      counseling: Users,
      emergency: AlertCircle,
      follow_up: RefreshCw,
      consultation: User,
      physical_exam: Thermometer
    };
    return icons[type] || Activity;
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="primary" className="w-full text-sm" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
            
            <Button variant="outline" className="w-full text-sm" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
            
            <Button variant="outline" className="w-full text-sm" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Schedule
            </Button>
          </div>
        </div>
      </Card>

      {/* Today&apos;s Quick Stats */}
      <Card>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Today&apos;s Overview</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{quickStats.todayTotal}</div>
              <div className="text-xs text-blue-800">Total</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{quickStats.todayCompleted}</div>
              <div className="text-xs text-green-800">Completed</div>
            </div>
            
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">{quickStats.todayPending}</div>
              <div className="text-xs text-yellow-800">Pending</div>
            </div>
            
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">{quickStats.todayUrgent}</div>
              <div className="text-xs text-red-800">Urgent</div>
            </div>
          </div>
          
          {quickStats.overdueAppointments > 0 && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-800">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">
                  {quickStats.overdueAppointments} overdue appointment{quickStats.overdueAppointments !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Search */}
      <Card>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Search</h3>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search appointments..."
          />
        </div>
      </Card>

      {/* Filter Controls */}
      <Card>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Filters</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Status
              </label>
              <select
                value={activeFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Filter by appointment status"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Priority
              </label>
              <select
                value={activeFilters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Filter by appointment priority"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Type
              </label>
              <select
                value={activeFilters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Filter by appointment type"
              >
                <option value="all">All Types</option>
                <option value="routine_checkup">Routine Checkup</option>
                <option value="medication_administration">Medication</option>
                <option value="injury_assessment">Injury Assessment</option>
                <option value="immunization">Immunization</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Upcoming Appointments
            <Badge className="ml-2 bg-gray-100 text-gray-600 text-xs">
              {upcomingAppointments.length}
            </Badge>
          </h3>
          
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-4">
              <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => {
                const StatusIcon = getStatusIcon(appointment.status);
                const TypeIcon = getTypeIcon(appointment.appointmentType);
                
                return (
                  <div
                    key={appointment.id}
                    className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.studentName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatTime(appointment.scheduledTime)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-xs font-medium ${getPriorityColor(appointment.priority)}`}>
                          {appointment.timeUntil}
                        </div>
                        <StatusIcon className="h-3 w-3 text-gray-400 ml-auto" />
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 truncate">
                      {appointment.reason}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <Badge className="text-xs bg-gray-100 text-gray-700">
                        {appointment.appointmentType.replace('_', ' ')}
                      </Badge>
                      <ChevronRight className="h-3 w-3 text-gray-400" />
                    </div>
                  </div>
                );
              })}
              
              <Button variant="ghost" className="w-full text-xs" size="sm">
                View All Appointments
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
          
          {recentActivity.length === 0 ? (
            <div className="text-center py-4">
              <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 text-xs"
                >
                  <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                    activity.type === 'appointment_completed' ? 'bg-green-500' :
                    activity.type === 'appointment_cancelled' ? 'bg-red-500' :
                    activity.type === 'appointment_rescheduled' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-900 font-medium truncate">
                      {activity.description}
                    </div>
                    <div className="text-gray-500 truncate">
                      {activity.studentName}
                    </div>
                    <div className="text-gray-400 mt-1">
                      {formatRelativeTime(activity.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {recentActivity.length > 5 && (
                <Button variant="ghost" className="w-full text-xs" size="sm">
                  View All Activity
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Healthcare Alerts */}
      <Card className="border-orange-200 bg-orange-50">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-4 w-4 text-orange-600" />
            <h3 className="text-sm font-semibold text-orange-900">Healthcare Alerts</h3>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 p-2 bg-white rounded border border-orange-200">
              <AlertCircle className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-orange-900">
                  3 students require immunization follow-up
                </div>
                <div className="text-orange-700 mt-1">
                  Due within next 7 days
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-2 p-2 bg-white rounded border border-orange-200">
              <Thermometer className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-orange-900">
                  Seasonal health screening reminder
                </div>
                <div className="text-orange-700 mt-1">
                  Monthly screening due for Grade 3-5
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Settings */}
      <Card>
        <div className="p-4">
          <Button variant="ghost" className="w-full text-sm justify-start" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Appointment Settings
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AppointmentsSidebar;