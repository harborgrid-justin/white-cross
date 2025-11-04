/**
 * @fileoverview Dashboard Type Definitions
 * @module app/dashboard/types
 * @category Dashboard - Types
 * @version 2.0.0
 *
 * Core type definitions for dashboard functionality including:
 * - Dashboard statistics metrics
 * - Health alert structures
 * - Activity tracking types
 * - System status interfaces
 * - Filter configurations
 */

/**
 * Dashboard Statistics Interface
 * Core metrics displayed on the main dashboard
 */
export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  healthAlerts: number;
  pendingMedications: number;
  appointmentsToday: number;
  completedScreenings: number;
  immunizationCompliance: number;
  emergencyContacts: number;
}

/**
 * Health Alert Interface
 * Critical health notifications requiring attention
 */
export interface HealthAlert {
  id: string;
  studentName: string;
  type: 'medication' | 'allergy' | 'condition' | 'emergency' | 'immunization';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved' | 'escalated';
  assignedTo?: string;
  requiresAction?: boolean;
}

/**
 * Recent Activity Interface
 * System activity tracking for dashboard overview
 */
export interface RecentActivity {
  id: string;
  type: 'student_enrollment' | 'health_record_update' | 'medication_administered' |
        'appointment_scheduled' | 'emergency_contact' | 'document_upload' | 'system_alert';
  description: string;
  timestamp: string;
  performedBy: string;
  studentAffected?: string;
  priority: 'normal' | 'high' | 'critical';
  status: 'completed' | 'pending' | 'failed';
}

/**
 * System Status Interface
 * Platform health and performance metrics
 */
export interface SystemStatus {
  apiHealth: 'healthy' | 'degraded' | 'down';
  databaseHealth: 'healthy' | 'slow' | 'down';
  integrationStatus: 'connected' | 'partial' | 'disconnected';
  backupStatus: 'current' | 'stale' | 'failed';
  securityStatus: 'secure' | 'warning' | 'breach';
  lastHealthCheck: string;
  activeUsers: number;
  systemLoad: number;
  uptime: string;
}

/**
 * Dashboard Filters Interface
 * Filter options for dashboard data
 */
export interface DashboardFilters {
  timeframe?: 'today' | 'week' | 'month' | 'quarter';
  alertSeverity?: 'all' | 'critical' | 'high' | 'medium' | 'low';
  activityType?: 'all' | 'health' | 'administrative' | 'emergency';
  studentStatus?: 'all' | 'active' | 'inactive';
}
