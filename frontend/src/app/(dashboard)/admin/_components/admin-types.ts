/**
 * @fileoverview Admin Dashboard Type Definitions
 * @module app/(dashboard)/admin/_components/admin-types
 * @category Admin - Types
 */

/**
 * Props for the main AdminContent component
 */
export interface AdminContentProps {
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

/**
 * System statistics and health metrics
 */
export interface SystemStats {
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

/**
 * Admin activity log entry for audit trail
 */
export interface AdminActivity {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';
  ip: string;
  details: string;
}

/**
 * System alert notification
 */
export interface SystemAlert {
  id: string;
  type: 'SECURITY' | 'PERFORMANCE' | 'SYSTEM' | 'USER' | 'DATA';
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  assignedTo?: string;
}

/**
 * User role summary with trend data
 */
export interface UserSummary {
  role: string;
  count: number;
  active: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

/**
 * Badge variant types for UI components
 */
export type BadgeVariant = "default" | "secondary" | "success" | "danger" | "warning" | "info";

/**
 * Activity status types
 */
export type ActivityStatus = 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';

/**
 * Alert level types
 */
export type AlertLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Trend direction types
 */
export type TrendDirection = 'up' | 'down' | 'stable';
