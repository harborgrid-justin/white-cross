/**
 * WF-COMP-344 | medications.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../constants/medications | Dependencies: ../constants/medications
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import {
  DATE_FORMATS,
  EXPIRATION_WARNINGS,
  STOCK_THRESHOLDS,
  SEVERITY_LEVELS,
  MEDICATION_STATUSES,
  INVENTORY_STATUSES
} from '@/constants/medications';

import type {
  Medication,
  MedicationReminder,
  Priority
} from '@/types/api';

/**
 * Date formatting utilities
 */
export const formatDate = (date: string | Date, format: keyof typeof DATE_FORMATS = 'display'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date'
    }
    
    switch (format) {
      case 'display':
        return dateObj.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: '2-digit' 
        })
      case 'input':
        return dateObj.toISOString().split('T')[0]
      case 'datetime':
        return dateObj.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      case 'time':
        return dateObj.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      default:
        return dateObj.toLocaleDateString()
    }
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'Invalid Date'
  }
}

/**
 * Calculate days until expiration
 */
export const getDaysUntilExpiration = (expirationDate: string): number => {
  try {
    const expDate = new Date(expirationDate)
    const today = new Date()
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0)
    expDate.setHours(0, 0, 0, 0)
    
    const diffTime = expDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  } catch (error) {
    console.error('Date calculation error:', error)
    return -1
  }
}

/**
 * Get expiration status with color coding
 */
export const getExpirationStatus = (expirationDate: string): {
  status: 'expired' | 'critical' | 'warning' | 'notice' | 'good'
  daysUntil: number
  color: string
  message: string
} => {
  const daysUntil = getDaysUntilExpiration(expirationDate)
  
  if (daysUntil < 0) {
    return {
      status: 'expired',
      daysUntil: Math.abs(daysUntil),
      color: 'text-red-700 bg-red-100',
      message: `Expired ${Math.abs(daysUntil)} days ago`
    }
  }
  
  if (daysUntil <= EXPIRATION_WARNINGS.critical) {
    return {
      status: 'critical',
      daysUntil,
      color: 'text-red-600 bg-red-100',
      message: `Expires in ${daysUntil} days`
    }
  }
  
  if (daysUntil <= EXPIRATION_WARNINGS.warning) {
    return {
      status: 'warning',
      daysUntil,
      color: 'text-yellow-600 bg-yellow-100',
      message: `Expires in ${daysUntil} days`
    }
  }
  
  if (daysUntil <= EXPIRATION_WARNINGS.notice) {
    return {
      status: 'notice',
      daysUntil,
      color: 'text-blue-600 bg-blue-100',
      message: `Expires in ${daysUntil} days`
    }
  }
  
  return {
    status: 'good',
    daysUntil,
    color: 'text-green-600 bg-green-100',
    message: `Expires in ${daysUntil} days`
  }
}

/**
 * Get stock level status
 */
export const getStockStatus = (quantity: number, reorderLevel?: number): {
  status: 'out-of-stock' | 'critical' | 'low' | 'good'
  color: string
  message: string
} => {
  if (quantity <= 0) {
    return {
      status: 'out-of-stock',
      color: 'text-red-600 bg-red-100',
      message: 'Out of stock'
    }
  }
  
  if (quantity <= STOCK_THRESHOLDS.critical) {
    return {
      status: 'critical',
      color: 'text-red-600 bg-red-100',
      message: 'Critical stock level'
    }
  }
  
  const threshold = reorderLevel || STOCK_THRESHOLDS.low
  if (quantity <= threshold) {
    return {
      status: 'low',
      color: 'text-yellow-600 bg-yellow-100',
      message: 'Low stock'
    }
  }
  
  return {
    status: 'good',
    color: 'text-green-600 bg-green-100',
    message: 'In stock'
  }
}

/**
 * Calculate medication strength in a standard format
 */
export const parseAndFormatStrength = (strength: string): {
  value: number
  unit: string
  formatted: string
} => {
  try {
    // Extract numeric value and unit from strength string
    const match = strength.match(/^(\d+(?:\.\d+)?)\s*(.+)$/)
    
    if (!match) {
      return {
        value: 0,
        unit: '',
        formatted: strength
      }
    }
    
    const value = parseFloat(match[1])
    const unit = match[2].trim()
    
    return {
      value,
      unit,
      formatted: `${value} ${unit}`
    }
  } catch (error) {
    console.error('Strength parsing error:', error)
    return {
      value: 0,
      unit: '',
      formatted: strength
    }
  }
}

/**
 * Calculate total medication inventory
 */
export const calculateTotalInventory = (medication: Medication): {
  totalQuantity: number
  totalBatches: number
  nearExpiry: number
  expired: number
  lowStock: number
} => {
  // Check if medication has inventory property (it might be optional in the type)
  const inventory = (medication as any).inventory || []

  if (!inventory || inventory.length === 0) {
    return { totalQuantity: 0, totalBatches: 0, nearExpiry: 0, expired: 0, lowStock: 0 }
  }

  let totalQuantity = 0
  let nearExpiry = 0
  let expired = 0
  let lowStock = 0

  inventory.forEach((item: any) => {
    totalQuantity += item.quantity || 0

    const expirationStatus = getExpirationStatus(item.expirationDate)
    if (expirationStatus.status === 'expired') {
      expired++
    } else if (expirationStatus.status === 'critical' || expirationStatus.status === 'warning') {
      nearExpiry++
    }

    const stockStatus = getStockStatus(item.quantity || 0, item.reorderLevel)
    if (stockStatus.status === 'critical' || stockStatus.status === 'low') {
      lowStock++
    }
  })

  return {
    totalQuantity,
    totalBatches: inventory.length,
    nearExpiry,
    expired,
    lowStock
  }
}

