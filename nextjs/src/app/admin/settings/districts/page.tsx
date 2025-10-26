/**
 * Districts Management Page - Manage school districts
 *
 * @module app/admin/settings/districts/page
 * @since 2025-10-26
 */

'use client'

import { useState, useEffect } from 'react'
import { Building2, Plus, Search, Download } from 'lucide-react'
import { exportData } from '@/lib/admin-utils'
import toast from 'react-hot-toast'

interface District {
  id: string
  name: string
  code: string
  address: string
  phoneNumber: string
  email: string
  schoolCount: number
  status: 'active' | 'inactive'
}

export default function DistrictsPage() {
  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Fetch districts from API
    const fetchDistricts = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('auth_token')
        const response = await fetch('/api/districts', {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        const data = await response.json()
        setDistricts(data.districts || [])
      } catch (error) {
        console.error('Error fetching districts:', error)
        toast.error('Failed to load districts')
      } finally {
        setLoading(false)
      }
    }
    fetchDistricts()
  }, [])

  const filteredDistricts = districts.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleExport = async () => {
    await exportData(filteredDistricts, {
      format: 'csv',
      filename: `districts-export-${new Date().toISOString().split('T')[0]}`,
    })
    toast.success('Districts exported successfully')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Districts</h2>
          <p className="text-sm text-gray-600 mt-1">{filteredDistricts.length} districts</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Add District
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search districts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Districts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          filteredDistricts.map((district) => (
            <div key={district.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  district.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {district.status}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{district.name}</h3>
              <p className="text-sm text-gray-500 mb-4">Code: {district.code}</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>{district.address}</p>
                <p>{district.phoneNumber}</p>
                <p>{district.email}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">{district.schoolCount} schools</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
