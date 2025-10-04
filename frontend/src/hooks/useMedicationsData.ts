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
  MedicationAlert,
  PaginatedResponse
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
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

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
    queryFn: () => medicationsApi.getAdverseReactions()
  })

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['medication-stats'],
    queryFn: () => medicationsApi.getStats()
  })

  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['medication-alerts'],
    queryFn: () => medicationsApi.getAlerts(),
    refetchInterval: 2 * 60 * 1000 // Refresh every 2 minutes
  })

  // Mutations - using existing API where available
  const createMedicationMutation = useMutation({
    mutationFn: (data: MedicationFormData) => medicationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] })
    }
  })

  const reportAdverseReactionMutation = useMutation({
    mutationFn: (data: AdverseReactionFormData) => medicationsApi.reportAdverseReaction(data),
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

  const updateMedication = async (id: string, data: Partial<MedicationFormData>): Promise<boolean> => {
    try {
      // Mock implementation - API endpoint not available yet
      console.log('Mock: Updating medication', id, data)
      queryClient.invalidateQueries({ queryKey: ['medications'] })
      return true
    } catch (error) {
      console.error('Error updating medication:', error)
      return false
    }
  }

  const deleteMedication = async (id: string): Promise<boolean> => {
    try {
      // Mock implementation - API endpoint not available yet
      console.log('Mock: Deleting medication', id)
      queryClient.invalidateQueries({ queryKey: ['medications'] })
      return true
    } catch (error) {
      console.error('Error deleting medication:', error)
      return false
    }
  }

  const updateStock = async (itemId: string, quantity: number): Promise<boolean> => {
    try {
      // Mock implementation - API endpoint not available yet
      console.log('Mock: Updating stock', itemId, quantity)
      queryClient.invalidateQueries({ queryKey: ['medication-inventory'] })
      return true
    } catch (error) {
      console.error('Error updating stock:', error)
      return false
    }
  }

  const disposeExpired = async (itemId: string): Promise<boolean> => {
    try {
      // Mock implementation - API endpoint not available yet
      console.log('Mock: Disposing expired medication', itemId)
      queryClient.invalidateQueries({ queryKey: ['medication-inventory'] })
      return true
    } catch (error) {
      console.error('Error disposing expired medication:', error)
      return false
    }
  }

  const markReminderCompleted = async (reminderId: string): Promise<boolean> => {
    try {
      // Mock implementation - API endpoint not available yet
      console.log('Mock: Marking reminder completed', reminderId)
      queryClient.invalidateQueries({ queryKey: ['medication-reminders'] })
      return true
    } catch (error) {
      console.error('Error marking reminder completed:', error)
      return false
    }
  }

  const markReminderMissed = async (reminderId: string): Promise<boolean> => {
    try {
      // Mock implementation - API endpoint not available yet
      console.log('Mock: Marking reminder missed', reminderId)
      queryClient.invalidateQueries({ queryKey: ['medication-reminders'] })
      return true
    } catch (error) {
      console.error('Error marking reminder missed:', error)
      return false
    }
  }


  const updateAdverseReaction = async (
    id: string,
    data: Partial<AdverseReactionFormData>
  ): Promise<boolean> => {
    try {
      // Mock implementation - API endpoint not available yet
      console.log('Mock: Updating adverse reaction', id, data)
      queryClient.invalidateQueries({ queryKey: ['adverse-reactions'] })
      return true
    } catch (error) {
      console.error('Error updating adverse reaction:', error)
      return false
    }
  }

  return {
    // Data
    medications: medicationsData?.data || [],
    inventory: inventoryData?.data || [],
    schedule: [],
    reminders: remindersData?.data || [],
    adverseReactions: adverseReactionsData?.data || [],
    alerts: alertsData?.data || [],
    stats: statsData?.data || null,

    // Loading states
    isLoading: medicationsLoading || inventoryLoading || remindersLoading || adverseReactionsLoading || statsLoading || alertsLoading,

    // Operations
    createMedication,
    reportAdverseReaction,
    refetch
  }
}