/**
 * Get severity level color
 *
 * @param {Priority} severity - The severity level priority
 * @returns {string} CSS classes for the severity color
 */
export const getSeverityColor = (severity: Priority): string => {
  const severityConfig = SEVERITY_LEVELS.find((level: { value: Priority; color: string }) => level.value === severity)
  return severityConfig?.color || 'text-gray-600 bg-gray-100'
}

/**
 * Get medication status color
 *
 * @param {string} status - The medication status value
 * @returns {string} CSS classes for the status color
 */
export const getMedicationStatusColor = (status: string): string => {
  const statusConfig = MEDICATION_STATUSES.find((s: { value: string; color: string }) => s.value === status)
  return statusConfig?.color || 'text-gray-600 bg-gray-100'
}

/**
 * Get inventory status color
 *
 * @param {string} status - The inventory status value
 * @returns {string} CSS classes for the inventory status color
 */
export const getInventoryStatusColor = (status: string): string => {
  const statusConfig = INVENTORY_STATUSES.find((s: { value: string; color: string }) => s.value === status)
  return statusConfig?.color || 'text-gray-600 bg-gray-100'
}

/**
 * Generate medication display name
 */
export const getMedicationDisplayName = (medication: Medication): string => {
  if (medication.genericName && medication.genericName !== medication.name) {
    return `${medication.name} (${medication.genericName})`
  }
  return medication.name
}

/**
 * Calculate next reminder time
 */
export const getNextReminderTime = (reminders: MedicationReminder[]): Date | null => {
  if (!reminders || reminders.length === 0) {
    return null
  }
  
  const pendingReminders = reminders
    .filter(reminder => reminder.status === 'PENDING')
    .map(reminder => new Date(reminder.scheduledTime))
    .sort((a, b) => a.getTime() - b.getTime())
  
  return pendingReminders[0] || null
}

/**
 * Search and filter medications
 */
export const filterMedications = (
  medications: Medication[],
  searchTerm: string,
  filters?: {
    dosageForm?: string
    isControlled?: boolean
    hasLowStock?: boolean
    hasExpiredItems?: boolean
  }
): Medication[] => {
  let filtered = medications
  
  // Text search
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase()
    filtered = filtered.filter(med => 
      med.name.toLowerCase().includes(term) ||
      med.genericName?.toLowerCase().includes(term) ||
      med.manufacturer?.toLowerCase().includes(term)
    )
  }
  
  // Apply filters
  if (filters) {
    if (filters.dosageForm) {
      filtered = filtered.filter(med => med.dosageForm === filters.dosageForm)
    }
    
    if (filters.isControlled !== undefined) {
      filtered = filtered.filter(med => med.isControlled === filters.isControlled)
    }
    
    if (filters.hasLowStock) {
      filtered = filtered.filter(med => {
        const inventory = calculateTotalInventory(med)
        return inventory.lowStock > 0
      })
    }
    
    if (filters.hasExpiredItems) {
      filtered = filtered.filter(med => {
        const inventory = calculateTotalInventory(med)
        return inventory.expired > 0 || inventory.nearExpiry > 0
      })
    }
  }
  
  return filtered
}

/**
 * Generate medication summary statistics
 */
export const getMedicationStats = (medications: Medication[]) => {
  const totalMedications = medications.length
  const controlledMedications = medications.filter(med => med.isControlled).length
  
  let totalInventoryItems = 0
  let lowStockItems = 0
  let expiredItems = 0
  let nearExpiryItems = 0
  
  medications.forEach(med => {
    const inventory = calculateTotalInventory(med)
    totalInventoryItems += inventory.totalBatches
    lowStockItems += inventory.lowStock
    expiredItems += inventory.expired
    nearExpiryItems += inventory.nearExpiry
  })
  
  return {
    totalMedications,
    controlledMedications,
    totalInventoryItems,
    lowStockItems,
    expiredItems,
    nearExpiryItems,
    percentageControlled: totalMedications > 0 ? Math.round((controlledMedications / totalMedications) * 100) : 0
  }
}

/**
 * Validate medication data
 */
export const validateMedicationData = (data: Partial<Medication>): string[] => {
  const errors: string[] = []
  
  if (!data.name?.trim()) {
    errors.push('Medication name is required')
  }
  
  if (!data.dosageForm) {
    errors.push('Dosage form is required')
  }
  
  if (!data.strength?.trim()) {
    errors.push('Strength is required')
  }
  
  return errors
}

/**
 * Format medication for display in lists/tables
 */
export const formatMedicationForDisplay = (medication: Medication) => {
  const inventory = calculateTotalInventory(medication)
  const displayName = getMedicationDisplayName(medication)

  return {
    ...medication,
    displayName,
    // Add display-specific properties without modifying the original type
    _display: {
      inventory: {
        ...inventory,
        status: getStockStatus(inventory.totalQuantity)
      }
    }
  }
}
