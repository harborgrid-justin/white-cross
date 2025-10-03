import React, { useState, useEffect } from 'react'
import { 
  Settings as SettingsIcon, 
  Shield, 
  Users, 
  Building2, 
  School, 
  Database, 
  Activity, 
  Award, 
  FileKey,
  BookOpen,
  FileText,
  Plug,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  X
} from 'lucide-react'
import { administrationApi, integrationApi } from '../services/api'
import toast from 'react-hot-toast'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('overview')
  const [systemHealth, setSystemHealth] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'monitoring') {
      loadSystemHealth()
    }
  }, [activeTab])

  const loadSystemHealth = async () => {
    try {
      setLoading(true)
      const health = await administrationApi.getSystemHealth()
      setSystemHealth(health)
    } catch (error) {
      console.error('Error loading system health:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administration Panel</h1>
        <p className="text-gray-600">System configuration, multi-school management, and enterprise tools</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: SettingsIcon },
            { id: 'districts', label: 'Districts', icon: Building2 },
            { id: 'schools', label: 'Schools', icon: School },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'config', label: 'Configuration', icon: Shield },
            { id: 'integrations', label: 'Integrations', icon: Plug },
            { id: 'backups', label: 'Backups', icon: Database },
            { id: 'monitoring', label: 'Monitoring', icon: Activity },
            { id: 'licenses', label: 'Licenses', icon: FileKey },
            { id: 'training', label: 'Training', icon: BookOpen },
            { id: 'audit', label: 'Audit Logs', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'districts' && <DistrictsTab />}
        {activeTab === 'schools' && <SchoolsTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'config' && <ConfigurationTab />}
        {activeTab === 'integrations' && <IntegrationsTab />}
        {activeTab === 'backups' && <BackupsTab />}
        {activeTab === 'monitoring' && <MonitoringTab health={systemHealth} loading={loading} />}
        {activeTab === 'licenses' && <LicensesTab />}
        {activeTab === 'training' && <TrainingTab />}
        {activeTab === 'audit' && <AuditLogsTab />}
      </div>
    </div>
  )
}

// Overview Tab
function OverviewTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="card p-6 hover:shadow-lg transition-shadow">
        <Building2 className="h-8 w-8 text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">District Management</h3>
        <p className="text-sm text-gray-600 mb-4">
          Manage multiple school districts with centralized control and reporting
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Multi-district support</li>
          <li>• Centralized administration</li>
          <li>• District-level reporting</li>
          <li>• Resource allocation</li>
        </ul>
      </div>

      <div className="card p-6 hover:shadow-lg transition-shadow">
        <School className="h-8 w-8 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">School Management</h3>
        <p className="text-sm text-gray-600 mb-4">
          Scalable multi-school deployment with individual school configurations
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• School profiles</li>
          <li>• Enrollment tracking</li>
          <li>• School-level settings</li>
          <li>• Staff assignment</li>
        </ul>
      </div>

      <div className="card p-6 hover:shadow-lg transition-shadow">
        <Users className="h-8 w-8 text-purple-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">User Management</h3>
        <p className="text-sm text-gray-600 mb-4">
          Comprehensive user administration with role-based access control
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• RBAC system</li>
          <li>• User provisioning</li>
          <li>• Permission management</li>
          <li>• Activity monitoring</li>
        </ul>
      </div>

      <div className="card p-6 hover:shadow-lg transition-shadow">
        <Shield className="h-8 w-8 text-red-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">System Configuration</h3>
        <p className="text-sm text-gray-600 mb-4">
          Central configuration management for security, notifications, and integrations
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Security settings</li>
          <li>• Email/SMS config</li>
          <li>• Integration settings</li>
          <li>• Feature toggles</li>
        </ul>
      </div>

      <div className="card p-6 hover:shadow-lg transition-shadow">
        <Database className="h-8 w-8 text-indigo-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Backup & Recovery</h3>
        <p className="text-sm text-gray-600 mb-4">
          Automated backup solutions with point-in-time recovery capabilities
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Automated backups</li>
          <li>• Manual backup triggers</li>
          <li>• Backup history</li>
          <li>• Restore capabilities</li>
        </ul>
      </div>

      <div className="card p-6 hover:shadow-lg transition-shadow">
        <Activity className="h-8 w-8 text-orange-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Performance Monitoring</h3>
        <p className="text-sm text-gray-600 mb-4">
          Real-time system health monitoring and performance analytics
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• System metrics</li>
          <li>• Performance dashboards</li>
          <li>• Alert management</li>
          <li>• Usage statistics</li>
        </ul>
      </div>

      <div className="card p-6 hover:shadow-lg transition-shadow">
        <FileKey className="h-8 w-8 text-yellow-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">License Management</h3>
        <p className="text-sm text-gray-600 mb-4">
          Track and manage software licenses and compliance requirements
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• License tracking</li>
          <li>• Expiration alerts</li>
          <li>• Feature enablement</li>
          <li>• Compliance reporting</li>
        </ul>
      </div>

      <div className="card p-6 hover:shadow-lg transition-shadow">
        <BookOpen className="h-8 w-8 text-teal-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Training Modules</h3>
        <p className="text-sm text-gray-600 mb-4">
          Comprehensive staff training with progress tracking and certification
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• HIPAA training</li>
          <li>• System tutorials</li>
          <li>• Progress tracking</li>
          <li>• Certifications</li>
        </ul>
      </div>

      <div className="card p-6 hover:shadow-lg transition-shadow">
        <FileText className="h-8 w-8 text-gray-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Audit Logs</h3>
        <p className="text-sm text-gray-600 mb-4">
          Comprehensive audit trails for all system activities and user actions
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• User activity logs</li>
          <li>• Data access tracking</li>
          <li>• Compliance reporting</li>
          <li>• Security monitoring</li>
        </ul>
      </div>
    </div>
  )
}

