/**
 * Admin Audit Logs Server Actions - System audit trail management
 *
 * @module lib/actions/admin.audit-logs
 * @since 2025-11-05
 */

'use server'
import { serverGet, serverPost } from '@/lib/api/nextjs-client'
import { CACHE_TTL } from '@/lib/cache/constants'

export interface AuditLog {
  id: string
  userId: string
  userName: string
  userRole: string
  action: string
  resource: string
  resourceId?: string
  metadata?: Record<string, unknown>
  timestamp: Date
  ipAddress?: string
  userAgent?: string
  sessionId?: string
}

export interface AuditLogFilters {
  action?: string
  resource?: string
  userId?: string
  dateRange?: '24hours' | '7days' | '30days' | '90days'
  startDate?: string
  endDate?: string
}

export interface AuditLogSearchParams {
  search?: string
  action?: string
  resource?: string
  range?: string
  page?: number
  limit?: number
}

/**
 * Get audit logs with filtering and search
 */
export async function getAuditLogs(params: AuditLogSearchParams = {}): Promise<{
  logs: AuditLog[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    const queryParams: Record<string, string | number | boolean> = {}
    if (params.search) queryParams.search = params.search
    if (params.action && params.action !== 'all') queryParams.action = params.action
    if (params.resource && params.resource !== 'all') queryParams.resource = params.resource
    if (params.range) queryParams.range = params.range
    if (params.page) queryParams.page = params.page
    if (params.limit) queryParams.limit = params.limit

    const data = await serverGet<{
      logs: AuditLog[]
      total: number
      page: number
      totalPages: number
    }>(
      `${process.env.API_BASE_URL}/api/audit-logs`,
      queryParams,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: ['admin-audit-logs']
        }
      }
    )

    return {
      logs: data.logs || [],
      total: data.total || 0,
      page: data.page || 1,
      totalPages: data.totalPages || 1,
    }
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return {
      logs: [],
      total: 0,
      page: 1,
      totalPages: 1,
    }
  }
}

/**
 * Get audit log statistics
 */
export async function getAuditLogStats(): Promise<{
  totalLogs: number
  todayLogs: number
  failedActions: number
  topActions: Array<{ action: string; count: number }>
  topUsers: Array<{ userName: string; count: number }>
}> {
  try {
    const data = await serverGet<{
      totalLogs: number
      todayLogs: number
      failedActions: number
      topActions: Array<{ action: string; count: number }>
      topUsers: Array<{ userName: string; count: number }>
    }>(
      `${process.env.API_BASE_URL}/api/audit-logs/stats`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATS,
          tags: ['admin-audit-logs-stats']
        }
      }
    )

    return {
      totalLogs: data.totalLogs || 0,
      todayLogs: data.todayLogs || 0,
      failedActions: data.failedActions || 0,
      topActions: data.topActions || [],
      topUsers: data.topUsers || [],
    }
  } catch (error) {
    console.error('Error fetching audit log stats:', error)
    return {
      totalLogs: 0,
      todayLogs: 0,
      failedActions: 0,
      topActions: [],
      topUsers: [],
    }
  }
}

/**
 * Get audit log details by ID
 */
export async function getAuditLogById(id: string): Promise<AuditLog | null> {
  try {
    const data = await serverGet<{ log: AuditLog }>(
      `${process.env.API_BASE_URL}/api/audit-logs/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`admin-audit-log-${id}`]
        }
      }
    )

    return data.log
  } catch (error) {
    console.error('Error fetching audit log details:', error)
    return null
  }
}

/**
 * Export audit logs
 */
export async function exportAuditLogs(
  filters: AuditLogFilters = {},
  format: 'csv' | 'json' | 'pdf' = 'csv'
): Promise<{ success: boolean; url?: string; message: string }> {
  try {
    const queryParams: Record<string, string | number | boolean> = {}
    if (filters.action) queryParams.action = filters.action
    if (filters.resource) queryParams.resource = filters.resource
    if (filters.userId) queryParams.userId = filters.userId
    if (filters.dateRange) queryParams.range = filters.dateRange
    if (filters.startDate) queryParams.startDate = filters.startDate
    if (filters.endDate) queryParams.endDate = filters.endDate
    queryParams.format = format

    const data = await serverPost<{ downloadUrl: string }>(
      `${process.env.API_BASE_URL}/api/audit-logs/export`,
      queryParams,
      {
        cache: 'no-store'
      }
    )

    return {
      success: true,
      url: data.downloadUrl,
      message: 'Audit logs exported successfully',
    }
  } catch (error) {
    console.error('Error exporting audit logs:', error)
    return {
      success: false,
      message: 'Failed to export audit logs',
    }
  }
}

/**
 * Get available filter options
 */
export async function getAuditLogFilterOptions(): Promise<{
  actions: string[]
  resources: string[]
  users: Array<{ id: string; name: string }>
}> {
  try {
    const data = await serverGet<{
      actions: string[]
      resources: string[]
      users: Array<{ id: string; name: string }>
    }>(
      `${process.env.API_BASE_URL}/api/audit-logs/filters`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: ['admin-audit-logs-filters']
        }
      }
    )

    return {
      actions: data.actions || ['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT'],
      resources: data.resources || ['user', 'student', 'medication', 'appointment'],
      users: data.users || [],
    }
  } catch (error) {
    console.error('Error fetching audit log filter options:', error)
    return {
      actions: ['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT'],
      resources: ['user', 'student', 'medication', 'appointment'],
      users: [],
    }
  }
}

/**
 * Archive old audit logs
 */
export async function archiveAuditLogs(
  olderThanDays: number
): Promise<{ success: boolean; archivedCount: number; message: string }> {
  try {
    const data = await serverPost<{ archivedCount: number }>(
      `${process.env.API_BASE_URL}/api/audit-logs/archive`,
      { olderThanDays },
      {
        cache: 'no-store'
      }
    )

    // Revalidate cache
    await serverPost(
      `${process.env.API_BASE_URL}/api/revalidate`,
      { tag: 'admin-audit-logs' },
      { cache: 'no-store' }
    )

    return {
      success: true,
      archivedCount: data.archivedCount || 0,
      message: `Successfully archived ${data.archivedCount || 0} audit logs`,
    }
  } catch (error) {
    console.error('Error archiving audit logs:', error)
    return {
      success: false,
      archivedCount: 0,
      message: 'Failed to archive audit logs',
    }
  }
}
