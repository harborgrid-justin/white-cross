/**
 * WF-COMP-341 | healthRecords.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import type { ConditionStatus, Vaccination, ConditionSeverity } from '../types/healthRecords'
import type { AllergySeverity } from '../services/modules/healthRecordsApi'

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const getSeverityColor = (severity: AllergySeverity): string => {
  switch (severity) {
    case 'LIFE_THREATENING':
      return 'text-red-600 bg-red-100'
    case 'SEVERE':
      return 'text-orange-600 bg-orange-100'
    case 'MODERATE':
      return 'text-yellow-600 bg-yellow-100'
    case 'MILD':
      return 'text-green-600 bg-green-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export const getConditionSeverityColor = (severity: ConditionSeverity): string => {
  switch (severity) {
    case 'CRITICAL':
      return 'text-red-600 bg-red-100'
    case 'SEVERE':
      return 'text-orange-600 bg-orange-100'
    case 'MODERATE':
      return 'text-yellow-600 bg-yellow-100'
    case 'MILD':
      return 'text-green-600 bg-green-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export const getStatusColor = (status: ConditionStatus): string => {
  switch (status) {
    case 'ACTIVE':
      return 'text-green-700 bg-green-100'
    case 'MANAGED':
      return 'text-blue-700 bg-blue-100'
    case 'RESOLVED':
      return 'text-gray-700 bg-gray-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export const getVaccinationStatusColor = (compliant: boolean): string => {
  return compliant 
    ? 'text-green-700 bg-green-100' 
    : 'text-orange-700 bg-orange-100'
}

export const getPriorityColor = (priority: 'High' | 'Medium' | 'Low'): string => {
  switch (priority) {
    case 'High':
      return 'text-red-700 bg-red-100'
    case 'Medium':
      return 'text-yellow-700 bg-yellow-100'
    case 'Low':
      return 'text-green-700 bg-green-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export const calculateBMI = (heightInches: number, weightPounds: number): number => {
  if (heightInches <= 0 || weightPounds <= 0) return 0
  const heightMeters = heightInches * 0.0254
  const weightKg = weightPounds * 0.453592
  return Math.round((weightKg / (heightMeters * heightMeters)) * 10) / 10
}

export const sortVaccinations = (
  vaccinations: Vaccination[],
  sortType: string
): Vaccination[] => {
  return [...vaccinations].sort((a, b) => {
    switch (sortType) {
      case 'date-desc':
        return new Date(b.administrationDate || '1900-01-01').getTime() -
               new Date(a.administrationDate || '1900-01-01').getTime()
      case 'date-asc':
        return new Date(a.administrationDate || '1900-01-01').getTime() -
               new Date(b.administrationDate || '1900-01-01').getTime()
      case 'name':
        return a.vaccineName.localeCompare(b.vaccineName)
      case 'status':
        const aStatus = a.complianceStatus === 'COMPLIANT' ? 'Completed' : 'Overdue';
        const bStatus = b.complianceStatus === 'COMPLIANT' ? 'Completed' : 'Overdue';
        return aStatus.localeCompare(bStatus)
      default:
        return 0
    }
  })
}

export const filterVaccinations = (
  vaccinations: Vaccination[],
  searchQuery: string,
  statusFilter: string
): Vaccination[] => {
  return vaccinations.filter(vax => {
    // Search filter
    if (searchQuery && !vax.vaccineName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    // Status filter
    if (statusFilter) {
      const status = vax.complianceStatus === 'COMPLIANT' ? 'Completed' : 'Overdue'
      if (status !== statusFilter) {
        return false
      }
    }
    return true
  })
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

export const validateRequired = (value: string | undefined | null): boolean => {
  return Boolean(value?.trim())
}

export const validateDateRange = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return true
  return new Date(startDate) <= new Date(endDate)
}

export const validateNumericRange = (
  value: number, 
  min: number, 
  max: number
): boolean => {
  return value >= min && value <= max
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
