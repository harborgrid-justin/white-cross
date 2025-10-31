/**
 * @fileoverview Admin Sidebar Component - Navigation and controls for system administration
 * @module app/(dashboard)/admin/_components/AdminSidebar
 * @category Admin - Components
 */

'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Shield,
  Users,
  Settings,
  Monitor,
  Database,
  Lock,
  UserCheck,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bell,
  BarChart3,
  RefreshCw,
  Download,
  Upload,
  Search,
  Plus,
  Eye,
  Zap,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick
} from 'lucide-react';

interface AdminSidebarProps {
  className?: string;
}

interface AdminModule {
  id: string;
  name: string;
  description: string;
  icon: typeof Shield;
  count?: number;
  status?: 'active' | 'warning' | 'success' | 'error';
  href: string;
}

interface SystemMetric {
  label: string;
  value: string | number;
  status: 'normal' | 'warning' | 'critical';
  icon: typeof Activity;
  color: string;
}

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: typeof Plus;
  href?: string;
  action?: () => void;
}

// Admin modules for healthcare platform
const adminModules: AdminModule[] = [
  {
    id: 'dashboard',
    name: 'Admin Dashboard',
    description: 'System overview and health monitoring',
    icon: Shield,
    count: 4,
    status: 'active',
    href: '/admin'
  },
  {
    id: 'users',
    name: 'User Management',
    description: 'Manage user accounts and permissions',
    icon: Users,
    count: 2847,
    status: 'success',
    href: '/admin/users'
  },
  {
    id: 'settings',
    name: 'System Settings',
    description: 'Configure system preferences',
    icon: Settings,
    count: 12,
    status: 'active',
    href: '/admin/settings'
  },
  {
    id: 'monitoring',
    name: 'System Monitor',
    description: 'Real-time system performance',
    icon: Monitor,
    count: 3,
    status: 'warning',
    href: '/admin/monitoring'
  },
  {
    id: 'security',
    name: 'Security Center',
    description: 'Security policies and audit logs',
    icon: Lock,
    count: 8,
    status: 'success',
    href: '/admin/security'
  },
  {
    id: 'database',
    name: 'Database Admin',
    description: 'Database management and backups',
    icon: Database,
    count: 5,
    status: 'active',
    href: '/admin/database'
  },
  {
    id: 'reports',
    name: 'System Reports',
    description: 'Administrative reporting and analytics',
    icon: BarChart3,
    count: 23,
    status: 'success',
    href: '/admin/reports'
  },
  {
    id: 'logs',
    name: 'Audit Logs',
    description: 'System activity and compliance logs',
    icon: FileText,
    count: 156,
    status: 'active',
    href: '/admin/logs'
  }
];

// System metrics for sidebar
const systemMetrics: SystemMetric[] = [
  {
    label: 'CPU Usage',
    value: '34%',
    status: 'normal',
    icon: Cpu,
    color: 'text-green-600'
  },
  {
    label: 'Memory',
    value: '67%',
    status: 'warning',
    icon: MemoryStick,
    color: 'text-yellow-600'
  },
  {
    label: 'Storage',
    value: '89%',
    status: 'critical',
    icon: HardDrive,
    color: 'text-red-600'
  },
  {
    label: 'Network',
    value: 'Stable',
    status: 'normal',
    icon: Wifi,
    color: 'text-green-600'
  }
];

// Quick actions for admin tasks
const quickActions: QuickAction[] = [
  {
    id: 'create-user',
    label: 'Create User',
    description: 'Add new user account',
    icon: UserCheck,
    href: '/admin/users/create'
  },
  {
    id: 'backup-system',
    label: 'System Backup',
    description: 'Create system backup',
    icon: Download,
    action: () => console.log('Starting backup...')
  },
  {
    id: 'security-scan',
    label: 'Security Scan',
    description: 'Run security audit',
    icon: Lock,
    action: () => console.log('Starting security scan...')
  },
  {
    id: 'system-health',
    label: 'Health Check',
    description: 'System health diagnostic',
    icon: Activity,
    action: () => console.log('Running health check...')
  },
  {
    id: 'send-notification',
    label: 'Send Alert',
    description: 'System-wide notification',
    icon: Bell,
    href: '/admin/notifications/create'
  }
];

function getStatusColor(status: string | undefined): string {
  switch (status) {
    case 'success': return 'text-green-600';
    case 'warning': return 'text-yellow-600';
    case 'error': return 'text-red-600';
    case 'active': return 'text-blue-600';
    default: return 'text-gray-600';
  }
}

function getStatusBadgeVariant(status: string | undefined): "default" | "secondary" | "success" | "danger" | "warning" | "info" {
  switch (status) {
    case 'success': return 'success';
    case 'warning': return 'warning';
    case 'error': return 'danger';
    case 'active': return 'info';
    default: return 'secondary';
  }
}

