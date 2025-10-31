/**
 * Admin Settings Overview Page - System statistics and health monitoring
 *
 * Server Component that displays system overview, statistics, and health metrics.
 * Provides quick access to key admin functions and system status.
 *
 * @module app/admin/settings/page
 * @since 2025-10-26
 */

import { Metadata } from 'next';
import { Suspense } from 'react'

/**
 * Page metadata for admin settings overview
 */
export const metadata: Metadata = {
  title: 'System Settings | White Cross Admin',
  description: 'Administrative dashboard for system configuration, user management, and health monitoring',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Force dynamic rendering for real-time system statistics
 */
export const dynamic = 'force-dynamic';
import {
  Users,
  Building2,
  School,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react'
import { logAdminAction } from '@/lib/admin-utils'
import { UserRole } from '@/middleware'

// Mock data fetching - replace with actual API calls
async function getSystemStats() {
  // In production, fetch from API
  await new Promise(resolve => setTimeout(resolve, 100))

  return {
    users: {
      total: 156,
      active: 142,
      inactive: 14,
      newThisMonth: 8,
    },
    districts: {
      total: 12,
      active: 11,
    },
    schools: {
      total: 47,
      active: 45,
    },
    systemHealth: {
      status: 'healthy' as const,
      uptime: '99.9%',
      lastBackup: new Date('2025-10-26T02:00:00'),
      databaseSize: '2.4 GB',
    },
    recentActivity: [
      { action: 'User created', user: 'John Doe', timestamp: new Date('2025-10-26T10:30:00') },
      { action: 'District updated', user: 'Jane Smith', timestamp: new Date('2025-10-26T09:15:00') },
      { action: 'Integration enabled', user: 'Admin User', timestamp: new Date('2025-10-26T08:45:00') },
    ],
  }
}

function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue'
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: any
  trend?: { value: string; positive: boolean }
  color?: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`h-4 w-4 ${!trend.positive && 'rotate-180'}`} />
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

function SystemHealthCard({ health }: { health: any }) {
  const statusConfig = {
    healthy: { color: 'green', icon: CheckCircle, text: 'All Systems Operational' },
    warning: { color: 'orange', icon: AlertTriangle, text: 'Minor Issues Detected' },
    error: { color: 'red', icon: AlertTriangle, text: 'Critical Issues' },
  }

  const config = statusConfig[health.status as keyof typeof statusConfig]
  const StatusIcon = config.icon

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>

      <div className={`flex items-center gap-3 p-4 rounded-lg bg-${config.color}-50 mb-4`}>
        <StatusIcon className={`h-6 w-6 text-${config.color}-600`} />
        <span className={`font-medium text-${config.color}-900`}>{config.text}</span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Uptime</span>
          <span className="font-medium text-gray-900">{health.uptime}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Last Backup</span>
          <span className="font-medium text-gray-900">
            {new Date(health.lastBackup).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-600">Database Size</span>
          <span className="font-medium text-gray-900">{health.databaseSize}</span>
        </div>
      </div>
    </div>
  )
}

function RecentActivityCard({ activities }: { activities: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.action}</p>
              <p className="text-sm text-gray-500">{activity.user}</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

async function SettingsOverview() {
  const stats = await getSystemStats()

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.users.total}
          subtitle={`${stats.users.active} active`}
          icon={Users}
          trend={{ value: `+${stats.users.newThisMonth} this month`, positive: true }}
          color="blue"
        />
        <StatsCard
          title="Districts"
          value={stats.districts.total}
          subtitle={`${stats.districts.active} active`}
          icon={Building2}
          color="green"
        />
        <StatsCard
          title="Schools"
          value={stats.schools.total}
          subtitle={`${stats.schools.active} active`}
          icon={School}
          color="purple"
        />
        <StatsCard
          title="System Status"
          value={stats.systemHealth.uptime}
          subtitle="Uptime this month"
          icon={Activity}
          color="orange"
        />
      </div>

      {/* System Health and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealthCard health={stats.systemHealth} />
        <RecentActivityCard activities={stats.recentActivity} />
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }>
        <SettingsOverview />
      </Suspense>
    </div>
  )
}
