import React, { useState, useEffect } from 'react'
import {
  Building2,
  Plus
} from 'lucide-react'
import { administrationApi } from '../../../services/api'
import toast from 'react-hot-toast'

export default function DistrictsTab() {
  const [districts, setDistricts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingDistrict, setEditingDistrict] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    email: '',
    phoneNumber: '',
    address: '',
    superintendent: ''
  })

  useEffect(() => {
    loadDistricts()
  }, [])

  const loadDistricts = async () => {
    try {
      setLoading(true)
      const data = await administrationApi.getDistricts(1, 50)
      setDistricts(data.districts || [])
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
      superintendent: district.superintendent || ''
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
      superintendent: ''
    })
    setEditingDistrict(null)
  }

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

      {loading ? (
        <div className="card p-12 text-center text-gray-500">Loading districts...</div>
      ) : districts.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No districts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {districts.map(district => (
            <div key={district.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{district.name}</h3>
                  <p className="text-sm text-gray-600">{district.code}</p>
                </div>
              </div>

              {district.description && (
                <p className="text-sm text-gray-600 mb-4">{district.description}</p>
              )}

              {district.email && (
                <p className="text-sm text-gray-600">📧 {district.email}</p>
              )}
              {district.phoneNumber && (
                <p className="text-sm text-gray-600">📞 {district.phoneNumber}</p>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(district)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  data-testid={`edit-district-${district.id}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(district.id)}
                  className="flex-1 px-3 py-2 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                  data-testid={`delete-district-${district.id}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
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
