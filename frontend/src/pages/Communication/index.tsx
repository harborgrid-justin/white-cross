/**
 * Communication Page - Enterprise Implementation
 *
 * Multi-channel communication center with:
 * - Message composition and templates
 * - Broadcast messaging
 * - Emergency alerts
 * - Communication history
 * - HIPAA-compliant messaging
 *
 * @module pages/Communication
 */

import React, { useState } from 'react'
import { CommunicationHeader } from './components/CommunicationHeader'
import { CommunicationStatisticsCards } from './components/CommunicationStatistics'
import { CommunicationTabs } from './components/CommunicationTabs'
import { CommunicationFeatureCards } from './components/CommunicationFeatureCards'
import { useCommunicationData } from './hooks/useCommunicationData'
import CommunicationComposeTab from '../../components/communication/tabs/CommunicationComposeTab'
import CommunicationBroadcastTab from '../../components/communication/tabs/CommunicationBroadcastTab'
import CommunicationTemplatesTab from '../../components/communication/tabs/CommunicationTemplatesTab'
import CommunicationHistoryTab from '../../components/communication/tabs/CommunicationHistoryTab'
import CommunicationEmergencyTab from '../../components/communication/tabs/CommunicationEmergencyTab'
import { communicationApi } from '../../services/api'
import toast from 'react-hot-toast'
import type {
  Tab,
  ComposeFormState,
  TemplateFormState,
  BroadcastFormState,
  EmergencyFormState
} from './types'

export default function Communication() {
  const [activeTab, setActiveTab] = useState<Tab>('compose')

  const {
    templates,
    messages,
    statistics,
    loading,
    setLoading,
    loadMessages,
    loadTemplates,
    deleteTemplate
  } = useCommunicationData()

  // Compose form state
  const [composeForm, setComposeForm] = useState<ComposeFormState>({
    recipients: '',
    channels: [],
    subject: '',
    content: '',
    priority: 'MEDIUM',
    category: 'GENERAL',
    scheduledAt: '',
  })

  // Template form state
  const [templateForm, setTemplateForm] = useState<TemplateFormState>({
    name: '',
    subject: '',
    content: '',
    type: 'EMAIL',
    category: 'GENERAL',
    variables: '',
  })

  // Broadcast form state
  const [broadcastForm, setBroadcastForm] = useState<BroadcastFormState>({
    grades: '',
    channels: [],
    subject: '',
    content: '',
    priority: 'MEDIUM',
    category: 'GENERAL',
    includeParents: false,
    includeEmergencyContacts: false,
  })

  // Emergency alert form state
  const [emergencyForm, setEmergencyForm] = useState<EmergencyFormState>({
    title: '',
    message: '',
    severity: 'HIGH',
    audience: 'ALL_STAFF',
    channels: ['EMAIL', 'SMS', 'PUSH_NOTIFICATION'],
  })

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Parse recipients
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
      <CommunicationHeader />

      {/* Statistics Cards */}
      <CommunicationStatisticsCards statistics={statistics} />

      {/* Tabs */}
      <CommunicationTabs activeTab={activeTab} onTabChange={setActiveTab} />

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
            onDeleteTemplate={deleteTemplate}
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
      <CommunicationFeatureCards />
    </div>
  )
}
