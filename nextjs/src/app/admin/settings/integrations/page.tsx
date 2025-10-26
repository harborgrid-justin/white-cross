/**
 * Integrations Management Page - Third-party integrations configuration
 *
 * @module app/admin/settings/integrations/page
 * @since 2025-10-26
 */

'use client'

import { useState, useEffect } from 'react'
import { Plug, Check, X, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

interface Integration {
  id: string
  name: string
  description: string
  category: 'healthcare' | 'communication' | 'analytics' | 'storage'
  enabled: boolean
  configured: boolean
  icon: string
}

const AVAILABLE_INTEGRATIONS: Integration[] = [
  {
    id: 'epic',
    name: 'Epic EHR',
    description: 'Connect with Epic electronic health records system',
    category: 'healthcare',
    enabled: false,
    configured: false,
    icon: '🏥'
  },
  {
    id: 'twilio',
    name: 'Twilio SMS',
    description: 'Send SMS notifications and alerts via Twilio',
    category: 'communication',
    enabled: true,
    configured: true,
    icon: '📱'
  },
  {
    id: 'sendgrid',
    name: 'SendGrid Email',
    description: 'Email delivery service for notifications',
    category: 'communication',
    enabled: true,
    configured: true,
    icon: '📧'
  },
  {
    id: 'datadog',
    name: 'Datadog Monitoring',
    description: 'Application performance monitoring and logging',
    category: 'analytics',
    enabled: false,
    configured: false,
    icon: '📊'
  },
  {
    id: 's3',
    name: 'AWS S3',
    description: 'Cloud storage for documents and attachments',
    category: 'storage',
    enabled: true,
    configured: true,
    icon: '☁️'
  },
]

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(AVAILABLE_INTEGRATIONS)

  const toggleIntegration = async (id: string) => {
    const integration = integrations.find(i => i.id === id)
    if (!integration) return

    if (!integration.configured && !integration.enabled) {
      toast.error('Please configure this integration before enabling it')
      return
    }

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/integrations/${id}/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !integration.enabled }),
      })

      if (!response.ok) throw new Error('Failed to toggle integration')

      setIntegrations(prev =>
        prev.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i)
      )

      toast.success(`${integration.name} ${!integration.enabled ? 'enabled' : 'disabled'}`)
    } catch (error) {
      console.error('Error toggling integration:', error)
      toast.error('Failed to update integration')
    }
  }

  const categoryGroups = integrations.reduce((acc, integration) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Integrations</h2>
        <p className="text-sm text-gray-600 mt-1">
          Connect third-party services to extend functionality
        </p>
      </div>

      {/* Integrations by Category */}
      {Object.entries(categoryGroups).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {categoryLabels[category as keyof typeof categoryLabels]}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((integration) => (
              <div
                key={integration.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{integration.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{integration.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleIntegration(integration.id)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
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

                <div className="flex items-center justify-between">
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
                  <button className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                    <Settings className="h-4 w-4" />
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
