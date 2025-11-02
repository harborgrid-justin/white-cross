/**
 * @fileoverview Admin Content Component - Healthcare system administration dashboard
 * @module app/(dashboard)/admin/_components/AdminContent
 * @category Admin - Components
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield,
  Users,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Database,
  Lock,
  UserCheck,
  FileText,
  Monitor,
  RefreshCw,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Eye,
  Bell,
  BarChart3
} from 'lucide-react';

interface AdminContentProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    status?: string;
    role?: string;
    department?: string;
    dateRange?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalStudents: number;
  totalStaff: number;
  systemHealth: number;
  uptime: string;
  activeConnections: number;
  totalSchools: number;
  storageUsed: number;
  storageTotal: number;
  responseTime: number;
  errorRate: number;
}

interface AdminActivity {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';
  ip: string;
  details: string;
}

interface SystemAlert {
  id: string;
  type: 'SECURITY' | 'PERFORMANCE' | 'SYSTEM' | 'USER' | 'DATA';
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  assignedTo?: string;
}

interface UserSummary {
  role: string;
  count: number;
  active: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

// Mock data for comprehensive admin dashboard
const mockSystemStats: SystemStats = {
  totalUsers: 2847,
  activeUsers: 1256,
  totalStudents: 2145,
  totalStaff: 702,
  systemHealth: 97.8,
  uptime: '99.9%',
  activeConnections: 234,
  totalSchools: 12,
  storageUsed: 847.3,
  storageTotal: 2048,
  responseTime: 145,
  errorRate: 0.02
};

const mockAdminActivity: AdminActivity[] = [
  {
    id: '1',
    action: 'User Role Updated',
    user: 'Admin Sarah',
    target: 'John Doe (Nurse)',
    timestamp: '2025-10-31T10:30:00Z',
    status: 'SUCCESS',
    ip: '192.168.1.100',
    details: 'Changed role from Staff to Senior Nurse'
  },
  {
    id: '2',
    action: 'System Backup',
    user: 'System',
    target: 'Database Backup',
    timestamp: '2025-10-31T09:00:00Z',
    status: 'SUCCESS',
    ip: 'localhost',
    details: 'Automated daily backup completed successfully'
  },
  {
    id: '3',
    action: 'Security Alert',
    user: 'Security Monitor',
    target: 'Failed Login Attempts',
    timestamp: '2025-10-31T08:45:00Z',
    status: 'WARNING',
    ip: '203.0.113.45',
    details: 'Multiple failed login attempts detected'
  },
  {
    id: '4',
    action: 'Configuration Change',
    user: 'IT Administrator',
    target: 'HIPAA Settings',
    timestamp: '2025-10-31T08:15:00Z',
    status: 'SUCCESS',
    ip: '192.168.1.105',
    details: 'Updated audit log retention period to 7 years'
  },
  {
    id: '5',
    action: 'User Deactivation',
    user: 'HR Manager',
    target: 'Former Employee',
    timestamp: '2025-10-31T07:30:00Z',
    status: 'SUCCESS',
    ip: '192.168.1.102',
    details: 'Deactivated user account and revoked access'
  }
];

const mockSystemAlerts: SystemAlert[] = [
  {
    id: '1',
    type: 'SECURITY',
    level: 'HIGH',
    title: 'Unusual Login Activity Detected',
    description: 'Multiple login attempts from different geographic locations for admin account',
    timestamp: '2025-10-31T09:15:00Z',
    resolved: false,
    assignedTo: 'Security Team'
  },
  {
    id: '2',
    type: 'PERFORMANCE',
    level: 'MEDIUM',
    title: 'Database Query Performance',
    description: 'Student health records queries showing increased response times',
    timestamp: '2025-10-31T08:30:00Z',
    resolved: false,
    assignedTo: 'IT Operations'
  },
  {
    id: '3',
    type: 'SYSTEM',
    level: 'LOW',
    title: 'Storage Usage Warning',
    description: 'Medical records storage approaching 85% capacity',
    timestamp: '2025-10-31T07:00:00Z',
    resolved: true
  },
  {
    id: '4',
    type: 'USER',
    level: 'MEDIUM',
    title: 'Inactive User Accounts',
    description: '15 user accounts inactive for more than 90 days',
    timestamp: '2025-10-30T16:00:00Z',
    resolved: false,
    assignedTo: 'HR Department'
  }
];

const mockUserSummary: UserSummary[] = [
  {
    role: 'Administrators',
    count: 8,
    active: 7,
    trend: 'stable',
    change: 0
  },
  {
    role: 'Nurses',
    count: 45,
    active: 42,
    trend: 'up',
    change: 3
  },
  {
    role: 'Counselors',
    count: 28,
    active: 25,
    trend: 'down',
    change: -2
  },
  {
    role: 'Teachers',
    count: 234,
    active: 198,
    trend: 'up',
    change: 12
  },
  {
    role: 'Support Staff',
    count: 67,
    active: 58,
    trend: 'stable',
    change: 1
  },
  {
    role: 'IT Staff',
    count: 12,
    active: 11,
    trend: 'stable',
    change: 0
  }
];

// Note: getStatusColor removed as it's not used in current implementation

function getStatusBadgeVariant(status: string): "default" | "secondary" | "success" | "danger" | "warning" | "info" {
  switch (status) {
    case 'SUCCESS': return 'success';
    case 'WARNING': return 'warning';
    case 'ERROR': return 'danger';
    case 'INFO': return 'info';
    default: return 'secondary';
  }
}

// Note: getAlertLevelColor removed as it's not used in current implementation

function getAlertLevelBadgeVariant(level: string): "default" | "secondary" | "success" | "danger" | "warning" | "info" {
  switch (level) {
    case 'CRITICAL': return 'danger';
    case 'HIGH': return 'warning';
    case 'MEDIUM': return 'info';
    case 'LOW': return 'success';
    default: return 'secondary';
  }
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case 'up': return TrendingUp;
    case 'down': return TrendingDown;
    default: return Activity;
  }
}

function getTrendColor(trend: string): string {
  switch (trend) {
    case 'up': return 'text-green-600';
    case 'down': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function AdminContent({ searchParams }: AdminContentProps) {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [adminActivity, setAdminActivity] = useState<AdminActivity[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [userSummary, setUserSummary] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setSystemStats(mockSystemStats);
      setAdminActivity(mockAdminActivity);
      setSystemAlerts(mockSystemAlerts);
      setUserSummary(mockUserSummary);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <div className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!systemStats) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Unable to load admin dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
          <p className="text-gray-600">Healthcare platform management and monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Admin Action
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-2xl font-bold text-gray-900">
                  {systemStats.systemHealth}%
                </p>
                <p className="text-xs text-gray-500">Uptime: {systemStats.uptime}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(systemStats.activeUsers)}
                </p>
                <p className="text-xs text-gray-500">of {formatNumber(systemStats.totalUsers)} total</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Storage Usage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((systemStats.storageUsed / systemStats.storageTotal) * 100)}%
                </p>
                <p className="text-xs text-gray-500">
                  {formatBytes(systemStats.storageUsed * 1024 * 1024 * 1024)} used
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {systemStats.responseTime}ms
                </p>
                <p className="text-xs text-gray-500">Error rate: {systemStats.errorRate}%</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button className="justify-start">
              <UserCheck className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
            <Button variant="outline" className="justify-start">
              <Monitor className="h-4 w-4 mr-2" />
              System Monitor
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Audit Logs
            </Button>
            <Button variant="outline" className="justify-start">
              <Lock className="h-4 w-4 mr-2" />
              Security Center
            </Button>
            <Button variant="outline" className="justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Data Import
            </Button>
            <Button variant="outline" className="justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              System Reports
            </Button>
          </div>
        </div>
      </Card>

      {/* System Alerts and User Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                System Alerts
              </h3>
              <Badge variant="warning" className="text-xs">
                {systemAlerts.filter(alert => !alert.resolved).length} Active
              </Badge>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {systemAlerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${alert.resolved ? 'bg-gray-50' : 'bg-white'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getAlertLevelBadgeVariant(alert.level)} className="text-xs">
                        {alert.level}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {alert.type}
                      </Badge>
                      {alert.resolved && (
                        <Badge variant="success" className="text-xs">
                          Resolved
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(alert.timestamp)}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {alert.description}
                  </p>
                  {alert.assignedTo && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Assigned to: {alert.assignedTo}
                      </span>
                      {!alert.resolved && (
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="outline" className="w-full text-sm">
                View All Alerts
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              User Summary
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {userSummary.map((summary) => {
                const TrendIcon = getTrendIcon(summary.trend);
                return (
                  <div key={summary.role} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{summary.role}</h4>
                      <p className="text-xs text-gray-600">
                        {summary.active} active of {summary.count} total
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{summary.count}</p>
                        {summary.change !== 0 && (
                          <div className={`flex items-center gap-1 ${getTrendColor(summary.trend)}`}>
                            <TrendIcon className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {Math.abs(summary.change)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="outline" className="w-full text-sm">
                Manage Users
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Admin Activity */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-green-600" />
              Recent Admin Activity
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {adminActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'SUCCESS' ? 'bg-green-100' :
                    activity.status === 'WARNING' ? 'bg-yellow-100' :
                    activity.status === 'ERROR' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    {activity.status === 'SUCCESS' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {activity.status === 'WARNING' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                    {activity.status === 'ERROR' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    {activity.status === 'INFO' && <Activity className="h-4 w-4 text-blue-600" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {activity.user} → {activity.target}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.details}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusBadgeVariant(activity.status)} className="text-xs mb-1">
                    {activity.status}
                  </Badge>
                  <p className="text-xs text-gray-500">
                    {formatDate(activity.timestamp)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {activity.ip}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {adminActivity.length} of {adminActivity.length} activities
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Audit Log
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}



