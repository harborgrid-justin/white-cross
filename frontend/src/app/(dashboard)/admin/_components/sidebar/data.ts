/**
 * @fileoverview Admin Sidebar Data - Static data for sidebar components
 * @module app/(dashboard)/admin/_components/sidebar/data
 * @category Admin - Data
 */

import {
  Shield,
  Users,
  Settings,
  Monitor,
  Database,
  Lock,
  UserCheck,
  FileText,
  BarChart3,
  Download,
  Upload,
  Search,
  Eye,
  Activity,
  Bell,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { AdminModule, SystemMetric, QuickAction, SystemAlert, ActivityLogEntry, SystemTool } from './types';

/**
 * Admin modules for healthcare platform navigation
 */
export const adminModules: AdminModule[] = [
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

/**
 * System metrics for real-time monitoring
 */
export const systemMetrics: SystemMetric[] = [
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

/**
 * Quick actions for common admin tasks
 */
export const quickActions: QuickAction[] = [
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

/**
 * System alerts and warnings
 */
export const systemAlerts: SystemAlert[] = [
  {
    id: 'storage-warning',
    type: 'error',
    title: 'High Storage Usage',
    description: '89% capacity reached',
    icon: AlertTriangle
  },
  {
    id: 'backup-overdue',
    type: 'warning',
    title: 'Backup Overdue',
    description: 'Last backup: 25 hours ago',
    icon: Clock
  },
  {
    id: 'system-update',
    type: 'info',
    title: 'System Update Available',
    description: 'Security patch ready',
    icon: Bell
  }
];

/**
 * Recent administrative activity
 */
export const recentActivity: ActivityLogEntry[] = [
  {
    id: 'user-created',
    type: 'success',
    title: 'User Created',
    description: 'New nurse account added',
    icon: CheckCircle
  },
  {
    id: 'settings-updated',
    type: 'info',
    title: 'Settings Updated',
    description: 'HIPAA compliance settings',
    icon: Settings
  },
  {
    id: 'backup-completed',
    type: 'warning',
    title: 'Backup Completed',
    description: 'Daily automated backup',
    icon: Database
  }
];

/**
 * System administrative tools
 */
export const systemTools: SystemTool[] = [
  {
    id: 'export-data',
    label: 'Export Data',
    icon: Download,
    action: () => console.log('Export data')
  },
  {
    id: 'import-data',
    label: 'Import Data',
    icon: Upload,
    action: () => console.log('Import data')
  },
  {
    id: 'advanced-search',
    label: 'Advanced Search',
    icon: Search,
    action: () => console.log('Advanced search')
  },
  {
    id: 'system-logs',
    label: 'System Logs',
    icon: Eye,
    action: () => console.log('System logs')
  }
];
