import React, { useState, useEffect } from 'react'
import {
  School,
  Plus
} from 'lucide-react'
import { administrationApi } from '../../../services/api'
import toast from 'react-hot-toast'

export default function SchoolsTab() {
  const [schools, setSchools] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingSchool, setEditingSchool] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    districtId: '',
    address: '',
    phoneNumber: '',
    email: '',
    principalName: '',
    totalEnrollment: 0
  })

  useEffect(() => {
    loadSchools()
    loadDistricts()
  }, [])

  const loadSchools = async () => {
    try {
      setLoading(true)
      const data = await administrationApi.getSchools(1, 50)
      setSchools(data.schools || [])
    } catch (error) {
      console.error('Error loading schools:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDistricts = async () => {
    try {
      const data = await administrationApi.getDistricts(1, 100)
      setDistricts(data.districts || [])
      if (data.districts && data.districts.length > 0 && !formData.districtId) {
        setFormData(prev => ({ ...prev, districtId: data.districts[0].id }))
      }
    } catch (error) {
      console.error('Error loading districts:', error)
    }
  }

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
      totalEnrollment: school.totalEnrollment || 0
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this school?')) return

    try {
      await administrationApi.deleteSchool(id)
      toast.success('School deleted successfully')
      loadSchools()
    } catch (error) {
      toast.error('Failed to delete school')
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
      totalEnrollment: 0
    })
    setEditingSchool(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">School Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add School
        </button>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-gray-500">Loading schools...</div>
      ) : schools.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <School className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No schools found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map(school => (
            <div key={school.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                  <p className="text-sm text-gray-600">{school.code}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                {school.district && (
                  <p>📍 District: {school.district.name}</p>
                )}
                {school.principalName && (
                  <p>👤 Principal: {school.principalName}</p>
                )}
                {school.totalEnrollment > 0 && (
                  <p>👥 Enrollment: {school.totalEnrollment}</p>
                )}
                {school.phoneNumber && (
                  <p>📞 {school.phoneNumber}</p>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(school)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(school.id)}
                  className="flex-1 px-3 py-2 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50"
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
                    Principal Name
                  </label>
                  <input
                    type="text"
                    value={formData.principalName}
                    onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={2}
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
                <button type="submit" className="btn-primary">
                  {editingSchool ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
