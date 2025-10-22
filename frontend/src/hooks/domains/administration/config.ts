import { QueryClient } from '@tanstack/react-query';

// Query Keys for Administration Domain
export const ADMINISTRATION_QUERY_KEYS = {
  // Users
  users: ['administration', 'users'] as const,
  usersList: (filters?: any) => [...ADMINISTRATION_QUERY_KEYS.users, 'list', filters] as const,
  userDetails: (id: string) => [...ADMINISTRATION_QUERY_KEYS.users, 'detail', id] as const,
  userRoles: (userId: string) => [...ADMINISTRATION_QUERY_KEYS.users, userId, 'roles'] as const,
  userPermissions: (userId: string) => [...ADMINISTRATION_QUERY_KEYS.users, userId, 'permissions'] as const,
  
  // Departments
  departments: ['administration', 'departments'] as const,
  departmentsList: (filters?: any) => [...ADMINISTRATION_QUERY_KEYS.departments, 'list', filters] as const,
  departmentDetails: (id: string) => [...ADMINISTRATION_QUERY_KEYS.departments, 'detail', id] as const,
  departmentStaff: (deptId: string) => [...ADMINISTRATION_QUERY_KEYS.departments, deptId, 'staff'] as const,
  
  // Settings
  settings: ['administration', 'settings'] as const,
  settingsList: (category?: string) => [...ADMINISTRATION_QUERY_KEYS.settings, 'list', category] as const,
  settingsDetails: (key: string) => [...ADMINISTRATION_QUERY_KEYS.settings, 'detail', key] as const,
  
  // System Configuration
  systemConfig: ['administration', 'system-config'] as const,
  systemConfigList: () => [...ADMINISTRATION_QUERY_KEYS.systemConfig, 'list'] as const,
  systemConfigDetails: (module: string) => [...ADMINISTRATION_QUERY_KEYS.systemConfig, 'detail', module] as const,
  
  // Audit Logs
  auditLogs: ['administration', 'audit-logs'] as const,
  auditLogsList: (filters?: any) => [...ADMINISTRATION_QUERY_KEYS.auditLogs, 'list', filters] as const,
  auditLogDetails: (id: string) => [...ADMINISTRATION_QUERY_KEYS.auditLogs, 'detail', id] as const,
  
  // Notifications
  notifications: ['administration', 'notifications'] as const,
  notificationsList: (filters?: any) => [...ADMINISTRATION_QUERY_KEYS.notifications, 'list', filters] as const,
  notificationDetails: (id: string) => [...ADMINISTRATION_QUERY_KEYS.notifications, 'detail', id] as const,
  userNotifications: (userId: string) => [...ADMINISTRATION_QUERY_KEYS.notifications, 'user', userId] as const,
} as const;

// Cache Configuration
export const ADMINISTRATION_CACHE_CONFIG = {
  // Standard cache times
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  DEFAULT_CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  
  // Specific configurations
  USERS_STALE_TIME: 15 * 60 * 1000, // 15 minutes
  DEPARTMENTS_STALE_TIME: 30 * 60 * 1000, // 30 minutes
  SETTINGS_STALE_TIME: 60 * 60 * 1000, // 1 hour
  AUDIT_LOGS_STALE_TIME: 2 * 60 * 1000, // 2 minutes (more dynamic)
  NOTIFICATIONS_STALE_TIME: 1 * 60 * 1000, // 1 minute
} as const;

// TypeScript Interfaces
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
  roles: UserRole[];
  permissions: string[];
  departments: string[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

export interface UserProfile {
  phoneNumber?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  preferences: UserPreferences;
  metadata?: Record<string, any>;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  accessibility?: AccessibilitySettings;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  categories: Record<string, boolean>;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  code: string;
  parentId?: string;
  managerId?: string;
  staff: DepartmentStaff[];
  budget?: DepartmentBudget;
  location?: string;
  contactInfo: ContactInfo;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentStaff {
  userId: string;
  user: AdminUser;
  position: string;
  startDate: string;
  endDate?: string;
  isManager: boolean;
}

export interface DepartmentBudget {
  allocated: number;
  spent: number;
  remaining: number;
  fiscalYear: string;
  currency: string;
}

export interface ContactInfo {
  email?: string;
  phoneNumber?: string;
  extension?: string;
  address?: Address;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  category: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  description: string;
  isReadOnly: boolean;
  isPublic: boolean;
  validation?: SettingValidation;
  createdAt: string;
  updatedAt: string;
}

export interface SettingValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  allowedValues?: any[];
}

export interface SystemConfiguration {
  module: string;
  name: string;
  description: string;
  settings: SystemSetting[];
  isEnabled: boolean;
  version: string;
  dependencies?: string[];
  lastUpdated: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  user?: AdminUser;
  action: string;
  resource: string;
  resourceId?: string;
  details: AuditDetails;
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'AUTH' | 'DATA' | 'SYSTEM' | 'SECURITY' | 'ADMIN';
}

export interface AuditDetails {
  before?: any;
  after?: any;
  changes?: Record<string, { from: any; to: any }>;
  metadata?: Record<string, any>;
  reason?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ALERT';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  category: string;
  recipients: NotificationRecipient[];
  channels: NotificationChannel[];
  status: 'DRAFT' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  scheduledAt?: string;
  sentAt?: string;
  expiresAt?: string;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRecipient {
  userId: string;
  user?: AdminUser;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  readAt?: string;
  deliveredAt?: string;
}

export interface NotificationChannel {
  type: 'email' | 'sms' | 'push' | 'in-app';
  config?: Record<string, any>;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
}

export interface NotificationAction {
  id: string;
  label: string;
  type: 'button' | 'link';
  url?: string;
  action?: string;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface UserActivity {
  id: string;
  userId: string;
  sessionId: string;
  action: string;
  resource?: string;
  duration?: number;
  ipAddress: string;
  userAgent: string;
  location?: string;
  timestamp: string;
}

export interface SystemHealth {
  status: 'HEALTHY' | 'WARNING' | 'ERROR' | 'CRITICAL';
  uptime: number;
  version: string;
  environment: string;
  services: ServiceHealth[];
  metrics: SystemMetrics;
  lastChecked: string;
}

export interface ServiceHealth {
  name: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  responseTime?: number;
  errorRate?: number;
  lastChecked: string;
  details?: Record<string, any>;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    bytesIn: number;
    bytesOut: number;
  };
  database: {
    connections: number;
    responseTime: number;
  };
}

// Utility Functions
export const invalidateAdministrationQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['administration'] });
};

export const invalidateUserQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.users });
};

export const invalidateDepartmentQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.departments });
};

export const invalidateSettingsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.settings });
};

export const invalidateAuditLogQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.auditLogs });
};

export const invalidateNotificationQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.notifications });
};
