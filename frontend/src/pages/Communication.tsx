import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Send, 
  Users, 
  FileText, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Globe,
  Bell,
  Mail,
  Phone,
  Smartphone
} from 'lucide-react'
import { communicationApi } from '../services/api'
import toast from 'react-hot-toast'

type Tab = 'compose' | 'templates' | 'broadcast' | 'history' | 'emergency'

export default function Communication() {
  const [activeTab, setActiveTab] = useState<Tab>('compose')
  const [templates, setTemplates] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Compose form state
  const [composeForm, setComposeForm] = useState({
    recipients: '',
    channels: [] as string[],
    subject: '',
    content: '',
    priority: 'MEDIUM',
    category: 'GENERAL',
    scheduledAt: '',
  })

  // Template form state
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'EMAIL',
    category: 'GENERAL',
    variables: '',
  })

  // Broadcast form state
  const [broadcastForm, setBroadcastForm] = useState({
    grades: '',
    channels: [] as string[],
    subject: '',
    content: '',
    priority: 'MEDIUM',
    category: 'GENERAL',
    includeParents: false,
    includeEmergencyContacts: false,
  })

  // Emergency alert form state
  const [emergencyForm, setEmergencyForm] = useState({
    title: '',
    message: '',
    severity: 'HIGH',
    audience: 'ALL_STAFF',
    channels: ['EMAIL', 'SMS', 'PUSH_NOTIFICATION'] as string[],
  })

  useEffect(() => {
    loadTemplates()
    loadMessages()
    loadStatistics()
  }, [])

  const loadTemplates = async () => {
    try {
      const data = await communicationApi.getTemplates()
      setTemplates(data.templates)
    } catch (error) {
      toast.error('Failed to load templates')
    }
  }

  const loadMessages = async () => {
    try {
      const data = await communicationApi.getMessages(1, 20)
      setMessages(data.messages)
    } catch (error) {
      toast.error('Failed to load messages')
    }
  }

  const loadStatistics = async () => {
    try {
      const data = await communicationApi.getStatistics()
      setStatistics(data)
    } catch (error) {
      console.error('Failed to load statistics')
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Parse recipients (simple implementation - could be enhanced)
      const recipientIds = composeForm.recipients.split(',').map(id => id.trim())
      const recipients = recipientIds.map(id => ({
        type: 'STUDENT',
        id,
      }))

      await communicationApi.sendMessage({
        recipients,
        channels: composeForm.channels,
        subject: composeForm.subject,
        content: composeForm.content,
        priority: composeForm.priority,
        category: composeForm.category,
        scheduledAt: composeForm.scheduledAt || undefined,
      })

      toast.success('Message sent successfully')
      setComposeForm({
        recipients: '',
        channels: [],
        subject: '',
        content: '',
        priority: 'MEDIUM',
        category: 'GENERAL',
        scheduledAt: '',
      })
      loadMessages()
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await communicationApi.createTemplate({
        name: templateForm.name,
        subject: templateForm.subject,
        content: templateForm.content,
        type: templateForm.type,
        category: templateForm.category,
        variables: templateForm.variables ? templateForm.variables.split(',').map(v => v.trim()) : [],
      })

      toast.success('Template created successfully')
      setTemplateForm({
        name: '',
        subject: '',
        content: '',
        type: 'EMAIL',
        category: 'GENERAL',
        variables: '',
      })
      loadTemplates()
    } catch (error) {
      toast.error('Failed to create template')
    } finally {
      setLoading(false)
    }
  }

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const grades = broadcastForm.grades ? broadcastForm.grades.split(',').map(g => g.trim()) : undefined

      await communicationApi.sendBroadcast({
        audience: {
          grades,
          includeParents: broadcastForm.includeParents,
          includeEmergencyContacts: broadcastForm.includeEmergencyContacts,
        },
        channels: broadcastForm.channels,
        subject: broadcastForm.subject,
        content: broadcastForm.content,
        priority: broadcastForm.priority,
        category: broadcastForm.category,
      })

      toast.success('Broadcast message sent successfully')
      setBroadcastForm({
        grades: '',
        channels: [],
        subject: '',
        content: '',
        priority: 'MEDIUM',
        category: 'GENERAL',
        includeParents: false,
        includeEmergencyContacts: false,
      })
      loadMessages()
    } catch (error) {
      toast.error('Failed to send broadcast')
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmergencyAlert = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await communicationApi.sendEmergencyAlert({
        title: emergencyForm.title,
        message: emergencyForm.message,
        severity: emergencyForm.severity,
        audience: emergencyForm.audience,
        channels: emergencyForm.channels,
      })

      toast.success('Emergency alert sent successfully')
      setEmergencyForm({
        title: '',
        message: '',
        severity: 'HIGH',
        audience: 'ALL_STAFF',
        channels: ['EMAIL', 'SMS', 'PUSH_NOTIFICATION'],
      })
      loadMessages()
    } catch (error) {
      toast.error('Failed to send emergency alert')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return
    
    try {
      await communicationApi.deleteTemplate(id)
      toast.success('Template deleted successfully')
      loadTemplates()
    } catch (error) {
      toast.error('Failed to delete template')
    }
  }

  const handleChannelToggle = (formSetter: any, currentChannels: string[], channel: string) => {
    const updated = currentChannels.includes(channel)
      ? currentChannels.filter(c => c !== channel)
      : [...currentChannels, channel]
    formSetter((prev: any) => ({ ...prev, channels: updated }))
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'EMAIL': return <Mail className="h-4 w-4" />
      case 'SMS': return <MessageSquare className="h-4 w-4" />
      case 'PUSH_NOTIFICATION': return <Smartphone className="h-4 w-4" />
      case 'VOICE': return <Phone className="h-4 w-4" />
      default: return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600 bg-red-100'
      case 'HIGH': return 'text-orange-600 bg-orange-100'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
      case 'LOW': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communication Center</h1>
          <p className="text-gray-600 mt-1">
            Multi-channel messaging and communication management
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalMessages || 0}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {statistics.deliveryStatus?.DELIVERED || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {statistics.deliveryStatus?.PENDING || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {statistics.deliveryStatus?.FAILED || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'compose', name: 'Compose', icon: Send },
            { id: 'broadcast', name: 'Broadcast', icon: Users },
            { id: 'templates', name: 'Templates', icon: FileText },
            { id: 'history', name: 'History', icon: Clock },
            { id: 'emergency', name: 'Emergency Alert', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="card p-6">
        {/* Compose Tab */}
        {activeTab === 'compose' && (
          <form onSubmit={handleSendMessage} className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Send Message</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipients (comma-separated IDs)
              </label>
              <input
                type="text"
                value={composeForm.recipients}
                onChange={(e) => setComposeForm({ ...composeForm, recipients: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="student-1, student-2, ..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Channels
              </label>
              <div className="flex flex-wrap gap-2">
                {['EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE'].map((channel) => (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => handleChannelToggle(setComposeForm, composeForm.channels, channel)}
                    className={`
                      px-4 py-2 rounded-md flex items-center gap-2
                      ${composeForm.channels.includes(channel)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {getChannelIcon(channel)}
                    {channel.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={composeForm.priority}
                  onChange={(e) => setComposeForm({ ...composeForm, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={composeForm.category}
                  onChange={(e) => setComposeForm({ ...composeForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="GENERAL">General</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="HEALTH_UPDATE">Health Update</option>
                  <option value="APPOINTMENT_REMINDER">Appointment Reminder</option>
                  <option value="MEDICATION_REMINDER">Medication Reminder</option>
                  <option value="INCIDENT_NOTIFICATION">Incident Notification</option>
                  <option value="COMPLIANCE">Compliance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={composeForm.subject}
                onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Message subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Content
              </label>
              <textarea
                value={composeForm.content}
                onChange={(e) => setComposeForm({ ...composeForm, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={6}
                placeholder="Type your message here..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule Send (Optional)
              </label>
              <input
                type="datetime-local"
                value={composeForm.scheduledAt}
                onChange={(e) => setComposeForm({ ...composeForm, scheduledAt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              type="submit"
              disabled={loading || composeForm.channels.length === 0}
              className="btn-primary w-full"
            >
              <Send className="h-4 w-4 mr-2 inline" />
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}

        {/* Broadcast Tab */}
        {activeTab === 'broadcast' && (
          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Broadcast Message</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Grades (comma-separated, optional)
              </label>
              <input
                type="text"
                value={broadcastForm.grades}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, grades: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="9, 10, 11, 12"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={broadcastForm.includeParents}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, includeParents: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Include Parents</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={broadcastForm.includeEmergencyContacts}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, includeEmergencyContacts: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Include Emergency Contacts</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Channels
              </label>
              <div className="flex flex-wrap gap-2">
                {['EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE'].map((channel) => (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => handleChannelToggle(setBroadcastForm, broadcastForm.channels, channel)}
                    className={`
                      px-4 py-2 rounded-md flex items-center gap-2
                      ${broadcastForm.channels.includes(channel)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {getChannelIcon(channel)}
                    {channel.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={broadcastForm.priority}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={broadcastForm.category}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="GENERAL">General</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="HEALTH_UPDATE">Health Update</option>
                  <option value="APPOINTMENT_REMINDER">Appointment Reminder</option>
                  <option value="MEDICATION_REMINDER">Medication Reminder</option>
                  <option value="INCIDENT_NOTIFICATION">Incident Notification</option>
                  <option value="COMPLIANCE">Compliance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={broadcastForm.subject}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Broadcast subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Content
              </label>
              <textarea
                value={broadcastForm.content}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={6}
                placeholder="Type your broadcast message here..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || broadcastForm.channels.length === 0}
              className="btn-primary w-full"
            >
              <Users className="h-4 w-4 mr-2 inline" />
              {loading ? 'Sending...' : 'Send Broadcast'}
            </button>
          </form>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Message Templates</h2>
              
              <form onSubmit={handleCreateTemplate} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Create New Template</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Appointment Reminder"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={templateForm.type}
                      onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="EMAIL">Email</option>
                      <option value="SMS">SMS</option>
                      <option value="PUSH_NOTIFICATION">Push Notification</option>
                      <option value="VOICE">Voice</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={templateForm.category}
                      onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="GENERAL">General</option>
                      <option value="EMERGENCY">Emergency</option>
                      <option value="HEALTH_UPDATE">Health Update</option>
                      <option value="APPOINTMENT_REMINDER">Appointment Reminder</option>
                      <option value="MEDICATION_REMINDER">Medication Reminder</option>
                      <option value="INCIDENT_NOTIFICATION">Incident Notification</option>
                      <option value="COMPLIANCE">Compliance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject (for emails)
                  </label>
                  <input
                    type="text"
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Template subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={templateForm.content}
                    onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={4}
                    placeholder="Template content. Use variables like {studentName}, {date}, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variables (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={templateForm.variables}
                    onChange={(e) => setTemplateForm({ ...templateForm, variables: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="studentName, date, time, ..."
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Creating...' : 'Create Template'}
                </button>
              </form>

              <div className="space-y-3">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{template.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500">
                            Type: {template.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            Category: {template.category}
                          </span>
                          {template.variables && template.variables.length > 0 && (
                            <span className="text-xs text-gray-500">
                              Variables: {template.variables.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Message History</h2>
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{message.subject || 'No Subject'}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                          {message.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{message.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500">
                          Category: {message.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          Recipients: {message.recipientCount}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Alert Tab */}
        {activeTab === 'emergency' && (
          <form onSubmit={handleSendEmergencyAlert} className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-sm text-red-800">
                  Emergency alerts are sent with highest priority to designated staff members.
                </p>
              </div>
            </div>

            <h2 className="text-lg font-semibold">Send Emergency Alert</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alert Title
              </label>
              <input
                type="text"
                value={emergencyForm.title}
                onChange={(e) => setEmergencyForm({ ...emergencyForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Medical Emergency - Building A"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alert Message
              </label>
              <textarea
                value={emergencyForm.message}
                onChange={(e) => setEmergencyForm({ ...emergencyForm, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
                placeholder="Describe the emergency situation..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity Level
                </label>
                <select
                  value={emergencyForm.severity}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, severity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <select
                  value={emergencyForm.audience}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, audience: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="ALL_STAFF">All Staff</option>
                  <option value="NURSES_ONLY">Nurses Only</option>
                  <option value="SPECIFIC_GROUPS">Specific Groups</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Channels
              </label>
              <div className="flex flex-wrap gap-2">
                {['EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE'].map((channel) => (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => handleChannelToggle(setEmergencyForm, emergencyForm.channels, channel)}
                    className={`
                      px-4 py-2 rounded-md flex items-center gap-2
                      ${emergencyForm.channels.includes(channel)
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {getChannelIcon(channel)}
                    {channel.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || emergencyForm.channels.length === 0}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
            >
              <Bell className="h-4 w-4 mr-2" />
              {loading ? 'Sending Alert...' : 'Send Emergency Alert'}
            </button>
          </form>
        )}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <Globe className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Language Translation</h3>
          <p className="text-sm text-gray-600">
            Automatic translation support for multi-language communication with families.
          </p>
        </div>

        <div className="card p-6">
          <Users className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Parent Portal Integration</h3>
          <p className="text-sm text-gray-600">
            Seamless integration with parent portal for direct communication and updates.
          </p>
        </div>

        <div className="card p-6">
          <MessageSquare className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Staff Collaboration</h3>
          <p className="text-sm text-gray-600">
            Internal messaging and collaboration tools for school staff coordination.
          </p>
        </div>
      </div>
    </div>
  )
}
