/**
 * Schools Management Page - Manage schools and facilities
 *
 * @module app/admin/settings/schools/page
 * @since 2025-10-26
 */

'use client'

import { useState, useEffect } from 'react'
import { School, Plus, Search, Download, MapPin } from 'lucide-react'
import { exportData } from '@/lib/admin-utils'
import toast from 'react-hot-toast'

interface SchoolData {
  id: string
  name: string
  code: string
  districtId: string
  districtName: string
  address: string
  phoneNumber: string
  email: string
  principalName: string
  studentCount: number
  status: 'active' | 'inactive'
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<SchoolData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [districtFilter, setDistrictFilter] = useState('all')

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('auth_token')
        const params = new URLSearchParams()
        if (districtFilter !== 'all') params.append('districtId', districtFilter)

        const response = await fetch(`/api/schools?${params.toString()}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        const data = await response.json()
        setSchools(data.schools || [])
      } catch (error) {
        console.error('Error fetching schools:', error)
        toast.error('Failed to load schools')
      } finally {
        setLoading(false)
      }
    }
    fetchSchools()
  }, [districtFilter])

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleExport = async () => {
    await exportData(filteredSchools, {
      format: 'csv',
      filename: `schools-export-${new Date().toISOString().split('T')[0]}`,
    })
    toast.success('Schools exported successfully')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Schools</h2>
          <p className="text-sm text-gray-600 mt-1">{filteredSchools.length} schools</p>
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
            Add School
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search schools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Districts</option>
            {/* Add district options from API */}
          </select>
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">School</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">District</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Principal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSchools.map((school) => (
                  <tr key={school.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                          <School className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{school.name}</div>
                          <div className="text-sm text-gray-500">{school.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{school.districtName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{school.principalName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{school.studentCount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        school.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {school.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
