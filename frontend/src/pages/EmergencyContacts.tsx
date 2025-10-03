import React, { useState, useEffect } from 'react'
import { Phone, MessageCircle, Mail, Users, Plus, Search, Edit, Trash2, Send, CheckCircle, X } from 'lucide-react'
import { emergencyContactsApi } from '../services/emergencyContactsApi'
import { studentsApi } from '../services/api'
import toast from 'react-hot-toast'

interface Contact {
  id: string
  firstName: string
  lastName: string
  relationship: string
  phoneNumber: string
  email?: string
  address?: string
  priority: 'PRIMARY' | 'SECONDARY' | 'EMERGENCY_ONLY'
  isActive: boolean
  verified?: boolean
  verifiedAt?: string
  student?: {
    id: string
    firstName: string
    lastName: string
    studentNumber: string
  }
}

export default function EmergencyContacts() {
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'notify'>('overview')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showNotifyModal, setShowNotifyModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    relationship: '',
    phoneNumber: '',
    email: '',
    address: '',
    priority: 'SECONDARY' as 'PRIMARY' | 'SECONDARY' | 'EMERGENCY_ONLY',
  })

  const [notificationData, setNotificationData] = useState({
    message: '',
    type: 'general' as 'emergency' | 'health' | 'medication' | 'general',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    channels: [] as string[],
  })

  useEffect(() => {
    loadStatistics()
    loadStudents()
  }, [])

  useEffect(() => {
    if (selectedStudent) {
      loadContacts(selectedStudent)
    }
  }, [selectedStudent])

  const loadStudents = async () => {
    try {
      const response = await studentsApi.getAll(1, 100)
      setStudents(response.students || [])
      if (response.students && response.students.length > 0) {
        setSelectedStudent(response.students[0].id)
      }
    } catch (error) {
      console.error('Error loading students:', error)
    }
  }

  const loadContacts = async (studentId: string) => {
    try {
      setLoading(true)
      const data = await emergencyContactsApi.getByStudent(studentId)
      setContacts(data.contacts || [])
    } catch (error) {
      console.error('Error loading contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const stats = await emergencyContactsApi.getStatistics()
      setStatistics(stats)
    } catch (error) {
      console.error('Error loading statistics:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingContact) {
        await emergencyContactsApi.update(editingContact.id, formData)
        toast.success('Contact updated successfully')
      } else {
        await emergencyContactsApi.create({ ...formData, studentId: selectedStudent })
        toast.success('Contact added successfully')
      }
      setShowAddModal(false)
      resetForm()
      loadContacts(selectedStudent)
      loadStatistics()
    } catch (error) {
      toast.error('Failed to save contact')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return
    
    try {
      await emergencyContactsApi.delete(id)
      toast.success('Contact deleted successfully')
      loadContacts(selectedStudent)
      loadStatistics()
    } catch (error) {
      toast.error('Failed to delete contact')
    }
  }

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await emergencyContactsApi.notifyStudent(selectedStudent, notificationData)
      toast.success('Notification sent successfully')
      setShowNotifyModal(false)
      resetNotificationData()
    } catch (error) {
      toast.error('Failed to send notification')
    }
  }

  const handleVerify = async (contactId: string, method: 'sms' | 'email' | 'voice') => {
    try {
      await emergencyContactsApi.verify(contactId, method)
      toast.success(`Verification sent via ${method}`)
      loadContacts(selectedStudent)
    } catch (error) {
      toast.error('Failed to send verification')
    }
  }

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact)
    setFormData({
      studentId: contact.student?.id || '',
      firstName: contact.firstName,
      lastName: contact.lastName,
      relationship: contact.relationship,
      phoneNumber: contact.phoneNumber,
      email: contact.email || '',
      address: contact.address || '',
      priority: contact.priority,
    })
    setShowAddModal(true)
  }

  const resetForm = () => {
    setFormData({
      studentId: '',
      firstName: '',
      lastName: '',
      relationship: '',
      phoneNumber: '',
      email: '',
      address: '',
      priority: 'SECONDARY',
    })
    setEditingContact(null)
  }

  const resetNotificationData = () => {
    setNotificationData({
      message: '',
      type: 'general',
      priority: 'medium',
      channels: [],
    })
  }

  const filteredContacts = contacts.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.relationship.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'PRIMARY':
        return 'bg-blue-100 text-blue-800'
      case 'SECONDARY':
        return 'bg-gray-100 text-gray-800'
      case 'EMERGENCY_ONLY':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Contact System</h1>
          <p className="text-gray-600">Manage emergency contacts and multi-channel communication</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview' as const, label: 'Overview', icon: Users },
            { id: 'contacts' as const, label: 'Contacts', icon: Phone },
            { id: 'notify' as const, label: 'Send Notification', icon: Send },
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6">
              <Users className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">
                {statistics?.totalContacts || 0}
              </h3>
              <p className="text-sm text-gray-600">Total Contacts</p>
            </div>

            <div className="card p-6">
              <CheckCircle className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">
                {statistics?.verifiedContacts || 0}
              </h3>
              <p className="text-sm text-gray-600">Verified Contacts</p>
            </div>

            <div className="card p-6">
              <Phone className="h-8 w-8 text-red-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">
                {statistics?.primaryContacts || 0}
              </h3>
              <p className="text-sm text-gray-600">Primary Contacts</p>
            </div>

            <div className="card p-6">
              <MessageCircle className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">
                {statistics?.notificationsSent || 0}
              </h3>
              <p className="text-sm text-gray-600">Notifications Sent</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6">
              <Users className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Contact Management</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Primary/secondary contacts</li>
                <li>• Relationship tracking</li>
                <li>• Priority management</li>
                <li>• Contact verification</li>
              </ul>
            </div>

            <div className="card p-6">
              <MessageCircle className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Multi-Channel Communication</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• SMS notifications</li>
                <li>• Email alerts</li>
                <li>• Voice calls</li>
                <li>• Mobile app push</li>
              </ul>
            </div>

            <div className="card p-6">
              <Phone className="h-8 w-8 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Emergency Protocols</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Emergency notifications</li>
                <li>• Escalation procedures</li>
                <li>• Backup contact protocols</li>
                <li>• Response tracking</li>
              </ul>
            </div>

            <div className="card p-6">
              <Mail className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Communication History</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Message logging</li>
                <li>• Delivery confirmation</li>
                <li>• Response tracking</li>
                <li>• Communication audit</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="space-y-6">
          {/* Student Selector and Search */}
          <div className="card p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} ({student.studentNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Contacts
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or relationship..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contacts List */}
          {loading ? (
            <div className="card p-12 text-center text-gray-500">Loading contacts...</div>
          ) : filteredContacts.length === 0 ? (
            <div className="card p-12 text-center text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No emergency contacts found for this student</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 btn-primary flex items-center mx-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map(contact => (
                <div key={contact.id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{contact.relationship}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityBadge(contact.priority)}`}>
                      {contact.priority}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {contact.phoneNumber}
                    </div>
                    {contact.email && (
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {contact.email}
                      </div>
                    )}
                    {contact.verified && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verified
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="flex-1 px-3 py-2 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 inline mr-1" />
                      Delete
                    </button>
                  </div>

                  {!contact.verified && (
                    <div className="mt-2">
                      <button
                        onClick={() => handleVerify(contact.id, 'sms')}
                        className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Send Verification
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notify Tab */}
      {activeTab === 'notify' && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Send Emergency Notification</h2>
          <form onSubmit={handleNotify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Student
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} ({student.studentNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Type
              </label>
              <select
                value={notificationData.type}
                onChange={(e) => setNotificationData({ ...notificationData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="general">General</option>
                <option value="emergency">Emergency</option>
                <option value="health">Health</option>
                <option value="medication">Medication</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={notificationData.priority}
                onChange={(e) => setNotificationData({ ...notificationData, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={notificationData.message}
                onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
                placeholder="Enter notification message..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Communication Channels
              </label>
              <div className="space-y-2">
                {['sms', 'email', 'voice'].map(channel => (
                  <label key={channel} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationData.channels.includes(channel)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNotificationData({
                            ...notificationData,
                            channels: [...notificationData.channels, channel]
                          })
                        } else {
                          setNotificationData({
                            ...notificationData,
                            channels: notificationData.channels.filter(c => c !== channel)
                          })
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 capitalize">{channel}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={resetNotificationData}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingContact ? 'Edit Contact' : 'Add Contact'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship *
                  </label>
                  <input
                    type="text"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Mother, Father, Guardian"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="PRIMARY">Primary</option>
                    <option value="SECONDARY">Secondary</option>
                    <option value="EMERGENCY_ONLY">Emergency Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="contact@email.com"
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
                  placeholder="Street address, city, state, zip"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}