// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add global error handling for uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Healthcare apps may have non-critical third-party errors
  // Return false to prevent Cypress from failing the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false
  }
  return true
})

// Add support for coverage if needed
beforeEach(() => {
  // Reset any test state
  cy.clearCookies()
  cy.clearLocalStorage()
})

// Add global types for better TypeScript support
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>
      loginAsNurse(): Chainable<void>
      loginAsAdmin(): Chainable<void>
      waitForStudentTable(): Chainable<void>
      interceptStudentAPI(): Chainable<void>
      createTestStudent(student?: Partial<Student>): Chainable<void>
      deleteTestStudent(studentId: string): Chainable<void>
      seedStudentData(): Chainable<void>
      cleanupTestData(): Chainable<void>
    }
  }
}

export interface Student {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  grade: string
  studentId: string
  email?: string
  phone?: string
  emergencyContacts: EmergencyContact[]
  medicalConditions?: MedicalCondition[]
  allergies?: Allergy[]
  medications?: Medication[]
}

export interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  email?: string
  isPrimary: boolean
}

export interface MedicalCondition {
  id: string
  condition: string
  description?: string
  severity: 'low' | 'medium' | 'high'
}

export interface Allergy {
  id: string
  allergen: string
  severity: 'mild' | 'moderate' | 'severe'
  reaction?: string
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  prescribedBy: string
}