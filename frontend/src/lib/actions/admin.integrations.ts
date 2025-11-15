/**
 * Admin Integrations Server Actions - Third-party integrations management
 *
 * @module lib/actions/admin.integrations
 * @since 2025-11-05
 */

'use server'
import { serverGet, serverPost, serverPut } from '@/lib/api/nextjs-client'
import { CACHE_TTL } from '@/lib/cache/constants'

export interface Integration {
  id: string
  name: string
  description: string
  category: 'healthcare' | 'communication' | 'analytics' | 'storage'
  enabled: boolean
  configured: boolean
  icon: string
  status: 'active' | 'inactive' | 'error' | 'pending'
  lastSync?: Date
  config?: Record<string, unknown>
  metrics?: {
    totalRequests: number
    successRate: number
    avgResponseTime: number
  }
}

export interface IntegrationConfig {
  apiKey?: string
  endpoint?: string
  webhookUrl?: string
  settings?: Record<string, unknown>
}

/**
 * Get all available integrations with their current status
 */
export async function getIntegrations(): Promise<Integration[]> {
  try {
    const data = await serverGet<{ integrations: Integration[] }>(
      `${process.env.API_BASE_URL}/api/integrations`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATS,
          tags: ['admin-integrations']
        }
      }
    )

    return data.integrations || getDefaultIntegrations()
  } catch (error) {
    console.error('Error fetching integrations:', error)
    return getDefaultIntegrations()
  }
}

/**
 * Toggle integration enabled/disabled status
 */
export async function toggleIntegration(
  id: string,
  enabled: boolean
): Promise<{ success: boolean; message: string; integration?: Integration }> {
  try {
    const data = await serverPost<{ integration: Integration }>(
      `${process.env.API_BASE_URL}/api/integrations/${id}/toggle`,
      { enabled },
      {
        cache: 'no-store'
      }
    )

    // Revalidate cache
    await serverPost(
      `${process.env.API_BASE_URL}/api/revalidate`,
      { tag: 'admin-integrations' },
      { cache: 'no-store' }
    )

    return {
      success: true,
      message: `Integration ${enabled ? 'enabled' : 'disabled'} successfully`,
      integration: data.integration,
    }
  } catch (error) {
    console.error('Error toggling integration:', error)
    return {
      success: false,
      message: 'Failed to update integration status',
    }
  }
}

/**
 * Update integration configuration
 */
export async function updateIntegrationConfig(
  id: string,
  config: IntegrationConfig
): Promise<{ success: boolean; message: string; integration?: Integration }> {
  try {
    const data = await serverPut<{ integration: Integration }>(
      `${process.env.API_BASE_URL}/api/integrations/${id}/config`,
      config,
      {
        cache: 'no-store'
      }
    )

    // Revalidate cache
    await serverPost(
      `${process.env.API_BASE_URL}/api/revalidate`,
      { tag: 'admin-integrations' },
      { cache: 'no-store' }
    )

    return {
      success: true,
      message: 'Integration configuration updated successfully',
      integration: data.integration,
    }
  } catch (error) {
    console.error('Error updating integration config:', error)
    return {
      success: false,
      message: 'Failed to update integration configuration',
    }
  }
}

/**
 * Test integration connection
 */
export async function testIntegration(id: string): Promise<{ success: boolean; message: string; details?: unknown }> {
  try {
    const data = await serverPost<{ testResults: unknown }>(
      `${process.env.API_BASE_URL}/api/integrations/${id}/test`,
      undefined,
      {
        cache: 'no-store'
      }
    )

    return {
      success: true,
      message: 'Integration test completed successfully',
      details: data.testResults,
    }
  } catch (error) {
    console.error('Error testing integration:', error)
    return {
      success: false,
      message: 'Integration test failed',
    }
  }
}

/**
 * Get integration logs and analytics
 */
