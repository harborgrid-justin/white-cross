/**
 * Admin Configuration Server Actions - System settings management
 *
 * @module lib/actions/admin.configuration
 * @since 2025-11-05
 */

'use server'
'use cache'

import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'
import { CACHE_TTL } from '@/lib/cache/constants'

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
  'use cache'
  cacheLife({ revalidate: CACHE_TTL.STATIC }) // 300s for non-PHI admin data
  cacheTag('admin-configuration')

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/configuration`, {
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
    return data.configuration
  } catch (error) {
    console.error('Error fetching system configuration:', error)
    // Return default configuration if API fails
    return {
      id: 'default',
      sessionTimeout: 30,
      passwordMinLength: 8,
      passwordRequireSpecialChars: true,
      maxLoginAttempts: 5,
      backupFrequency: 'daily',
      enableAuditLogging: true,
      enableEmailNotifications: true,
      enableSMSNotifications: true,
      maintenanceMode: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}

/**
 * Update system configuration
 */
export async function updateSystemConfiguration(
  updateData: ConfigurationUpdateData
): Promise<{ success: boolean; message: string; configuration?: SystemConfiguration }> {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/configuration`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Revalidate cache
    await fetch(`${process.env.API_BASE_URL}/api/revalidate?tag=admin-configuration`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.API_TOKEN}` },
    })

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
  'use cache'
  cacheLife({ revalidate: CACHE_TTL.PHI_STANDARD }) // 60s for more frequently changing data
  cacheTag('admin-configuration-audit')

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/configuration/audit`, {
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
    return data.auditTrail || []
  } catch (error) {
    console.error('Error fetching configuration audit trail:', error)
    return []
  }
}

/**
 * Reset configuration to defaults
 */
export async function resetConfigurationToDefaults(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/configuration/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Revalidate cache
    await fetch(`${process.env.API_BASE_URL}/api/revalidate?tag=admin-configuration`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.API_TOKEN}` },
    })

    return {
      success: true,
      message: 'Configuration reset to defaults successfully',
    }
  } catch (error) {
    console.error('Error resetting configuration:', error)
    return {
      success: false,
      message: 'Failed to reset configuration',
    }
  }
}
