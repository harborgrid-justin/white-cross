/**
 * @fileoverview Students Sidebar Component - Sidebar navigation for student management
 * @module app/(dashboard)/students/_components/StudentsSidebar
 * @category Students - Components
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Users,
  GraduationCap,
  UserCheck,
  Heart,
  Pill,
  Calendar,
  Plus,
  FileText,
  BarChart3,
  Clock,
  Activity,
  CheckCircle
} from 'lucide-react';

interface StudentsSidebarProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    grade?: string;
    status?: string;
    hasHealthAlerts?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

interface SidebarStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  healthAlerts: number;
  medicationsDue: number;
  upcomingAppointments: number;
  gradeDistribution: {
    grade: string;
    count: number;
  }[];
  recentActivity: {
    id: string;
    type: 'enrollment' | 'health_update' | 'attendance' | 'medication';
    message: string;
    timestamp: string;
    studentName: string;
  }[];
  upcomingTasks: {
    id: string;
    type: 'medication' | 'appointment' | 'checkup' | 'followup';
    title: string;
    dueTime: string;
    studentName: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
}

// Mock data for demonstration
const mockStats: SidebarStats = {
  totalStudents: 847,
  presentToday: 812,
  absentToday: 35,
  healthAlerts: 23,
  medicationsDue: 8,
  upcomingAppointments: 12,
  gradeDistribution: [
    { grade: '9th', count: 218 },
    { grade: '10th', count: 201 },
    { grade: '11th', count: 195 },
    { grade: '12th', count: 233 }
  ],
  recentActivity: [
    {
      id: '1',
      type: 'enrollment',
      message: 'New student enrolled in 11th grade',
      timestamp: '2 hours ago',
      studentName: 'Emma Johnson'
    },
    {
      id: '2',
      type: 'health_update',
      message: 'Allergy information updated',
      timestamp: '4 hours ago',
      studentName: 'Michael Chen'
    },
    {
      id: '3',
      type: 'medication',
      message: 'Medication administered',
      timestamp: '6 hours ago',
      studentName: 'Sophia Rodriguez'
    },
    {
      id: '4',
      type: 'attendance',
      message: 'Marked present after tardy arrival',
      timestamp: '1 day ago',
      studentName: 'James Wilson'
    }
  ],
  upcomingTasks: [
    {
      id: '1',
      type: 'medication',
      title: 'Insulin administration',
      dueTime: 'In 30 minutes',
      studentName: 'Alex Thompson',
      priority: 'HIGH'
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Nurse visit scheduled',
      dueTime: 'In 2 hours',
      studentName: 'Sarah Davis',
      priority: 'MEDIUM'
    },
    {
      id: '3',
      type: 'followup',
      title: 'Check injury status',
      dueTime: 'Tomorrow',
      studentName: 'David Miller',
      priority: 'MEDIUM'
    },
    {
      id: '4',
      type: 'checkup',
      title: 'Annual health screening',
      dueTime: 'This week',
      studentName: 'Lisa Anderson',
      priority: 'LOW'
    }
  ]
};

function getActivityIcon(type: string) {
  switch (type) {
    case 'enrollment': return Users;
    case 'health_update': return Heart;
    case 'attendance': return UserCheck;
    case 'medication': return Pill;
    default: return Activity;
  }
}

function getTaskIcon(type: string) {
  switch (type) {
    case 'medication': return Pill;
    case 'appointment': return Calendar;
    case 'checkup': return Heart;
    case 'followup': return Clock;
    default: return Activity;
  }
}

function getPriorityBadgeVariant(priority: string) {
  switch (priority) {
    case 'HIGH': return 'danger';
    case 'MEDIUM': return 'warning';
    case 'LOW': return 'info';
    default: return 'secondary';
  }
}

export function StudentsSidebar({ searchParams }: StudentsSidebarProps) {
  const [stats, setStats] = useState<SidebarStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <div className="p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-4">
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-500">Unable to load statistics</p>
          </div>
        </Card>
      </div>
    );
  }

  const attendanceRate = ((stats.presentToday / stats.totalStudents) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Student Overview */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">Student Overview</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Students</span>
              <span className="text-sm font-semibold text-gray-900">{stats.totalStudents.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Present Today</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-green-600">{stats.presentToday}</span>
                <span className="text-xs text-gray-500">({attendanceRate}%)</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Absent Today</span>
              <span className="text-sm font-semibold text-red-600">{stats.absentToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Health Alerts</span>
              <Badge variant="warning" className="text-xs">
                {stats.healthAlerts}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Medications Due</span>
              <Badge variant="danger" className="text-xs">
                {stats.medicationsDue}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Grade Distribution */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="h-4 w-4 text-purple-600" />
            <h3 className="text-sm font-medium text-gray-900">Grade Distribution</h3>
          </div>
          <div className="space-y-2">
            {stats.gradeDistribution.map((grade: { grade: string; count: number }) => (
              <div key={grade.grade} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{grade.grade} Grade</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{grade.count}</span>
                  <div className="w-12 h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 bg-blue-600 rounded-full transition-all duration-300`}
                      data-width={`${(grade.count / stats.totalStudents) * 100}%`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Plus className="h-4 w-4 text-green-600" />
            <h3 className="text-sm font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Add New Student
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Checkups
            </Button>
          </div>
        </div>
      </Card>

      {/* Upcoming Tasks */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-orange-600" />
            <h3 className="text-sm font-medium text-gray-900">Upcoming Tasks</h3>
          </div>
          <div className="space-y-3">
            {stats.upcomingTasks.slice(0, 4).map((task: SidebarStats['upcomingTasks'][number]) => {
              const IconComponent = getTaskIcon(task.type);
              return (
                <div key={task.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                  <IconComponent className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {task.studentName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{task.dueTime}</span>
                      <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {stats.recentActivity.slice(0, 4).map((activity: SidebarStats['recentActivity'][number]) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <IconComponent className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-600">{activity.studentName}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* System Status */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <h3 className="text-sm font-medium text-gray-900">System Status</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Database</span>
              <Badge variant="success" className="text-xs">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Sync Status</span>
              <Badge variant="success" className="text-xs">Up to date</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Last Backup</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}