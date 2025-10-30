/**
 * WF-COMP-130 | useFormValidation.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: useState
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { useState } from 'react'
import type { 
  AllergyFormErrors, 
  ConditionFormErrors, 
  VaccinationFormErrors,
  GrowthMeasurementFormErrors 
} from '@/types/healthRecords'

export const useFormValidation = () => {
  const [errors, setErrors] = useState<any>({})

  const validateAllergyForm = (formData: FormData): AllergyFormErrors => {
    const errors: AllergyFormErrors = {}
    const allergen = formData.get('allergen') as string
    const severity = formData.get('severity') as string
    
    if (!allergen?.trim()) {
      errors.allergen = 'Allergen is required'
    }
    if (!severity) {
      errors.severity = 'Severity is required'
    }
    
    return errors
  }
  
  const validateConditionForm = (formData: FormData): ConditionFormErrors => {
    const errors: ConditionFormErrors = {}
    const condition = formData.get('condition') as string
    const diagnosedDate = formData.get('diagnosedDate') as string
    
    if (!condition?.trim()) {
      errors.condition = 'Condition name is required'
    }
    if (!diagnosedDate) {
      errors.diagnosedDate = 'Diagnosed date is required'
    }
    
    return errors
  }

  const validateVaccinationForm = (vaccinationName: string, dateAdministered: string, provider: string, dose: string): VaccinationFormErrors => {
    const errors: VaccinationFormErrors = {}
    
    if (!vaccinationName?.trim()) {
      errors.vaccineName = 'Vaccination name is required'
    }
    if (!dateAdministered) {
      errors.dateAdministered = 'Date administered is required'
    }
    if (!provider?.trim()) {
      errors.administeredBy = 'Provider is required'
    }
    if (!dose?.trim()) {
      errors.dose = 'Dose information is required'
    }
    
    return errors
  }

  const validateGrowthMeasurement = (height: number, weight: number): GrowthMeasurementFormErrors => {
    const errors: GrowthMeasurementFormErrors = {}
    
    if (height < 10 || height > 84) {
      errors.height = 'Height must be between 10 and 84 inches'
    }
    if (weight < 5 || weight > 300) {
      errors.weight = 'Weight must be between 5 and 300 pounds'
    }
    
    return errors
  }

  const displayValidationErrors = (validationErrors: any, prefix: string = '') => {
    // Clear previous errors
    document.querySelectorAll('[data-testid$="-error"]').forEach(el => {
      el.classList.add('hidden')
    })
    
    // Show new validation errors
    Object.keys(validationErrors).forEach(key => {
      const errorElement = document.querySelector(`[data-testid="${prefix}${key}-error"]`)
      if (errorElement) {
        errorElement.classList.remove('hidden')
        errorElement.textContent = validationErrors[key]
      }
    })
    
    setErrors(validationErrors)
  }

  const clearErrors = () => {
    document.querySelectorAll('[data-testid$="-error"]').forEach(el => {
      el.classList.add('hidden')
    })
    setErrors({})
  }

  return {
    errors,
    validateAllergyForm,
    validateConditionForm,
    validateVaccinationForm,
    validateGrowthMeasurement,
    displayValidationErrors,
    clearErrors,
  }
}
