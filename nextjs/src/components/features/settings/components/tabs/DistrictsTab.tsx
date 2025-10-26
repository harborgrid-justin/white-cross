'use client';

/**
 * WF-COMP-071 | DistrictsTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../../../../services/api | Dependencies: lucide-react, ../../../../../../services/api, react-hot-toast
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: useState, useEffect, component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React, { useState, useEffect } from 'react'
import {
  Building2,
  Plus,
  Search,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { administrationApi } from '../../../../../services/api'
import toast from 'react-hot-toast'

export default function DistrictsTab() {
  const [districts, setDistricts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingDistrict, setEditingDistrict] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'name', direction: 'asc' })
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    email: '',
    phoneNumber: '',
    address: '',
    superintendent: '',
    status: 'Active'
  })

  useEffect(() => {
    loadDistricts()
  }, [])

  const loadDistricts = async () => {
    try {
      setLoading(true)
      const data = await administrationApi.getDistricts()
      setDistricts(data.data?.districts || [])
    } catch (error) {
      console.error('Error loading districts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingDistrict) {
        await administrationApi.updateDistrict(editingDistrict.id, formData)
        toast.success('District updated successfully')
      } else {
        await administrationApi.createDistrict(formData)
        toast.success('District created successfully')
      }
      setShowModal(false)
      resetForm()
      loadDistricts()
    } catch (error) {
      toast.error('Failed to save district')
    }
  }

  const handleEdit = (district: any) => {
    setEditingDistrict(district)
    setFormData({
      name: district.name,
      code: district.code,
      description: district.description || '',
      email: district.email || '',
      phoneNumber: district.phoneNumber || '',
      address: district.address || '',
      superintendent: district.superintendent || '',
      status: district.status || 'Active'
    })
    setShowModal(true)
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingDistrictId, setDeletingDistrictId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setDeletingDistrictId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deletingDistrictId) return

    try {
      await administrationApi.deleteDistrict(deletingDistrictId)
      toast.success('District deleted successfully')
      loadDistricts()
    } catch (error) {
      toast.error('Failed to delete district')
    } finally {
      setShowDeleteModal(false)
      setDeletingDistrictId(null)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      email: '',
      phoneNumber: '',
      address: '',
      superintendent: '',
      status: 'Active'
    })
    setEditingDistrict(null)
  }

  const handleSort = (field: string) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedDistricts(filteredDistricts.map(d => d.id))
    } else {
      setSelectedDistricts([])
    }
  }

  const handleSelectDistrict = (id: string) => {
    setSelectedDistricts(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Code', 'Schools', 'Status', 'Email', 'Phone'].join(','),
      ...filteredDistricts.map(d =>
        [d.name, d.code, d._count?.schools || 0, d.status || 'Active', d.email || '', d.phoneNumber || ''].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'districts.csv'
    a.click()
    toast.success('Districts exported successfully')
  }

  const filteredDistricts = districts
    .filter(d => {
      const matchesSearch = `${d.name} ${d.code}`.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || (d.status || 'Active') === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const aVal = a[sortBy.field] || ''
      const bVal = b[sortBy.field] || ''
      return sortBy.direction === 'asc'
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1
    })

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredDistricts.length / itemsPerPage)
  const paginatedDistricts = filteredDistricts.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">District Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
          data-testid="add-district-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add District
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
              placeholder="Search districts..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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
        <div className="card p-12 text-center text-gray-500">Loading districts...</div>
      ) : filteredDistricts.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No districts found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedDistricts.length === filteredDistricts.length && filteredDistricts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Name {sortBy.field === 'name' && (sortBy.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schools</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDistricts.map(district => (
                <tr key={district.id}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedDistricts.includes(district.id)}
                      onChange={() => handleSelectDistrict(district.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{district.name}</div>
                    <div className="text-sm text-gray-500">{district.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {district._count?.schools || 0} schools
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      (district.status || 'Active') === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {district.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {district.email && <div>{district.email}</div>}
                    {district.phoneNumber && <div>{district.phoneNumber}</div>}
                    {district.address && <div className="text-xs text-gray-500">{district.address}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(district)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      data-testid={`edit-district-${district.id}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(district.id)}
                      className="text-red-600 hover:text-red-900"
                      data-testid={`delete-district-${district.id}`}
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
                Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredDistricts.length)} of {filteredDistricts.length} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingDistrict ? 'Edit District' : 'Add District'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    data-testid="district-name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    data-testid="district-code"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={2}
                />
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
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Superintendent
                  </label>
                  <input
                    type="text"
                    value={formData.superintendent}
                    onChange={(e) => setFormData({ ...formData, superintendent: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    data-testid="superintendent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
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
                  data-testid="address"
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
                <button type="submit" className="btn-primary" data-testid="save-district">
                  {editingDistrict ? 'Update' : 'Create'}
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
            <p className="text-gray-600 mb-6">Are you sure you want to delete this district? This action cannot be undone.</p>
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


