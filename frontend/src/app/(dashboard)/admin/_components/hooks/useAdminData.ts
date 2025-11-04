/**
 * @fileoverview Custom hook for fetching and managing admin dashboard data
 * @module app/(dashboard)/admin/_components/hooks/useAdminData
 * @category Admin - Hooks
 */

'use client';

import { useState, useEffect } from 'react';
import type {
  SystemStats,
  AdminActivity,
  SystemAlert,
  UserSummary
} from '../admin-types';

/**
 * Admin dashboard data structure
 */
export interface AdminData {
  systemStats: SystemStats | null;
  adminActivity: AdminActivity[];
  systemAlerts: SystemAlert[];
  userSummary: UserSummary[];
}

/**
 * Hook return type
 */
export interface UseAdminDataReturn {
  /** Admin dashboard data */
  data: AdminData;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Refresh data */
  refresh: () => void;
}

/**
 * Mock data for development
 */
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

/**
 * Custom hook for fetching and managing admin dashboard data
 *
 * Provides:
 * - Automatic data fetching on mount
 * - Loading state management
 * - Error handling
 * - Manual refresh capability
 *
 * Future enhancements:
 * - Replace mock data with real API calls
 * - Add polling/real-time updates
 * - Implement retry logic on failure
 * - Add caching strategy
 *
 * @param searchParams - Optional search parameters for filtering
 * @returns Admin data, loading state, error state, and refresh function
 *
 * @example
 * ```tsx
 * function AdminDashboard() {
 *   const { data, loading, error, refresh } = useAdminData();
 *
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *
 *   return <Dashboard data={data} onRefresh={refresh} />;
 * }
 * ```
 */
export function useAdminData(searchParams?: Record<string, string>): UseAdminDataReturn {
  const [data, setData] = useState<AdminData>({
    systemStats: null,
    adminActivity: [],
    systemAlerts: [],
    userSummary: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // TODO: Replace with real API calls
        // const response = await fetch('/api/admin/dashboard', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(searchParams)
        // });
        // const result = await response.json();

        if (mounted) {
          setData({
            systemStats: mockSystemStats,
            adminActivity: mockAdminActivity,
            systemAlerts: mockSystemAlerts,
            userSummary: mockUserSummary
          });
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch admin data'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [searchParams, refreshTrigger]);

  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    data,
    loading,
    error,
    refresh
  };
}
