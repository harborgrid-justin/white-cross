/**
 * Admin Configuration Server Actions - System settings management
 *
 * @module lib/actions/admin.configuration
 * @since 2025-11-05
 */

'use server'

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
    const response = await fetch(`/api/proxy/configurations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Handle different response formats from backend
    if (data.configuration) {
      return data.configuration
    } else if (Array.isArray(data) && data.length > 0) {
      // If backend returns array of configs, create a merged config object
      const config = data.reduce((acc, item) => {
        acc[item.key] = item.value
        return acc
      }, {})
      return {
        id: config.id || 'system',
        sessionTimeout: config.sessionTimeout,
        passwordMinLength: config.passwordMinLength,
        passwordRequireSpecialChars: config.passwordRequireSpecialChars,
        maxLoginAttempts: config.maxLoginAttempts,
        backupFrequency: config.backupFrequency,
        enableAuditLogging: config.enableAuditLogging,
        enableEmailNotifications: config.enableEmailNotifications,
        enableSMSNotifications: config.enableSMSNotifications,
        maintenanceMode: config.maintenanceMode,
        createdAt: config.createdAt ? new Date(config.createdAt) : new Date(),
        updatedAt: config.updatedAt ? new Date(config.updatedAt) : new Date(),
      }
    } else if (data.data) {
      // Handle wrapped response
      return data.data
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
  try {
    const response = await fetch(`/api/proxy/configurations/changes/recent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Handle different response formats
    if (data.auditTrail) {
      return data.auditTrail
    } else if (Array.isArray(data)) {
      return data
    } else if (data.data) {
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
    const response = await fetch(`/api/proxy/configurations/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      message: data.message || 'Configuration reset successfully'
    }
  } catch (error) {
    console.error('Error resetting configuration:', error)
    throw error
  }
}
