/**
 * Integrations Management Content Component - Client-side integrations management
 *
 * @module app/admin/settings/integrations/_components/IntegrationsManagementContent
 * @since 2025-11-05
 */

'use client'

import { useState, useTransition } from 'react'
import { Check, X, Settings, Play, TestTube, RefreshCw, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { toggleIntegration, testIntegration, syncIntegration, type Integration } from '@/lib/actions/admin.integrations'
import { formatDateTime } from '@/lib/admin-utils'

interface IntegrationsManagementContentProps {
  initialIntegrations: Integration[]
  categories: Array<{ id: string; label: string; count: number }>
}

export default function IntegrationsManagementContent({ 
  initialIntegrations, 
  categories 
}: IntegrationsManagementContentProps) {
  const [integrations, setIntegrations] = useState(initialIntegrations)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isPending, startTransition] = useTransition()

  const filteredIntegrations = integrations.filter(integration =>
    selectedCategory === 'all' || integration.category === selectedCategory
  )

  const categoryGroups = filteredIntegrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = []
    }
    acc[integration.category].push(integration)
    return acc
  }, {} as Record<string, Integration[]>)

  const categoryLabels = {
    healthcare: 'Healthcare Systems',
    communication: 'Communication Services',
    analytics: 'Analytics & Monitoring',
    storage: 'Cloud Storage',
  }

  const handleToggle = (id: string) => {
    const integration = integrations.find(i => i.id === id)
    if (!integration) return

    if (!integration.configured && !integration.enabled) {
      toast.error('Please configure this integration before enabling it')
      return
    }

    startTransition(async () => {
      try {
        const result = await toggleIntegration(id, !integration.enabled)
        
        if (result.success) {
          setIntegrations(prev =>
            prev.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i)
          )
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Error toggling integration:', error)
        toast.error('Failed to update integration')
      }
    })
  }

  const handleTest = (id: string) => {
    startTransition(async () => {
      try {
        const result = await testIntegration(id)
        
        if (result.success) {
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Error testing integration:', error)
        toast.error('Failed to test integration')
      }
    })
  }

  const handleSync = (id: string) => {
    startTransition(async () => {
      try {
        const result = await syncIntegration(id)
        
        if (result.success) {
          toast.success(result.message)
          // Refresh the page to show updated sync status
          window.location.reload()
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Error syncing integration:', error)
        toast.error('Failed to sync integration')
      }
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Check className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Integrations by Category */}
      {Object.entries(categoryGroups).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {categoryLabels[category as keyof typeof categoryLabels]}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {items.map((integration) => (
              <div
                key={integration.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{integration.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{integration.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(integration.id)}
                    disabled={isPending}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50
                      ${integration.enabled ? 'bg-blue-600' : 'bg-gray-200'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${integration.enabled ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                {/* Status and Configuration */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      {integration.configured ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Configured</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-orange-600" />
                          <span className="text-orange-600">Not configured</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(integration.status)}`}>
                        {getStatusIcon(integration.status)}
                        {integration.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                {integration.metrics && integration.enabled && (
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {integration.metrics.totalRequests.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Requests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {integration.metrics.successRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {integration.metrics.avgResponseTime}ms
                      </div>
                      <div className="text-xs text-gray-500">Avg Response</div>
                    </div>
                  </div>
                )}

                {/* Last Sync */}
                {integration.lastSync && (
                  <div className="text-xs text-gray-500 mb-4">
                    Last sync: {formatDateTime(integration.lastSync)}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                    <Settings className="h-4 w-4" />
                    Configure
                  </button>
                  <div className="flex items-center gap-2">
                    {integration.configured && (
                      <>
                        <button
                          onClick={() => handleTest(integration.id)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs text-gray-600 hover:text-gray-700 disabled:opacity-50"
                        >
                          <TestTube className="h-3 w-3" />
                          Test
                        </button>
                        {integration.enabled && (
                          <button
                            onClick={() => handleSync(integration.id)}
                            disabled={isPending}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs text-gray-600 hover:text-gray-700 disabled:opacity-50"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Sync
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No integrations found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try selecting a different category.
          </p>
        </div>
      )}
    </div>
  )
}
