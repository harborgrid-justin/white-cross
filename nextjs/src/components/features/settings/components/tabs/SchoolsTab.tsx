/**
 * WF-COMP-077 | SchoolsTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../../../../services/api | Dependencies: lucide-react, ../../../../../../services/api, react-hot-toast
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: useState, useEffect, useCallback
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React, { useState, useEffect, useCallback } from 'react'
import {
  School,
  Plus,
  Search,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { administrationApi } from '../../../../../services/api'
import toast from 'react-hot-toast'

export default function SchoolsTab() {
  const [schools, setSchools] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingSchool, setEditingSchool] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [districtFilter, setDistrictFilter] = useState('all')
  const [selectedSchools, setSelectedSchools] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'name', direction: 'asc' })
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    districtId: '',
    address: '',
    phoneNumber: '',
    email: '',
    principalName: '',
    totalEnrollment: 0,
    schoolType: 'Elementary',
    status: 'Active'
  })

  const loadSchools = useCallback(async () => {
    try {
      setLoading(true)
      const data = await administrationApi.getSchools()
      setSchools(data.data?.schools || [])
    } catch (error) {
      console.error('Error loading schools:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadDistricts = useCallback(async () => {
    try {
      const data = await administrationApi.getDistricts()
      const districts = data.data?.districts || []
      setDistricts(districts)
      if (districts.length > 0 && !formData.districtId) {
        setFormData(prev => ({ ...prev, districtId: districts[0].id }))
      }
    } catch (error) {
      console.error('Error loading districts:', error)
    }
  }, [formData.districtId])

  useEffect(() => {
    loadSchools()
    loadDistricts()
  }, [loadSchools, loadDistricts])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingSchool) {
        await administrationApi.updateSchool(editingSchool.id, formData)
        toast.success('School updated successfully')
      } else {
        await administrationApi.createSchool(formData)
        toast.success('School created successfully')
      }
      setShowModal(false)
      resetForm()
      loadSchools()
    } catch (error) {
      toast.error('Failed to save school')
    }
  }

  const handleEdit = (school: any) => {
    setEditingSchool(school)
    setFormData({
      name: school.name,
      code: school.code,
      districtId: school.districtId || '',
      address: school.address || '',
      phoneNumber: school.phoneNumber || '',
      email: school.email || '',
      principalName: school.principalName || '',
      totalEnrollment: school.totalEnrollment || 0,
      schoolType: school.schoolType || 'Elementary',
      status: school.status || 'Active'
    })
    setShowModal(true)
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingSchoolId, setDeletingSchoolId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setDeletingSchoolId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deletingSchoolId) return

    try {
      await administrationApi.deleteSchool(deletingSchoolId)
      toast.success('School deleted successfully')
      loadSchools()
    } catch (error) {
      toast.error('Failed to delete school')
    } finally {
      setShowDeleteModal(false)
      setDeletingSchoolId(null)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      districtId: districts[0]?.id || '',
      address: '',
      phoneNumber: '',
      email: '',
      principalName: '',
      totalEnrollment: 0,
      schoolType: 'Elementary',
      status: 'Active'
    })
    setEditingSchool(null)
  }

  const handleSort = (field: string) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedSchools(filteredSchools.map(s => s.id))
    } else {
      setSelectedSchools([])
    }
  }

  const handleSelectSchool = (id: string) => {
    setSelectedSchools(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Code', 'District', 'Enrollment', 'Type', 'Status', 'Phone', 'Email', 'Address'].join(','),
      ...filteredSchools.map(s =>
        [
          s.name,
          s.code,
          s.district?.name || '',
          s.totalEnrollment || 0,
          s.schoolType || 'Elementary',
          s.status || 'Active',
          s.phoneNumber || '',
          s.email || '',
          `"${s.address || ''}"`
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'schools.csv'
    a.click()
    toast.success('Schools exported successfully')
  }

  const filteredSchools = schools
    .filter(s => {
      const matchesSearch = `${s.name} ${s.code}`.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDistrict = districtFilter === 'all' || s.districtId === districtFilter
      return matchesSearch && matchesDistrict
    })
    .sort((a, b) => {
      const aVal = a[sortBy.field] || ''
      const bVal = b[sortBy.field] || ''
      return sortBy.direction === 'asc'
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1
    })

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage)
  const paginatedSchools = filteredSchools.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">School Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
          data-testid="add-school-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add School
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schools..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
            role="combobox"
          >
            <option value="all">All Districts</option>
            {districts.map(district => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="btn-primary flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-gray-500">Loading schools...</div>
      ) : filteredSchools.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <School className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No schools found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedSchools.length === filteredSchools.length && filteredSchools.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  School {sortBy.field === 'name' && (sortBy.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">District</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enrollment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nurse Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedSchools.map(school => (
                <tr key={school.id}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSchools.includes(school.id)}
                      onChange={() => handleSelectSchool(school.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{school.name}</div>
                    <div className="text-sm text-gray-500">{school.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {school.district?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {school.totalEnrollment || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {school.schoolType || 'Elementary'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      (school.status || 'Active') === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {school.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {school.address || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {school.phoneNumber && <div>{school.phoneNumber}</div>}
                    {school.email && <div className="text-xs">{school.email}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {school.principalName || 'Not Assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(school)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      data-testid={`edit-school-${school.id}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(school.id)}
                      className="text-red-600 hover:text-red-900"
                      data-testid={`delete-school-${school.id}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredSchools.length)} of {filteredSchools.length} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingSchool ? 'Edit School' : 'Add School'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    data-testid="school-name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    data-testid="school-code"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District *
                </label>
                <select
                  value={formData.districtId}
                  onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  data-testid="school-district"
                  required
                >
                  {districts.map(district => (
                    <option key={district.id} value={district.id}>
                      {district.name} ({district.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Type
                  </label>
                  <select
                    value={formData.schoolType}
                    onChange={(e) => setFormData({ ...formData, schoolType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    data-testid="school-type"
                  >
                    <option value="Elementary">Elementary</option>
                    <option value="Middle">Middle</option>
                    <option value="High">High</option>
                    <option value="K-12">K-12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    data-testid="school-status"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Principal Name
                  </label>
                  <input
                    type="text"
                    value={formData.principalName}
                    onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    data-testid="principal-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Enrollment
                  </label>
                  <input
                    type="number"
                    value={formData.totalEnrollment}
                    onChange={(e) => setFormData({ ...formData, totalEnrollment: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    data-testid="total-enrollment"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    data-testid="school-email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    data-testid="school-phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={2}
                  data-testid="school-address"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" data-testid="save-school">
                  {editingSchool ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this school? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                data-testid="confirm-delete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