function getMetricStatusColor(status: string): string {
  switch (status) {
    case 'normal': return 'text-green-600';
    case 'warning': return 'text-yellow-600';
    case 'critical': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

export function AdminSidebar({ className = '' }: AdminSidebarProps) {
  const pathname = usePathname();
  // Note: searchParams available for future filtering functionality
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['modules', 'actions', 'metrics', 'alerts'])
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleQuickAction = (action: QuickAction) => {
    if (action.href) {
      // Use window.open or handle navigation appropriately
      console.log('Navigating to:', action.href);
    } else if (action.action) {
      action.action();
    }
  };

  return (
    <div className={`w-80 flex-shrink-0 ${className}`}>
      <div className="space-y-6">
        {/* Admin Modules */}
        <Card>
          <div 
            className="px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between"
            onClick={() => toggleSection('modules')}
          >
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-blue-600" />
              Admin Modules
            </h3>
            <Button variant="ghost" size="sm">
              {expandedSections.has('modules') ? '−' : '+'}
            </Button>
          </div>
          {expandedSections.has('modules') && (
            <div className="p-4">
              <div className="space-y-2">
                {adminModules.map((module) => {
                  const Icon = module.icon;
                  const isActive = pathname === module.href || pathname.startsWith(`${module.href}/`);
                  
                  return (
                    <div
                      key={module.id}
                      onClick={() => console.log('Navigate to:', module.href)}
                      className={`
                        flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all
                        ${isActive 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50 border border-transparent'
                        }
                      `}
                    >
                      <Icon className={`h-5 w-5 mt-0.5 ${isActive ? 'text-blue-600' : getStatusColor(module.status)}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'} truncate`}>
                            {module.name}
                          </p>
                          {module.count !== undefined && (
                            <Badge 
                              variant={isActive ? 'info' : getStatusBadgeVariant(module.status)} 
                              className="text-xs ml-2"
                            >
                              {module.count}
                            </Badge>
                          )}
                        </div>
                        <p className={`text-xs ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>
                          {module.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card>
          <div 
            className="px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between"
            onClick={() => toggleSection('actions')}
          >
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Zap className="h-4 w-4 mr-2 text-purple-600" />
              Quick Actions
            </h3>
            <Button variant="ghost" size="sm">
              {expandedSections.has('actions') ? '−' : '+'}
            </Button>
          </div>
          {expandedSections.has('actions') && (
            <div className="p-4">
              <div className="space-y-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <div
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Icon className="h-4 w-4 text-gray-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {action.label}
                        </p>
                        <p className="text-xs text-gray-600">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        {/* System Metrics */}
        <Card>
          <div 
            className="px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between"
            onClick={() => toggleSection('metrics')}
          >
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Activity className="h-4 w-4 mr-2 text-green-600" />
              System Metrics
            </h3>
            <Button variant="ghost" size="sm">
              {expandedSections.has('metrics') ? '−' : '+'}
            </Button>
          </div>
          {expandedSections.has('metrics') && (
            <div className="p-4">
              <div className="space-y-3">
                {systemMetrics.map((metric, index) => {
                  const Icon = metric.icon;
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${metric.color}`} />
                        <div>
                          <p className="text-xs font-medium text-gray-900">{metric.label}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${getMetricStatusColor(metric.status)}`}>
                          {metric.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Refresh Metrics
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* System Alerts */}
        <Card>
          <div 
            className="px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between"
            onClick={() => toggleSection('alerts')}
          >
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
              System Alerts
            </h3>
            <Badge variant="warning" className="text-xs">
              3
            </Badge>
          </div>
          {expandedSections.has('alerts') && (
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-red-900">High Storage Usage</p>
                    <p className="text-xs text-red-700">89% capacity reached</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-yellow-900">Backup Overdue</p>
                    <p className="text-xs text-yellow-700">Last backup: 25 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-blue-900">System Update Available</p>
                    <p className="text-xs text-blue-700">Security patch ready</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View All Alerts
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-orange-600" />
              Recent Activity
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-green-900">User Created</p>
                  <p className="text-xs text-green-700">New nurse account added</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                <Settings className="h-4 w-4 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-blue-900">Settings Updated</p>
                  <p className="text-xs text-blue-700">HIPAA compliance settings</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                <Database className="h-4 w-4 text-purple-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-purple-900">Backup Completed</p>
                  <p className="text-xs text-purple-700">Daily automated backup</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View Activity Log
              </Button>
            </div>
          </div>
        </Card>

        {/* System Tools */}
        <Card>
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Server className="h-4 w-4 mr-2 text-indigo-600" />
              System Tools
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Download className="h-3 w-3 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Upload className="h-3 w-3 mr-2" />
                Import Data
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Search className="h-3 w-3 mr-2" />
                Advanced Search
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Eye className="h-3 w-3 mr-2" />
                System Logs
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}