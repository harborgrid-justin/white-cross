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
import CommunicationStats from '../components/communication/CommunicationStats'
import CommunicationComposeTab from '../components/communication/tabs/CommunicationComposeTab'
import CommunicationBroadcastTab from '../components/communication/tabs/CommunicationBroadcastTab'
import CommunicationTemplatesTab from '../components/communication/tabs/CommunicationTemplatesTab'
import CommunicationHistoryTab from '../components/communication/tabs/CommunicationHistoryTab'
import CommunicationEmergencyTab from '../components/communication/tabs/CommunicationEmergencyTab'

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
        {activeTab === 'compose' && (
          <CommunicationComposeTab
            formData={composeForm}
            onFormChange={setComposeForm}
            onSubmit={handleSendMessage}
            loading={loading}
          />
        )}

        {activeTab === 'broadcast' && (
          <CommunicationBroadcastTab
            formData={broadcastForm}
            onFormChange={setBroadcastForm}
            onSubmit={handleSendBroadcast}
            loading={loading}
          />
        )}

        {activeTab === 'templates' && (
          <CommunicationTemplatesTab
            templates={templates}
            formData={templateForm}
            onFormChange={setTemplateForm}
            onSubmit={handleCreateTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            loading={loading}
          />
        )}

        {activeTab === 'history' && (
          <CommunicationHistoryTab
            messages={messages}
            getPriorityColor={getPriorityColor}
          />
        )}

        {activeTab === 'emergency' && (
          <CommunicationEmergencyTab
            formData={emergencyForm}
            onFormChange={setEmergencyForm}
            onSubmit={handleSendEmergencyAlert}
            loading={loading}
          />
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
