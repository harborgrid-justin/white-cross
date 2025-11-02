/**
 * Admin Type Definitions
 *
 * Comprehensive type definitions for admin features, monitoring,
 * and system management.
 *
 * @module types/admin
 * @since 2025-10-26
 */

// =====================================================
// SYSTEM MONITORING TYPES
// =====================================================

export interface SystemMetrics {
  cpu: {
    usage: number
    cores: number
    temperature?: number
  }
  memory: {
    used: number
    total: number
    percentage: number
  }
  disk: {
    used: number
    total: number
    percentage: number
  }
  network: {
    incoming: number
    outgoing: number
  }
}

export interface ServiceHealth {
  name: string
  status: 'operational' | 'degraded' | 'down'
  responseTime: number
  uptime: number
  lastCheck: Date
  errorRate?: number
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical'
  overall: {
    uptime: number
    lastRestart: Date
    version: string
  }
  services: ServiceHealth[]
  metrics: SystemMetrics
  alerts: SystemAlert[]
}

export interface SystemAlert {
  id: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  service: string
  message: string
  timestamp: Date
  acknowledged: boolean
}

// =====================================================
// PERFORMANCE MONITORING TYPES
// =====================================================

export interface PerformanceMetric {
  timestamp: Date
  endpoint?: string
  method?: string
  duration: number
  statusCode?: number
  memoryUsage: number
  cpuUsage: number
}

export interface APIPerformance {
  endpoint: string
  method: string
  averageResponseTime: number
  p95ResponseTime: number
  p99ResponseTime: number
  requestCount: number
  errorCount: number
  errorRate: number
}

export interface DatabasePerformance {
  queryCount: number
  averageQueryTime: number
  slowQueries: SlowQuery[]
  connectionPoolSize: number
  activeConnections: number
}

export interface SlowQuery {
  query: string
  duration: number
  timestamp: Date
  database: string
}

// =====================================================
// ERROR LOGGING TYPES
// =====================================================

export interface ErrorLog {
  id: string
  level: 'error' | 'warn' | 'fatal'
  message: string
  stack?: string
  context: {
    endpoint?: string
    method?: string
    userId?: string
    sessionId?: string
    [key: string]: any
  }
  timestamp: Date
  resolved: boolean
  assignedTo?: string
}

export interface ErrorStatistics {
  totalErrors: number
  errorsByLevel: Record<string, number>
  errorsByEndpoint: Record<string, number>
  recentErrors: ErrorLog[]
  errorTrend: Array<{ date: Date; count: number }>
}

// =====================================================
// USAGE ANALYTICS TYPES
// =====================================================

export interface UsageStatistics {
  users: {
    total: number
    active: number
    inactive: number
    newThisWeek: number
    newThisMonth: number
  }
  sessions: {
    total: number
    active: number
    averageDuration: number
  }
  features: {
    name: string
    usageCount: number
    uniqueUsers: number
    trend: 'up' | 'down' | 'stable'
  }[]
  apiCalls: {
    total: number
    byEndpoint: Record<string, number>
    trend: Array<{ date: Date; count: number }>
  }
}

export interface ActiveSession {
  id: string
  userId: string
  userName: string
  email: string
  ipAddress: string
  userAgent: string
  startedAt: Date
  lastActivity: Date
  location?: string
}

// =====================================================
// BACKUP & RESTORE TYPES
// =====================================================

export interface Backup {
  id: string
  name: string
  type: 'full' | 'incremental' | 'differential'
  status: 'pending' | 'running' | 'completed' | 'failed'
  size: number
  createdAt: Date
  createdBy: string
  completedAt?: Date
  location: string
  metadata: {
    databaseSize: number
    fileCount: number
    duration?: number
    error?: string
  }
}

export interface BackupSchedule {
  id: string
  name: string
  type: 'full' | 'incremental' | 'differential'
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly'
  time: string
  enabled: boolean
  retention: number // days
  lastRun?: Date
  nextRun: Date
}

export interface RestoreOperation {
  id: string
  backupId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  startedAt: Date
  completedAt?: Date
  restoredBy: string
  targetEnvironment: string
  error?: string
}

// =====================================================
// FEATURE FLAGS TYPES
// =====================================================

export interface FeatureFlag {
  id: string
  name: string
  key: string
  description: string
  enabled: boolean
  type: 'boolean' | 'percentage' | 'targeted'
  rolloutPercentage?: number
  targetUsers?: string[]
  targetRoles?: string[]
  environment: 'development' | 'staging' | 'production' | 'all'
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
  expiresAt?: Date
}

