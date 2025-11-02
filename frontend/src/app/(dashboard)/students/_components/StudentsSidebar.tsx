/**
 * @fileoverview Students Sidebar Component - Modern shadcn/ui implementation
 * @module app/(dashboard)/students/_components/StudentsSidebar
 * @category Students - Components
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
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
  CheckCircle,
  TrendingUp
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
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-8" />
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Unable to load statistics</p>
        </CardContent>
      </Card>
    );
  }

  const attendanceRate = ((stats.presentToday / stats.totalStudents) * 100);

  return (
    <ScrollArea className="h-full w-full">
      <div className="space-y-6 p-1">
        {/* Student Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-primary" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalStudents.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{attendanceRate.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Attendance</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Present Today</span>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {stats.presentToday}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Absent Today</span>
                <Badge variant="outline" className="text-red-600 border-red-200">
                  {stats.absentToday}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Health Alerts</span>
                <Badge variant="secondary">
                  {stats.healthAlerts}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Medications Due</span>
                <Badge variant="destructive">
                  {stats.medicationsDue}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="h-5 w-5 text-primary" />
              Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.gradeDistribution.map((grade) => (
              <div key={grade.grade} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{grade.grade} Grade</span>
                  <span className="font-medium">{grade.count}</span>
                </div>
                <Progress 
                  value={(grade.count / stats.totalStudents) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start h-9">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start h-9">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start h-9">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start h-9">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Checkups
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-primary" />
              Upcoming Tasks
              <Badge variant="outline" className="ml-auto">
                {stats.upcomingTasks.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.upcomingTasks.slice(0, 4).map((task) => {
              const IconComponent = getTaskIcon(task.type);
              return (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border">
                  <IconComponent className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-medium truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {task.studentName}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{task.dueTime}</span>
                      <Badge 
                        variant={task.priority === 'HIGH' ? 'destructive' : 'secondary'} 
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recentActivity.slice(0, 4).map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                  <IconComponent className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.studentName}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-5 w-5 text-green-600" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Database</span>
              <Badge variant="outline" className="text-green-600 border-green-200">
                Online
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sync Status</span>
              <Badge variant="outline" className="text-green-600 border-green-200">
                Up to date
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Backup</span>
              <span className="text-sm">2 hours ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}



