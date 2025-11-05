/**
 * Admin Audit Logs Server Actions - System audit trail management
 *
 * @module lib/actions/admin.audit-logs
 * @since 2025-11-05
 */

'use server'
'use cache'

import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'
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
  'use cache'
  cacheLife({ revalidate: CACHE_TTL.PHI_STANDARD }) // 60s for audit data
  cacheTag('admin-audit-logs')

  try {
    const searchParams = new URLSearchParams()
    if (params.search) searchParams.append('search', params.search)
    if (params.action && params.action !== 'all') searchParams.append('action', params.action)
    if (params.resource && params.resource !== 'all') searchParams.append('resource', params.resource)
    if (params.range) searchParams.append('range', params.range)
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())

    const response = await fetch(`${process.env.API_BASE_URL}/api/audit-logs?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
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
  'use cache'
  cacheLife({ revalidate: CACHE_TTL.STATS }) // 120s for stats
  cacheTag('admin-audit-logs-stats')

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/audit-logs/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
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
  'use cache'
  cacheLife({ revalidate: CACHE_TTL.PHI_STANDARD }) // 60s for specific log
  cacheTag(`admin-audit-log-${id}`)

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/audit-logs/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
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
    const searchParams = new URLSearchParams()
    if (filters.action) searchParams.append('action', filters.action)
    if (filters.resource) searchParams.append('resource', filters.resource)
    if (filters.userId) searchParams.append('userId', filters.userId)
    if (filters.dateRange) searchParams.append('range', filters.dateRange)
    if (filters.startDate) searchParams.append('startDate', filters.startDate)
    if (filters.endDate) searchParams.append('endDate', filters.endDate)
    searchParams.append('format', format)

    const response = await fetch(`${process.env.API_BASE_URL}/api/audit-logs/export?${searchParams.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
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
  'use cache'
  cacheLife({ revalidate: CACHE_TTL.STATIC }) // 300s for filter options
  cacheTag('admin-audit-logs-filters')

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/audit-logs/filters`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
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
    const response = await fetch(`${process.env.API_BASE_URL}/api/audit-logs/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
      body: JSON.stringify({ olderThanDays }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Revalidate cache
    await fetch(`${process.env.API_BASE_URL}/api/revalidate?tag=admin-audit-logs`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.API_TOKEN}` },
    })

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
