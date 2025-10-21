/**
 * WF-COMP-137 | useMedicationsData.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../services/api | Dependencies: react, @tanstack/react-query, ../services/api
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces | Key Features: useState, arrow component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { medicationsApi } from '../services/api'
import type {
  Medication,
  MedicationInventory as InventoryItem,
  MedicationReminder,
  AdverseReaction,
  MedicationStatsResponse as MedicationStats,
  MedicationFormData,
  AdverseReactionFormData,
  MedicationAlert
} from '../types/api'

export interface UseMedicationsDataReturn {
  medications: Medication[]
  inventory: InventoryItem[]
  schedule: MedicationReminder[]
  reminders: MedicationReminder[]
  adverseReactions: AdverseReaction[]
  alerts: MedicationAlert[]
  stats: MedicationStats | null
  isLoading: boolean
  createMedication: (data: MedicationFormData) => Promise<void>
  reportAdverseReaction: (data: AdverseReactionFormData) => Promise<void>
  refetch: () => void
}

export const useMedicationsData = (): UseMedicationsDataReturn => {
  const queryClient = useQueryClient()
  const [currentPage] = useState(1)
  const [searchTerm] = useState('')

  // Queries
  const { data: medicationsData, isLoading: medicationsLoading } = useQuery({
    queryKey: ['medications', currentPage, searchTerm],
    queryFn: () => medicationsApi.getAll({ page: currentPage, limit: 20, search: searchTerm })
  })

  const { data: inventoryData, isLoading: inventoryLoading } = useQuery({
    queryKey: ['medication-inventory'],
    queryFn: () => medicationsApi.getInventory(),
    refetchInterval: 5 * 60 * 1000 // Refresh every 5 minutes
  })

  const { data: remindersData, isLoading: remindersLoading } = useQuery({
    queryKey: ['medication-reminders'],
    queryFn: () => medicationsApi.getReminders(),
    refetchInterval: 60 * 1000 // Refresh every minute
  })

  const { data: adverseReactionsData, isLoading: adverseReactionsLoading } = useQuery({
    queryKey: ['adverse-reactions'],
    queryFn: () => medicationsApi.getAdverseReactions('')
  })

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['medication-stats'],
    queryFn: () => ({ data: null }) // Placeholder until getStats is implemented
  })

  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['medication-alerts'],
    queryFn: () => ({ data: [] }), // Placeholder until getAlerts is implemented
    refetchInterval: 2 * 60 * 1000 // Refresh every 2 minutes
  })

  // Mutations - using existing API where available
  const createMedicationMutation = useMutation({
    mutationFn: (data: MedicationFormData) => medicationsApi.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] })
    }
  })

  const reportAdverseReactionMutation = useMutation({
    mutationFn: (data: AdverseReactionFormData) => medicationsApi.reportAdverseReaction(data.studentMedicationId || '', {
      description: data.reaction,
      severity: data.severity === 'HIGH' ? 'severe' : data.severity === 'MEDIUM' ? 'moderate' : 'mild',
      symptoms: [],
      actionTaken: ''
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adverse-reactions'] })
    }
  })

  // CRUD operation wrappers
  const createMedication = async (data: MedicationFormData): Promise<void> => {
    await createMedicationMutation.mutateAsync(data)
  }

  const reportAdverseReaction = async (data: AdverseReactionFormData): Promise<void> => {
    await reportAdverseReactionMutation.mutateAsync(data)
  }

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ['medications'] })
    queryClient.invalidateQueries({ queryKey: ['medication-inventory'] })
    queryClient.invalidateQueries({ queryKey: ['medication-reminders'] })
    queryClient.invalidateQueries({ queryKey: ['adverse-reactions'] })
    queryClient.invalidateQueries({ queryKey: ['medication-stats'] })
    queryClient.invalidateQueries({ queryKey: ['medication-alerts'] })
  }

  // Safely extract data with proper type handling
  const medications = Array.isArray(medicationsData) ? medicationsData : (medicationsData as any)?.data?.medications || (medicationsData as any)?.medications || [];
  const inventory = Array.isArray(inventoryData) ? inventoryData : (inventoryData as any)?.data?.inventory || (inventoryData as any)?.inventory || [];
  const reminders = Array.isArray(remindersData) ? remindersData : (remindersData as any)?.data?.reminders || (remindersData as any)?.reminders || [];
  const adverseReactions = Array.isArray(adverseReactionsData) ? adverseReactionsData : (adverseReactionsData as any)?.data?.reactions || (adverseReactionsData as any)?.reactions || [];
  const alerts = Array.isArray(alertsData) ? alertsData : (alertsData as any)?.data || [];

  return {
    // Data
    medications,
    inventory,
    schedule: [],
    reminders,
    adverseReactions,
    alerts,
    stats: (statsData as any)?.data || null,

    // Loading states
    isLoading: medicationsLoading || inventoryLoading || remindersLoading || adverseReactionsLoading || statsLoading || alertsLoading,

    // Operations
    createMedication,
    reportAdverseReaction,
    refetch
  }
}

