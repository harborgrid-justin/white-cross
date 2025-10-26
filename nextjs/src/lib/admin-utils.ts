/**
 * Admin Utilities - Helper functions for admin operations
 *
 * Provides utility functions for audit logging, data export, bulk operations,
 * and other admin-specific functionality.
 *
 * @module lib/admin-utils
 * @since 2025-10-26
 *
 * Features:
 * - Audit logging for compliance tracking
 * - CSV/PDF data export
 * - Bulk operation helpers
 * - Permission validation
 * - Data sanitization for PHI
 */

import { UserRole } from '@/middleware'

// ============================================================================
// Audit Logging
// ============================================================================

export interface AuditLogEntry {
  userId: string
  userRole: UserRole
  action: string
  resource: string
  resourceId?: string
  metadata?: Record<string, any>
  timestamp: Date
  ipAddress?: string
  userAgent?: string
}

/**
 * Log an admin action for audit trail
 * In production, this should send to a backend audit service
 */
export async function logAdminAction(entry: Omit<AuditLogEntry, 'timestamp'>): Promise<void> {
  const auditEntry: AuditLogEntry = {
    ...entry,
    timestamp: new Date(),
  }

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUDIT LOG]', JSON.stringify(auditEntry, null, 2))
  }

  // In production, send to backend audit API
  try {
    await fetch('/api/audit-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(auditEntry),
    })
  } catch (error) {
    console.error('Failed to log audit entry:', error)
    // Don't throw - audit logging failures shouldn't break the app
  }
}

/**
 * Get auth token from localStorage or cookies
 */
function getAuthToken(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token') || ''
  }
  return ''
}

// ============================================================================
// Data Export
// ============================================================================

export type ExportFormat = 'csv' | 'pdf' | 'json'

export interface ExportOptions {
  format: ExportFormat
  filename: string
  includeHeaders?: boolean
  sanitizePHI?: boolean
}

/**
 * Convert data to CSV format
 */
export function convertToCSV(data: any[], headers?: string[]): string {
  if (!data || data.length === 0) {
    return ''
  }

  // Extract headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0])

  // Create CSV content
  const csvRows = [
    csvHeaders.join(','), // Header row
    ...data.map(row =>
      csvHeaders.map(header => {
        const value = row[header]
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = value?.toString() || ''
        return stringValue.includes(',') || stringValue.includes('"')
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue
      }).join(',')
    )
  ]

  return csvRows.join('\n')
}

/**
 * Download data as CSV file
 */
export function downloadCSV(data: any[], filename: string, headers?: string[]): void {
  const csv = convertToCSV(data, headers)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Download data as JSON file
 */
export function downloadJSON(data: any, filename: string): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.json`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export data in specified format
 */
export async function exportData(data: any[], options: ExportOptions): Promise<void> {
  // Sanitize PHI if requested
  const sanitizedData = options.sanitizePHI ? sanitizePHIData(data) : data

  // Log export action
  await logAdminAction({
    userId: getCurrentUserId(),
    userRole: getCurrentUserRole(),
    action: 'EXPORT_DATA',
    resource: options.filename,
    metadata: {
      format: options.format,
      recordCount: data.length,
      sanitized: options.sanitizePHI,
    },
  })

  // Export based on format
  switch (options.format) {
    case 'csv':
      downloadCSV(sanitizedData, options.filename)
      break
    case 'json':
      downloadJSON(sanitizedData, options.filename)
      break
    case 'pdf':
      // PDF export would require a library like jsPDF
      console.warn('PDF export not yet implemented')
      break
    default:
      throw new Error(`Unsupported export format: ${options.format}`)
  }
}

// ============================================================================
// Bulk Operations
// ============================================================================

export interface BulkOperationResult {
  success: number
  failed: number
  errors: Array<{ id: string; error: string }>
}

/**
 * Execute a bulk operation with error handling
 */
export async function executeBulkOperation<T>(
  items: T[],
  operation: (item: T) => Promise<void>,
  options?: {
    batchSize?: number
    onProgress?: (completed: number, total: number) => void
  }
): Promise<BulkOperationResult> {
  const batchSize = options?.batchSize || 10
  const result: BulkOperationResult = {
    success: 0,
    failed: 0,
    errors: [],
  }

  // Process in batches
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)

    await Promise.allSettled(
      batch.map(async (item) => {
        try {
          await operation(item)
          result.success++
        } catch (error) {
          result.failed++
          result.errors.push({
            id: (item as any).id || `item-${i}`,
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      })
    )

    // Report progress
    if (options?.onProgress) {
      options.onProgress(i + batch.length, items.length)
    }
  }

  return result
}

// ============================================================================
// Permission Validation
// ============================================================================

/**
 * Check if current user has required role
 */
export function hasRole(requiredRoles: UserRole[]): boolean {
  const userRole = getCurrentUserRole()
  return requiredRoles.includes(userRole)
}

/**
 * Check if current user is admin
 */
export function isAdmin(): boolean {
  const role = getCurrentUserRole()
  return role === UserRole.ADMIN || role === UserRole.DISTRICT_ADMIN
}

/**
 * Get current user's role from token or session
 */
function getCurrentUserRole(): UserRole {
  // This should decode the JWT token or read from session
  // For now, returning a default value
  if (typeof window !== 'undefined') {
    const storedRole = localStorage.getItem('user_role')
    return (storedRole as UserRole) || UserRole.STAFF
  }
  return UserRole.STAFF
}

/**
 * Get current user's ID from token or session
 */
function getCurrentUserId(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_id') || 'unknown'
  }
  return 'unknown'
}

// ============================================================================
// Data Sanitization
// ============================================================================

/**
 * PHI fields that should be sanitized or redacted
 */
const PHI_FIELDS = [
  'ssn',
  'socialSecurityNumber',
  'medicalRecordNumber',
  'healthInsuranceNumber',
  'accountNumber',
  'certificateNumber',
  'licenseNumber',
  'vehicleIdentifier',
  'deviceIdentifier',
  'biometricIdentifier',
  'fullFacePhoto',
  'ipAddress',
]

/**
 * Sanitize PHI data for export or display
 */
export function sanitizePHIData(data: any[]): any[] {
  return data.map(item => {
    const sanitized = { ...item }
    PHI_FIELDS.forEach(field => {
      if (sanitized[field]) {
        // Redact sensitive data
        sanitized[field] = '[REDACTED]'
      }
    })
    return sanitized
  })
}

/**
 * Mask sensitive string (show only first and last 2 characters)
 */
export function maskSensitiveString(value: string): string {
  if (!value || value.length <= 4) {
    return '****'
  }
  const first = value.slice(0, 2)
  const last = value.slice(-2)
  const middle = '*'.repeat(Math.min(value.length - 4, 8))
  return `${first}${middle}${last}`
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
