/**
 * Admin Configuration Server Actions - System settings management
 *
 * @module lib/actions/admin.configuration
 * @since 2025-11-05
 */

'use server'
import { serverGet, serverPost, serverPut } from '@/lib/api/server'

export interface SystemConfiguration {
  id: string
  sessionTimeout: number
  passwordMinLength: number
  passwordRequireSpecialChars: boolean
  maxLoginAttempts: number
  backupFrequency: 'hourly' | 'daily' | 'weekly'
  enableAuditLogging: boolean
  enableEmailNotifications: boolean
  enableSMSNotifications: boolean
  maintenanceMode: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ConfigurationUpdateData {
  sessionTimeout?: number
  passwordMinLength?: number
  passwordRequireSpecialChars?: boolean
  maxLoginAttempts?: number
  backupFrequency?: 'hourly' | 'daily' | 'weekly'
  enableAuditLogging?: boolean
  enableEmailNotifications?: boolean
  enableSMSNotifications?: boolean
  maintenanceMode?: boolean
}

/**
 * Get current system configuration
 */
export async function getSystemConfiguration(): Promise<SystemConfiguration> {
  try {
    const data = await serverGet<SystemConfiguration | { configuration: SystemConfiguration } | { data: SystemConfiguration } | Array<{ key: string; value: unknown }>>(
      '/api/proxy/configurations',
      undefined,
      {
        cache: 'no-store'
      }
    )

    // Handle different response formats from backend
    if (data && typeof data === 'object' && 'configuration' in data) {
      return data.configuration
    } else if (Array.isArray(data) && data.length > 0) {
      // If backend returns array of configs, create a merged config object
      const config = data.reduce((acc, item) => {
        acc[item.key] = item.value
        return acc
      }, {} as Record<string, unknown>)
      return {
        id: (config.id as string) || 'system',
        sessionTimeout: config.sessionTimeout as number,
        passwordMinLength: config.passwordMinLength as number,
        passwordRequireSpecialChars: config.passwordRequireSpecialChars as boolean,
        maxLoginAttempts: config.maxLoginAttempts as number,
        backupFrequency: config.backupFrequency as 'hourly' | 'daily' | 'weekly',
        enableAuditLogging: config.enableAuditLogging as boolean,
        enableEmailNotifications: config.enableEmailNotifications as boolean,
        enableSMSNotifications: config.enableSMSNotifications as boolean,
        maintenanceMode: config.maintenanceMode as boolean,
        createdAt: config.createdAt ? new Date(config.createdAt as string) : new Date(),
        updatedAt: config.updatedAt ? new Date(config.updatedAt as string) : new Date(),
      }
    } else if (data && typeof data === 'object' && 'data' in data) {
      // Handle wrapped response
      return data.data
    } else if (data && typeof data === 'object' && 'id' in data) {
      // Direct configuration object
      return data as SystemConfiguration
    } else {
      throw new Error('Invalid response format from configuration API')
    }
  } catch (error) {
    console.error('Error fetching system configuration:', error)
    throw error // Re-throw instead of returning mock data
  }
}

/**
 * Update system configuration
 */
export async function updateSystemConfiguration(
  updateData: ConfigurationUpdateData
): Promise<{ success: boolean; message: string; configuration?: SystemConfiguration }> {
  try {
    const data = await serverPut<{ configuration: SystemConfiguration }>(
      `${process.env.API_BASE_URL}/api/configuration`,
      updateData,
      {
        cache: 'no-store'
      }
    )

    // Revalidate cache
    await serverPost(
      `${process.env.API_BASE_URL}/api/revalidate`,
      { tag: 'admin-configuration' },
      { cache: 'no-store' }
    )

    return {
      success: true,
      message: 'Configuration updated successfully',
      configuration: data.configuration,
    }
  } catch (error) {
    console.error('Error updating system configuration:', error)
    return {
      success: false,
      message: 'Failed to update configuration',
    }
  }
}

/**
 * Get configuration audit trail
 */
export async function getConfigurationAuditTrail(): Promise<Array<{
  id: string
  field: string
  oldValue: unknown
  newValue: unknown
  changedBy: string
  changedAt: Date
  reason?: string
}>> {
  try {
    type AuditTrailItem = {
      id: string
      field: string
      oldValue: unknown
      newValue: unknown
      changedBy: string
      changedAt: Date
      reason?: string
    }

    const data = await serverGet<AuditTrailItem[] | { auditTrail: AuditTrailItem[] } | { data: AuditTrailItem[] }>(
      '/api/proxy/configurations/changes/recent',
      undefined,
      {
        cache: 'no-store'
      }
    )

    // Handle different response formats
    if (data && typeof data === 'object' && 'auditTrail' in data) {
      return data.auditTrail
    } else if (Array.isArray(data)) {
      return data
    } else if (data && typeof data === 'object' && 'data' in data) {
      return data.data
    } else {
      throw new Error('Invalid response format from audit trail API')
    }
  } catch (error) {
    console.error('Error fetching configuration audit trail:', error)
    throw error // Re-throw instead of returning empty array
  }
}

/**
 * Reset configuration to defaults
 */
export async function resetConfigurationToDefaults(): Promise<{ success: boolean; message: string }> {
  try {
    const data = await serverPost<{ message?: string }>(
      '/api/proxy/configurations/reset',
      undefined,
      {
        cache: 'no-store'
      }
    )

    return {
      success: true,
      message: data.message || 'Configuration reset successfully'
    }
  } catch (error) {
    console.error('Error resetting configuration:', error)
    throw error
  }
}