export interface FeatureFlagHistory {
  id: string
  flagId: string
  action: 'created' | 'enabled' | 'disabled' | 'updated' | 'deleted'
  previousValue?: any
  newValue: any
  changedBy: string
  changedAt: Date
  reason?: string
}

// =====================================================
// BULK OPERATIONS TYPES
// =====================================================

export interface BulkOperation {
  id: string
  type: 'import' | 'export' | 'update' | 'delete'
  resource: 'users' | 'students' | 'schools' | 'districts'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'partial'
  totalRecords: number
  processedRecords: number
  successCount: number
  errorCount: number
  startedAt: Date
  completedAt?: Date
  startedBy: string
  file?: {
    name: string
    size: number
    url: string
  }
  errors?: Array<{
    row: number
    field: string
    message: string
  }>
}

export interface BulkImportMapping {
  sourceField: string
  targetField: string
  required: boolean
  transform?: 'uppercase' | 'lowercase' | 'trim' | 'date' | 'phone'
  defaultValue?: string
}

// =====================================================
// TEMPLATE MANAGEMENT TYPES
// =====================================================

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: string[]
  category: 'notification' | 'alert' | 'report' | 'communication'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastUsed?: Date
  usageCount: number
}

export interface SMSTemplate {
  id: string
  name: string
  message: string
  variables: string[]
  category: 'notification' | 'alert' | 'emergency'
  isActive: boolean
  maxLength: number
  createdAt: Date
  updatedAt: Date
  lastUsed?: Date
  usageCount: number
}

export interface NotificationConfig {
  id: string
  eventType: string
  channels: ('email' | 'sms' | 'push' | 'in-app')[]
  recipients: {
    roles?: string[]
    users?: string[]
    dynamic?: string // e.g., "student.parent"
  }
  emailTemplateId?: string
  smsTemplateId?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
}

// =====================================================
// SECURITY & ACCESS TYPES
// =====================================================

export interface PasswordPolicy {
  id: string
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  preventCommonPasswords: boolean
  preventUserInfoInPassword: boolean
  expirationDays: number
  preventReuseCount: number
  maxLoginAttempts: number
  lockoutDuration: number // minutes
  enforceComplexity: boolean
}

export interface IPWhitelistEntry {
  id: string
  ipAddress: string
  description: string
  addedBy: string
  addedAt: Date
  expiresAt?: Date
  isActive: boolean
}

export interface SessionPolicy {
  id: string
  maxSessionDuration: number // minutes
  idleTimeout: number // minutes
  allowConcurrentSessions: boolean
  maxConcurrentSessions?: number
  requireReauthForSensitive: boolean
  sessionRefreshInterval: number // minutes
}

// =====================================================
// LICENSE MANAGEMENT TYPES
// =====================================================

export interface License {
  id: string
  key: string
  type: 'trial' | 'basic' | 'professional' | 'enterprise'
  status: 'active' | 'expired' | 'suspended' | 'revoked'
  features: string[]
  limits: {
    maxUsers: number
    maxStudents: number
    maxSchools: number
    maxStorage: number // GB
  }
  usage: {
    users: number
    students: number
    schools: number
    storage: number
  }
  issuedTo: string
  issuedAt: Date
  expiresAt: Date
  lastValidated: Date
}

// =====================================================
// TRAINING & RESOURCES TYPES
// =====================================================

export interface TrainingResource {
  id: string
  title: string
  description: string
  type: 'video' | 'document' | 'article' | 'tutorial'
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration?: number // minutes
  url: string
  thumbnail?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  viewCount: number
  rating?: number
}

// =====================================================
// MAINTENANCE MODE TYPES
// =====================================================

export interface MaintenanceMode {
  enabled: boolean
  startTime: Date
  endTime?: Date
  message: string
  allowedIPs: string[]
  allowedRoles: string[]
  createdBy: string
}

// =====================================================
// EXPORT TYPES
// =====================================================

export interface ExportRequest {
  id: string
  resource: string
  format: 'csv' | 'json' | 'excel' | 'pdf'
  filters?: Record<string, any>
  columns?: string[]
  status: 'pending' | 'processing' | 'completed' | 'failed'
  fileUrl?: string
  createdAt: Date
  createdBy: string
  completedAt?: Date
  error?: string
}
