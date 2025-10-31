'use client';

/**
 * Force dynamic rendering for real-time immunization data
 */
export const dynamic = 'force-dynamic';

import React from 'react';
import { 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Bell,
  Syringe,
  Shield,
  Users,
  Activity,
  Plus,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Immunization types and statuses
type ImmunizationStatus = 'scheduled' | 'administered' | 'declined' | 'deferred' | 'overdue' | 'completed' | 'contraindicated';
type ImmunizationType = 'covid19' | 'flu' | 'hepatitis_b' | 'measles' | 'mumps' | 'rubella' | 'polio' | 'tetanus' | 'diphtheria' | 'pertussis' | 'varicella' | 'meningococcal' | 'hpv' | 'pneumococcal';

interface ImmunizationActivity {
  id: string;
  type: 'scheduled' | 'administered' | 'reminder_sent' | 'declined' | 'rescheduled';
  studentName: string;
  vaccineName: string;
  immunizationType: ImmunizationType;
  timestamp: string;
  description: string;
}

interface UpcomingImmunization {
  id: string;
  studentName: string;
  vaccineName: string;
  immunizationType: ImmunizationType;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: ImmunizationStatus;
  seriesPosition?: string;
}

interface ComplianceAlert {
  id: string;
  type: 'overdue' | 'due_soon' | 'compliance_low' | 'reaction_reported';
  title: string;
  description: string;
  count?: number;
  severity: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
}

interface ImmunizationsSidebarProps {
  className?: string;
}

const ImmunizationsSidebar: React.FC<ImmunizationsSidebarProps> = ({ 
  className = "" 
}) => {
  // Mock data - replace with real API calls or props
  const upcomingImmunizations: UpcomingImmunization[] = React.useMemo(() => {
    const now = new Date();
    return [
      {
        id: 'imm-001',
        studentName: 'Emily Johnson',
        vaccineName: 'COVID-19 Pfizer-BioNTech',
        immunizationType: 'covid19',
        dueDate: now.toISOString().split('T')[0],
        priority: 'high',
        status: 'scheduled',
        seriesPosition: '2 of 2'
      },
      {
        id: 'imm-003',
        studentName: 'Sarah Martinez',
        vaccineName: 'MMR',
        immunizationType: 'measles',
        dueDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'urgent',
        status: 'overdue',
        seriesPosition: '2 of 2'
      },
      {
        id: 'imm-004',
        studentName: 'David Thompson',
        vaccineName: 'Hepatitis B',
        immunizationType: 'hepatitis_b',
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'medium',
        status: 'scheduled',
        seriesPosition: '3 of 3'
      },
      {
        id: 'imm-007',
        studentName: 'Rachel Garcia',
        vaccineName: 'Meningococcal',
        immunizationType: 'meningococcal',
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'medium',
        status: 'scheduled',
        seriesPosition: '1 of 1'
      },
      {
        id: 'imm-008',
        studentName: 'Kevin Park',
        vaccineName: 'Tdap Booster',
        immunizationType: 'tetanus',
        dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'medium',
        status: 'scheduled',
        seriesPosition: '1 of 1'
      }
    ];
  }, []);

  const recentActivity: ImmunizationActivity[] = React.useMemo(() => {
    const now = new Date();
    return [
      {
        id: 'activity-001',
        type: 'administered',
        studentName: 'Michael Chen',
        vaccineName: 'Influenza Quadrivalent',
        immunizationType: 'flu',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        description: 'Successfully administered by Nurse Williams'
      },
      {
        id: 'activity-002',
        type: 'administered',
        studentName: 'Alexander Brown',
        vaccineName: 'Varicella',
        immunizationType: 'varicella',
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        description: 'Second dose completed, mild reaction reported'
      },
      {
        id: 'activity-003',
        type: 'scheduled',
        studentName: 'Emily Johnson',
        vaccineName: 'COVID-19 Pfizer-BioNTech',
        immunizationType: 'covid19',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        description: 'Second dose scheduled for today'
      },
      {
        id: 'activity-004',
        type: 'reminder_sent',
        studentName: 'David Thompson',
        vaccineName: 'Hepatitis B',
        immunizationType: 'hepatitis_b',
        timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
        description: 'Reminder sent to parents for final dose'
      },
      {
        id: 'activity-005',
        type: 'declined',
        studentName: 'Jessica Lee',
        vaccineName: 'Tdap',
        immunizationType: 'tetanus',
        timestamp: new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString(),
        description: 'Religious exemption filed by parents'
      }
    ];
  }, []);

  const complianceAlerts: ComplianceAlert[] = React.useMemo(() => {
    const now = new Date();
    return [
      {
        id: 'alert-001',
        type: 'overdue',
        title: 'Overdue Immunizations',
        description: '3 students have overdue immunizations requiring immediate attention',
        count: 3,
        severity: 'urgent',
        timestamp: now.toISOString()
      },
      {
        id: 'alert-002',
        type: 'due_soon',
        title: 'Due This Week',
        description: '8 immunizations are due within the next 7 days',
        count: 8,
        severity: 'high',
        timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'alert-003',
        type: 'compliance_low',
        title: 'Flu Season Compliance',
        description: 'Only 72% of students have received flu vaccination this season',
        severity: 'medium',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'alert-004',
        type: 'reaction_reported',
        title: 'Adverse Reaction',
        description: 'Mild reaction reported for varicella vaccination',
        severity: 'medium',
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];
  }, []);

  // Calculate quick statistics
  const quickStats = React.useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return {
      dueToday: upcomingImmunizations.filter(imm => imm.dueDate === todayStr).length,
      dueThisWeek: upcomingImmunizations.filter(imm => imm.dueDate <= weekFromNow && imm.status !== 'administered').length,
      overdue: upcomingImmunizations.filter(imm => imm.status === 'overdue').length,
      totalUpcoming: upcomingImmunizations.length
    };
  }, [upcomingImmunizations]);

  // Utility functions
  const formatRelativeTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffInDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays === -1) return 'Yesterday';
    if (diffInDays < -1) return `${Math.abs(diffInDays)} days overdue`;
    if (diffInDays <= 7) return `In ${diffInDays} days`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getPriorityColor = (priority: string): string => {
    const colors = {
      low: 'text-gray-600',
      medium: 'text-blue-600', 
      high: 'text-orange-600',
      urgent: 'text-red-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const getSeverityColor = (severity: string): string => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      scheduled: Calendar,
      administered: CheckCircle,
      reminder_sent: Bell,
      declined: AlertTriangle,
      rescheduled: Clock
    };
    return icons[type as keyof typeof icons] || Activity;
  };

  const getVaccineIcon = (type: ImmunizationType) => {
    const icons = {
      covid19: Shield,
      flu: Activity,
      hepatitis_b: Shield,
      measles: Activity,
      mumps: Activity,
      rubella: Activity,
      polio: Shield,
      tetanus: Shield,
      diphtheria: Shield,
      pertussis: Shield,
      varicella: Activity,
      meningococcal: Shield,
      hpv: Shield,
      pneumococcal: Shield
    };
    return icons[type] || Syringe;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quick Statistics */}
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Quick Stats
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-xl font-bold text-red-600">{quickStats.dueToday}</div>
              <div className="text-xs text-red-600 font-medium">Due Today</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">{quickStats.dueThisWeek}</div>
              <div className="text-xs text-orange-600 font-medium">Due This Week</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-xl font-bold text-red-600">{quickStats.overdue}</div>
              <div className="text-xs text-red-600 font-medium">Overdue</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{quickStats.totalUpcoming}</div>
              <div className="text-xs text-blue-600 font-medium">Upcoming</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Compliance Alerts */}
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
            Compliance Alerts
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {complianceAlerts.map((alert) => (
              <div key={alert.id} className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{alert.title}</h4>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
                {alert.count && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Users className="h-3 w-3 mr-1" />
                    {alert.count} affected
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {formatRelativeTime(alert.timestamp)}
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" size="sm" className="w-full mt-3">
            View All Alerts
          </Button>
        </div>
      </Card>

      {/* Upcoming Immunizations */}
      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Upcoming
            </h3>
            <Button variant="ghost" size="sm" title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {upcomingImmunizations.slice(0, 8).map((immunization) => {
              const VaccineIcon = getVaccineIcon(immunization.immunizationType);
              return (
                <div key={immunization.id} className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <VaccineIcon className="h-4 w-4 mr-2 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{immunization.studentName}</h4>
                        <p className="text-xs text-gray-600">{immunization.vaccineName}</p>
                      </div>
                    </div>
                    <div className={`text-xs font-medium ${getPriorityColor(immunization.priority)}`}>
                      {immunization.priority}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {immunization.seriesPosition && `${immunization.seriesPosition} • `}
                      Due {formatDate(immunization.dueDate)}
                    </span>
                    <Badge className={
                      immunization.status === 'overdue' 
                        ? 'bg-red-100 text-red-800'
                        : immunization.status === 'scheduled' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }>
                      {immunization.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" className="flex-1">
              <Calendar className="h-4 w-4 mr-1" />
              Schedule
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-600" />
            Recent Activity
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              const VaccineIcon = getVaccineIcon(activity.immunizationType);
              
              return (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                  <div className={`p-1.5 rounded-full ${
                    activity.type === 'administered' ? 'bg-green-100' :
                    activity.type === 'scheduled' ? 'bg-blue-100' :
                    activity.type === 'declined' ? 'bg-red-100' :
                    activity.type === 'reminder_sent' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}>
                    <ActivityIcon className={`h-3 w-3 ${
                      activity.type === 'administered' ? 'text-green-600' :
                      activity.type === 'scheduled' ? 'text-blue-600' :
                      activity.type === 'declined' ? 'text-red-600' :
                      activity.type === 'reminder_sent' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <VaccineIcon className="h-3 w-3 mr-1 text-gray-500" />
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.studentName}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{activity.vaccineName}</p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <Button variant="outline" size="sm" className="w-full mt-3">
            View Activity Log
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-purple-600" />
            Quick Actions
          </h3>
          
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Syringe className="h-4 w-4 mr-2" />
              Schedule Immunization
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Send Reminders
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <CheckCircle className="h-4 w-4 mr-2" />
              Record Administration
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Compliance Report
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Update Requirements
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ImmunizationsSidebar;