import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { medicationsApi } from '../services/api'
import type {
  Medication,
  InventoryItem,
  MedicationReminder,
  AdverseReaction,
  MedicationStats,
  MedicationFormData,
  AdverseReactionFormData,
  UseMedicationsDataReturn
} from '../types/medications'

export const useMedicationsData = (): UseMedicationsDataReturn => {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  // Queries
  const { data: medicationsData, isLoading: medicationsLoading } = useQuery({
    queryKey: ['medications', currentPage, searchTerm],
    queryFn: () => medicationsApi.getAll(currentPage, 20, searchTerm)
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

  // Mock stats data for now until API is extended
  const statsData: MedicationStats = {
    totalMedications: medicationsData?.medications?.length || 0,
    controlledSubstances: medicationsData?.medications?.filter((m: any) => m.isControlled)?.length || 0,
    activePrescriptions: medicationsData?.medications?.reduce((sum: number, m: any) => sum + (m._count?.studentMedications || 0), 0) || 0,
    lowStockItems: inventoryData?.alerts?.lowStock?.length || 0,
    expiringItems: inventoryData?.alerts?.nearExpiry?.length || 0,
    todayReminders: remindersData?.reminders?.length || 0,
    adverseReactions: adverseReactionsData?.reactions?.length || 0
  }

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

  // Helper functions
  const loadMedications = (page = 1, limit = 20, search = '') => {
    setCurrentPage(page)
    setSearchTerm(search)
  }

  const loadInventory = () => {
    queryClient.invalidateQueries({ queryKey: ['medication-inventory'] })
  }

  const loadReminders = () => {
    queryClient.invalidateQueries({ queryKey: ['medication-reminders'] })
  }

  const loadAdverseReactions = () => {
    queryClient.invalidateQueries({ queryKey: ['adverse-reactions'] })
  }

  // CRUD operation wrappers
  const createMedication = async (data: MedicationFormData): Promise<boolean> => {
    try {
      await createMedicationMutation.mutateAsync(data)
      return true
    } catch (error) {
      console.error('Error creating medication:', error)
      return false
    }
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

  const reportAdverseReaction = async (data: AdverseReactionFormData): Promise<boolean> => {
    try {
      await reportAdverseReactionMutation.mutateAsync(data)
      return true
    } catch (error) {
      console.error('Error reporting adverse reaction:', error)
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
    medications: medicationsData?.medications || [],
    inventory: inventoryData?.inventory || [],
    reminders: remindersData?.reminders || [],
    adverseReactions: adverseReactionsData?.reactions || [],
    stats: statsData,

    // Loading states
    medicationsLoading,
    inventoryLoading,
    remindersLoading,
    adverseReactionsLoading,

    // CRUD operations
    createMedication,
    updateMedication,
    deleteMedication,

    // Inventory operations
    updateStock,
    disposeExpired,

    // Reminder operations
    markReminderCompleted,
    markReminderMissed,

    // Adverse reaction operations
    reportAdverseReaction,
    updateAdverseReaction,

    // Data loading
    loadMedications,
    loadInventory,
    loadReminders,
    loadAdverseReactions
  }
}