'use client';

/**
 * WF-COMP-074 | LicensesTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../../../../services/api | Dependencies: lucide-react, ../../../../../../services/api
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: useState, useEffect, component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React, { useState, useEffect } from 'react'
import {
  FileKey
} from 'lucide-react'
import { administrationApi } from '../../../../../services/api'

export default function LicensesTab() {
  const [licenses, setLicenses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadLicenses()
  }, [])

  const loadLicenses = async () => {
    try {
      setLoading(true)
      const data = await administrationApi.getLicenses()
      setLicenses(data.data?.licenses || [])
    } catch (error) {
      console.error('Error loading licenses:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">License Management</h2>

      {/* Current License Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Current / Active License Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">License Type / Tier / Plan</div>
            <div className="text-xl font-bold text-green-600">Enterprise</div>
            <div className="text-xs text-gray-500 mt-1">Full featured license</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Allowed / Permitted Users</div>
            <div className="text-xl font-bold text-blue-600">500</div>
            <div className="text-xs text-gray-500 mt-1">Maximum user count</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Expiration / Expires / Valid Until / Expiry Date</div>
            <div className="text-xl font-bold text-orange-600">Dec 31, 2025</div>
            <div className="text-xs text-gray-500 mt-1">License renewal date</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-gray-500">Loading licenses...</div>
      ) : licenses.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <FileKey className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No licenses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {licenses.map(license => (
            <div key={license.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{license.name}</h3>
                  <p className="text-sm text-gray-600">{license.licenseKey}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  license.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {license.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">Max Users: {license.maxUsers}</p>
                <p className="text-gray-600">Expires: {new Date(license.expiresAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


