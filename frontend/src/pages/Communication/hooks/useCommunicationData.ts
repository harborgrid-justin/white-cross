/**
 * WF-COMP-165 | useCommunicationData.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../services/api | Dependencies: react, ../../../services/api, react-hot-toast
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: useState, useEffect, useCallback
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Communication Data Hook
 *
 * Manages data fetching and state for communication
 * @module pages/Communication/hooks
 */

import { useState, useEffect, useCallback } from 'react'
import { communicationApi } from '../../../services/api'
import toast from 'react-hot-toast'
import type {
  CommunicationTemplate,
  CommunicationMessage,
  CommunicationStatistics
} from '../types'

export const useCommunicationData = () => {
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([])
  const [messages, setMessages] = useState<CommunicationMessage[]>([])
  const [statistics, setStatistics] = useState<CommunicationStatistics | null>(null)
  const [loading, setLoading] = useState(false)

  const loadTemplates = useCallback(async () => {
    try {
      const data = await communicationApi.getTemplates()
      setTemplates(data.templates)
    } catch (error) {
      toast.error('Failed to load templates')
    }
  }, [])

  const loadMessages = useCallback(async () => {
    try {
      const data = await communicationApi.getMessages(1, 20)
      setMessages(data.messages)
    } catch (error) {
      toast.error('Failed to load messages')
    }
  }, [])

  const loadStatistics = useCallback(async () => {
    try {
      const data = await communicationApi.getStatistics()
      setStatistics(data)
    } catch (error) {
      console.error('Failed to load statistics')
    }
  }, [])

  const deleteTemplate = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      await communicationApi.deleteTemplate(id)
      toast.success('Template deleted successfully')
      loadTemplates()
    } catch (error) {
      toast.error('Failed to delete template')
    }
  }, [loadTemplates])

  useEffect(() => {
    loadTemplates()
    loadMessages()
    loadStatistics()
  }, [loadTemplates, loadMessages, loadStatistics])

  return {
    templates,
    messages,
    statistics,
    loading,
    setLoading,
    loadTemplates,
    loadMessages,
    loadStatistics,
    deleteTemplate
  }
}