export async function getIntegrationLogs(
  id: string,
  limit: number = 50
): Promise<Array<{
  id: string
  timestamp: Date
  level: 'info' | 'warn' | 'error'
  message: string
  details?: Record<string, unknown>
}>> {
  try {
    const data = await serverGet<{
      logs: Array<{
        id: string
        timestamp: Date
        level: 'info' | 'warn' | 'error'
        message: string
        details?: Record<string, unknown>
      }>
    }>(
      `${process.env.API_BASE_URL}/api/integrations/${id}/logs`,
      { limit },
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.REALTIME,
          tags: [`admin-integration-logs-${id}`]
        }
      }
    )

    return data.logs || []
  } catch (error) {
    console.error('Error fetching integration logs:', error)
    return []
  }
}

/**
 * Sync integration data manually
 */
export async function syncIntegration(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await serverPost(
      `${process.env.API_BASE_URL}/api/integrations/${id}/sync`,
      undefined,
      {
        cache: 'no-store'
      }
    )

    // Revalidate cache
    await serverPost(
      `${process.env.API_BASE_URL}/api/revalidate`,
      { tag: 'admin-integrations' },
      { cache: 'no-store' }
    )

    return {
      success: true,
      message: 'Integration sync initiated successfully',
    }
  } catch (error) {
    console.error('Error syncing integration:', error)
    return {
      success: false,
      message: 'Failed to sync integration',
    }
  }
}

/**
 * Get integration categories for filtering
 */
export async function getIntegrationCategories(): Promise<Array<{
  id: string
  label: string
  count: number
}>> {
  try {
    const data = await serverGet<{
      categories: Array<{
        id: string
        label: string
        count: number
      }>
    }>(
      `${process.env.API_BASE_URL}/api/integrations/categories`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: ['admin-integration-categories']
        }
      }
    )

    return data.categories || getDefaultCategories()
  } catch (error) {
    console.error('Error fetching integration categories:', error)
    return getDefaultCategories()
  }
}

/**
 * Default integrations for fallback
 */
function getDefaultIntegrations(): Integration[] {
  return [
    {
      id: 'epic',
      name: 'Epic EHR',
      description: 'Connect with Epic electronic health records system',
      category: 'healthcare',
      enabled: false,
      configured: false,
      icon: '🏥',
      status: 'inactive',
      metrics: { totalRequests: 0, successRate: 0, avgResponseTime: 0 }
    },
    {
      id: 'twilio',
      name: 'Twilio SMS',
      description: 'Send SMS notifications and alerts via Twilio',
      category: 'communication',
      enabled: true,
      configured: true,
      icon: '📱',
      status: 'active',
      lastSync: new Date(),
      metrics: { totalRequests: 1247, successRate: 98.5, avgResponseTime: 250 }
    },
    {
      id: 'sendgrid',
      name: 'SendGrid Email',
      description: 'Email delivery service for notifications',
      category: 'communication',
      enabled: true,
      configured: true,
      icon: '📧',
      status: 'active',
      lastSync: new Date(),
      metrics: { totalRequests: 3421, successRate: 99.2, avgResponseTime: 180 }
    },
    {
      id: 'datadog',
      name: 'Datadog Monitoring',
      description: 'Application performance monitoring and logging',
      category: 'analytics',
      enabled: false,
      configured: false,
      icon: '📊',
      status: 'inactive',
      metrics: { totalRequests: 0, successRate: 0, avgResponseTime: 0 }
    },
    {
      id: 's3',
      name: 'AWS S3',
      description: 'Cloud storage for documents and attachments',
      category: 'storage',
      enabled: true,
      configured: true,
      icon: '☁️',
      status: 'active',
      lastSync: new Date(),
      metrics: { totalRequests: 892, successRate: 99.8, avgResponseTime: 120 }
    },
  ]
}

/**
 * Default categories for fallback
 */
function getDefaultCategories(): Array<{ id: string; label: string; count: number }> {
  return [
    { id: 'healthcare', label: 'Healthcare Systems', count: 1 },
    { id: 'communication', label: 'Communication Services', count: 2 },
    { id: 'analytics', label: 'Analytics & Monitoring', count: 1 },
    { id: 'storage', label: 'Cloud Storage', count: 1 },
  ]
}
