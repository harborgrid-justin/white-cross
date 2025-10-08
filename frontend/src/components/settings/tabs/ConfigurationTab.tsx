import React, { useState, useEffect, useCallback } from 'react'
import {
  Shield
} from 'lucide-react'
import { administrationApi } from '../../../services/api'
import toast from 'react-hot-toast'

export default function ConfigurationTab() {
  const [configurations, setConfigurations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('all')

  const loadConfigurations = useCallback(async () => {
    try {
      setLoading(true)
      const data = await administrationApi.getAllConfigurations()
      setConfigurations(data.data?.configurations || [])
    } catch (error) {
      console.error('Error loading configurations:', error)
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    loadConfigurations()
  }, [loadConfigurations])

  const handleUpdate = async (key: string, value: string) => {
    try {
      await administrationApi.setConfiguration({ key, value, category: 'system' })
      toast.success('Configuration updated successfully')
      loadConfigurations()
    } catch (error) {
      toast.error('Failed to update configuration')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">System Configuration</h2>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Categories</option>
          <option value="security">Security</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="notifications">Notifications</option>
          <option value="system">System</option>
        </select>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-gray-500">Loading configurations...</div>
      ) : configurations.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No configurations found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {configurations.map(config => (
            <div key={config.key} className="card p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{config.key}</h3>
                  <p className="text-sm text-gray-600">{config.description || 'No description'}</p>
                  <p className="text-xs text-gray-500 mt-1">Category: {config.category}</p>
                </div>
                <div className="ml-4">
                  <input
                    type="text"
                    defaultValue={config.value}
                    onBlur={(e) => {
                      if (e.target.value !== config.value) {
                        handleUpdate(config.key, e.target.value)
                      }
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