// Districts Tab
function DistrictsTab() {
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
    address: ''
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
      address: district.address || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this district?')) return
    
    try {
      await administrationApi.deleteDistrict(id)
      toast.success('District deleted successfully')
      loadDistricts()
    } catch (error) {
      toast.error('Failed to delete district')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      email: '',
      phoneNumber: '',
      address: ''
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
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(district.id)}
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
                  {editingDistrict ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function SchoolsTab() {
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

function UsersTab() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [editingUser, setEditingUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'NURSE' as 'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN'
  })

  useEffect(() => {
    loadUsers()
  }, [roleFilter])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const filters: any = {}
      if (roleFilter !== 'all') filters.role = roleFilter
      const response = await fetch(`${(import.meta as any).env.VITE_API_URL || 'http://localhost:3001'}/api/users?page=1&limit=50`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      setUsers(data.data?.users || [])
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const endpoint = editingUser 
        ? `${(import.meta as any).env.VITE_API_URL || 'http://localhost:3001'}/api/users/${editingUser.id}`
        : `${(import.meta as any).env.VITE_API_URL || 'http://localhost:3001'}/api/users`
      
      const response = await fetch(endpoint, {
        method: editingUser ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to save user')

      toast.success(editingUser ? 'User updated successfully' : 'User created successfully')
      setShowModal(false)
      resetForm()
      loadUsers()
    } catch (error) {
      toast.error('Failed to save user')
    }
  }

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'NURSE'
    })
    setEditingUser(null)
  }

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">User Management</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="DISTRICT_ADMIN">District Admin</option>
            <option value="SCHOOL_ADMIN">School Admin</option>
            <option value="NURSE">Nurse</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-gray-500">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No users found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingUser ? 'Edit User' : 'Add User'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  disabled={!!editingUser}
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    minLength={8}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="NURSE">Nurse</option>
                  <option value="SCHOOL_ADMIN">School Admin</option>
                  <option value="DISTRICT_ADMIN">District Admin</option>
                  <option value="ADMIN">Admin</option>
                </select>
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
                  {editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function ConfigurationTab() {
  const [configurations, setConfigurations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('all')

  useEffect(() => {
    loadConfigurations()
  }, [category])

  const loadConfigurations = async () => {
    try {
      setLoading(true)
      const data = await administrationApi.getAllConfigurations(category !== 'all' ? category : undefined)
      setConfigurations(data.configurations || [])
    } catch (error) {
      console.error('Error loading configurations:', error)
    } finally {
      setLoading(false)
    }
  }

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

function BackupsTab() {
  const [backups, setBackups] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadBackups()
  }, [])

  const loadBackups = async () => {
    try {
      setLoading(true)
      const data = await administrationApi.getBackupLogs(1, 50)
      setBackups(data.backups || [])
    } catch (error) {
      console.error('Error loading backups:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBackup = async () => {
    try {
      setCreating(true)
      await administrationApi.createBackup()
      toast.success('Backup created successfully')
      loadBackups()
    } catch (error) {
      toast.error('Failed to create backup')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Backup & Recovery</h2>
        <button
          onClick={handleCreateBackup}
          disabled={creating}
          className="btn-primary flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          {creating ? 'Creating...' : 'Create Backup'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <Database className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900">{backups.length}</h3>
          <p className="text-sm text-gray-600">Total Backups</p>
        </div>
        <div className="card p-6">
          <Download className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900">
            {backups.filter(b => b.status === 'COMPLETED').length}
          </h3>
          <p className="text-sm text-gray-600">Successful</p>
        </div>
        <div className="card p-6">
          <Activity className="h-8 w-8 text-orange-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900">
            {backups[0] ? new Date(backups[0].createdAt).toLocaleDateString() : 'N/A'}
          </h3>
          <p className="text-sm text-gray-600">Last Backup</p>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-gray-500">Loading backups...</div>
      ) : backups.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No backups found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backups.map(backup => (
                <tr key={backup.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(backup.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                      {backup.type || 'FULL'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {backup.size ? `${(backup.size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      backup.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      backup.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {backup.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {backup.duration ? `${backup.duration}s` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function MonitoringTab({ health, loading }: { health: any; loading: boolean }) {
  if (loading) {
    return <div className="card p-6">Loading system health...</div>
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">System Health</h3>
        {health ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Users</div>
              <div className="text-2xl font-bold text-blue-600">{health.statistics?.totalUsers || 0}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Active Users</div>
              <div className="text-2xl font-bold text-green-600">{health.statistics?.activeUsers || 0}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Districts</div>
              <div className="text-2xl font-bold text-purple-600">{health.statistics?.totalDistricts || 0}</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Schools</div>
              <div className="text-2xl font-bold text-orange-600">{health.statistics?.totalSchools || 0}</div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No system health data available</p>
        )}
      </div>
    </div>
  )
}

function LicensesTab() {
  const [licenses, setLicenses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadLicenses()
  }, [])

  const loadLicenses = async () => {
    try {
      setLoading(true)
      const data = await administrationApi.getLicenses(1, 50)
      setLicenses(data.licenses || [])
    } catch (error) {
      console.error('Error loading licenses:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">License Management</h2>

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

function TrainingTab() {
  const [modules, setModules] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadModules()
  }, [])

  const loadModules = async () => {
    try {
      setLoading(true)
      const data = await administrationApi.getTrainingModules()
      setModules(data.modules || [])
    } catch (error) {
      console.error('Error loading training modules:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Training Module Management</h2>

      {loading ? (
        <div className="card p-12 text-center text-gray-500">Loading modules...</div>
      ) : modules.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No training modules found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map(module => (
            <div key={module.id} className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{module.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Duration: {module.duration}min</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  module.category === 'HIPAA' ? 'bg-red-100 text-red-800' :
                  module.category === 'SYSTEM' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {module.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AuditLogsTab() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionFilter, setActionFilter] = useState('')

  useEffect(() => {
    loadLogs()
  }, [actionFilter])

  const loadLogs = async () => {
    try {
      setLoading(true)
      const filters = actionFilter ? { action: actionFilter } : {}
      const data = await administrationApi.getAuditLogs(1, 50, filters)
      setLogs(data.logs || [])
    } catch (error) {
      console.error('Error loading audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Audit Logs</h2>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="LOGIN">Login</option>
          <option value="LOGOUT">Logout</option>
        </select>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-gray-500">Loading audit logs...</div>
      ) : logs.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No audit logs found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map(log => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {log.user?.email || 'System'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {log.resourceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {log.ipAddress || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
// Integrations Tab
function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<any[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingIntegration, setEditingIntegration] = useState<any>(null)
  const [testingId, setTestingId] = useState<string | null>(null)
  const [syncingId, setSyncingId] = useState<string | null>(null)

  useEffect(() => {
    loadIntegrations()
    loadStatistics()
  }, [])

  const loadIntegrations = async () => {
    try {
      setLoading(true)
      const { integrations: data } = await integrationApi.getAll()
      setIntegrations(data || [])
    } catch (error) {
      console.error('Error loading integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const { statistics: stats } = await integrationApi.getStatistics()
      setStatistics(stats)
    } catch (error) {
      console.error('Error loading statistics:', error)
    }
  }

  const handleCreate = () => {
    setEditingIntegration(null)
    setShowModal(true)
  }

  const handleEdit = (integration: any) => {
    setEditingIntegration(integration)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this integration?')) return
    
    try {
      await integrationApi.delete(id)
      toast.success('Integration deleted successfully')
      loadIntegrations()
      loadStatistics()
    } catch (error) {
      toast.error('Failed to delete integration')
    }
  }

  const handleTestConnection = async (id: string) => {
    try {
      setTestingId(id)
      const { result } = await integrationApi.testConnection(id)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
      loadIntegrations()
    } catch (error) {
      toast.error('Connection test failed')
    } finally {
      setTestingId(null)
    }
  }

  const handleSync = async (id: string) => {
    try {
      setSyncingId(id)
      const { result } = await integrationApi.sync(id)
      if (result.success) {
        toast.success(`Synced ${result.recordsSucceeded} of ${result.recordsProcessed} records`)
      } else {
        toast.error(`Sync completed with errors: ${result.recordsFailed} failed`)
      }
      loadIntegrations()
      loadStatistics()
    } catch (error) {
      toast.error('Sync failed')
    } finally {
      setSyncingId(null)
    }
  }

  const getIntegrationTypeName = (type: string) => {
    const names: Record<string, string> = {
      'SIS': 'Student Information System',
      'EHR': 'Electronic Health Record',
      'PHARMACY': 'Pharmacy Management',
      'LABORATORY': 'Laboratory Information System',
      'INSURANCE': 'Insurance Verification',
      'PARENT_PORTAL': 'Parent Portal',
      'HEALTH_APP': 'Health Application',
      'GOVERNMENT_REPORTING': 'Government Reporting'
    }
    return names[type] || type
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'INACTIVE': 'bg-gray-100 text-gray-800',
      'ERROR': 'bg-red-100 text-red-800',
      'TESTING': 'bg-yellow-100 text-yellow-800',
      'SYNCING': 'bg-blue-100 text-blue-800'
    }
    return badges[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="text-sm text-gray-600">Total Integrations</div>
            <div className="text-2xl font-bold text-gray-900">{statistics.totalIntegrations}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600">Active</div>
            <div className="text-2xl font-bold text-green-600">{statistics.activeIntegrations}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600">Total Syncs</div>
            <div className="text-2xl font-bold text-blue-600">{statistics.syncStatistics.totalSyncs}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600">Success Rate</div>
            <div className="text-2xl font-bold text-gray-900">{statistics.syncStatistics.successRate}%</div>
          </div>
        </div>
      )}

      {/* Integrations List */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Integration Hub</h2>
          <button
            onClick={handleCreate}
            className="btn-primary"
          >
            Add Integration
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : integrations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No integrations configured yet. Click "Add Integration" to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(integration.status)}`}>
                        {integration.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{getIntegrationTypeName(integration.type)}</p>
                    {integration.endpoint && (
                      <p className="text-sm text-gray-500 mt-1">{integration.endpoint}</p>
                    )}
                    {integration.lastSyncAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        Last synced: {new Date(integration.lastSyncAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTestConnection(integration.id)}
                      disabled={testingId === integration.id}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      {testingId === integration.id ? 'Testing...' : 'Test'}
                    </button>
                    <button
                      onClick={() => handleSync(integration.id)}
                      disabled={syncingId === integration.id || !integration.isActive}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                      {syncingId === integration.id ? 'Syncing...' : 'Sync'}
                    </button>
                    <button
                      onClick={() => handleEdit(integration)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(integration.id)}
                      className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <IntegrationModal
          integration={editingIntegration}
          onClose={() => {
            setShowModal(false)
            setEditingIntegration(null)
          }}
          onSave={() => {
            loadIntegrations()
            loadStatistics()
            setShowModal(false)
            setEditingIntegration(null)
          }}
        />
      )}
    </div>
  )
}

// Integration Modal Component
function IntegrationModal({ integration, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    name: integration?.name || '',
    type: integration?.type || 'SIS',
    endpoint: integration?.endpoint || '',
    apiKey: integration?.apiKey || '',
    username: integration?.username || '',
    password: integration?.password || '',
    syncFrequency: integration?.syncFrequency || 60,
    isActive: integration?.isActive !== undefined ? integration.isActive : true
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      if (integration) {
        await integrationApi.update(integration.id, formData)
        toast.success('Integration updated successfully')
      } else {
        await integrationApi.create(formData)
        toast.success('Integration created successfully')
      }
      onSave()
    } catch (error) {
      toast.error(`Failed to ${integration ? 'update' : 'create'} integration`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {integration ? 'Edit Integration' : 'Add Integration'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              disabled={!!integration}
            >
              <option value="SIS">Student Information System</option>
              <option value="EHR">Electronic Health Record</option>
              <option value="PHARMACY">Pharmacy Management</option>
              <option value="LABORATORY">Laboratory Information System</option>
              <option value="INSURANCE">Insurance Verification</option>
              <option value="PARENT_PORTAL">Parent Portal</option>
              <option value="HEALTH_APP">Health Application</option>
              <option value="GOVERNMENT_REPORTING">Government Reporting</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
            <input
              type="url"
              value={formData.endpoint}
              onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://api.example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <input
              type="password"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter API key"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sync Frequency (minutes, leave empty for manual)
            </label>
            <input
              type="number"
              value={formData.syncFrequency || ''}
              onChange={(e) => setFormData({ ...formData, syncFrequency: parseInt(e.target.value) || undefined as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : integration ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
