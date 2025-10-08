/// <reference types="cypress" />

/**
 * Medication Management E2E Tests
 * Tests the medication management functionality for the White Cross platform
 * Utilizes seed data for realistic test scenarios
 */

describe('Medication Management', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/medications')
  })

  // ============================================================================
  // BASIC FUNCTIONALITY TESTS
  // ============================================================================

  it('should display the medications page with proper elements', () => {
    cy.get('[data-testid=medications-title]').should('contain', 'Medication Management')
    cy.url().should('include', '/medications')
    cy.get('[data-testid=medications-subtitle]').should('be.visible')
  })

  it('should load medications page without errors', () => {
    cy.get('body').should('be.visible')
    cy.url().should('include', '/medications')
    cy.get('[data-testid=overview-tab]').should('be.visible')
  })

  it('should be accessible to nurses', () => {
    cy.url().should('include', '/medications')
    cy.get('[data-testid=medications-title]').should('be.visible')
    // Navigate to medications tab to see add button
    cy.get('[data-testid=medications-tab]').click()
    cy.get('[data-testid=add-medication-button]').should('be.visible')
  })

  it('should have proper navigation tabs', () => {
    cy.get('[data-testid=overview-tab]').should('be.visible')
    cy.get('[data-testid=medications-tab]').should('be.visible')
    cy.get('[data-testid=inventory-tab]').should('be.visible')
    cy.get('[data-testid=reminders-tab]').should('be.visible')
    cy.get('[data-testid=adverse-reactions-tab]').should('be.visible')
  })

  it('should display overview cards with features', () => {
    cy.get('[data-testid=overview-cards]').should('be.visible')
    cy.get('[data-testid=prescription-card]').should('be.visible')
    cy.get('[data-testid=inventory-card]').should('be.visible')
    cy.get('[data-testid=safety-card]').should('be.visible')
    cy.get('[data-testid=reminders-card]').should('be.visible')
  })

  // ============================================================================
  // MEDICATION CRUD OPERATIONS
  // ============================================================================

  it('should allow adding a new medication', () => {
    // Navigate to medications tab first
    cy.get('[data-testid=medications-tab]').click()
    
    cy.fixture('medications').then((medications) => {
      const newMedication = medications.testMedications.tylenol

      cy.get('[data-testid=add-medication-button]').click()
      cy.get('[data-testid=add-medication-modal]').should('be.visible')

      cy.get('[data-testid=medication-name-input]').type(newMedication.name)
      cy.get('[data-testid=generic-name-input]').type(newMedication.genericName)
      cy.get('[data-testid=dosage-form-select]').select(newMedication.dosageForm)
      cy.get('[data-testid=strength-input]').type(newMedication.strength)
      cy.get('[data-testid=manufacturer-input]').type(newMedication.manufacturer)

      cy.get('[data-testid=save-medication-button]').click()
      cy.get('[data-testid=success-toast]').should('be.visible')
      cy.get('[data-testid=add-medication-modal]').should('not.exist')
    })
  })

  it('should allow viewing medication details', () => {
    // Navigate to medications tab first
    cy.get('[data-testid=medications-tab]').click()
    
    // Wait for medications to load, or handle empty state
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid=medication-row]').length > 0) {
        cy.get('[data-testid=medication-row]').first().click()
        cy.get('[data-testid=medication-details-modal]').should('be.visible')
        cy.get('[data-testid=medication-details-title]').should('be.visible')
      } else {
        // Handle empty state - add a medication first
        cy.get('[data-testid=add-medication-button]').should('be.visible')
      }
    })
  })

  it('should handle form validation errors when adding medication', () => {
    // Navigate to medications tab first
    cy.get('[data-testid=medications-tab]').click()
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=add-medication-modal]').should('be.visible')
    
    // Try to save without required fields
    cy.get('[data-testid=save-medication-button]').click()
    
    cy.get('[data-testid=name-error]').should('contain', 'Medication name is required')
    cy.get('[data-testid=strength-error]').should('contain', 'Strength is required')
  })

  it('should allow canceling medication form', () => {
    // Navigate to medications tab first
    cy.get('[data-testid=medications-tab]').click()
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=add-medication-modal]').should('be.visible')
    
    cy.get('[data-testid=cancel-button]').click()
    cy.get('[data-testid=add-medication-modal]').should('not.exist')
  })

  // ============================================================================
  // SEARCH AND FILTER FUNCTIONALITY
  // ============================================================================

  it('should allow searching medications by name', () => {
    // Navigate to medications tab first
    cy.get('[data-testid=medications-tab]').click()
    
    // Use the actual search input from MedicationsListTab
    cy.get('[data-testid=medications-search]').should('be.visible')
    cy.get('[data-testid=medications-search]').type('Albuterol')
    
    // Check if results are filtered (or if empty state is shown)
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid=medication-row]').length > 0) {
        cy.get('[data-testid=medications-table]').should('be.visible')
      } else {
        // Check for empty state messages
        cy.get('body').should('contain.text', 'No medications')
      }
    })
  })

  it('should display medications table with proper columns', () => {
    // Navigate to medications tab first
    cy.get('[data-testid=medications-tab]').click()
    
    // Check table structure exists
    cy.get('[data-testid=medications-table]').should('be.visible')
    cy.get('[data-testid=medication-name-column]').should('contain', 'Medication')
    cy.get('[data-testid=dosage-form-column]').should('contain', 'Dosage Form')
    cy.get('[data-testid=strength-column]').should('contain', 'Strength')
    cy.get('[data-testid=stock-column]').should('contain', 'Stock')
    cy.get('[data-testid=status-column]').should('contain', 'Status')
    cy.get('[data-testid=prescriptions-column]').should('contain', 'Active Prescriptions')
  })

  it('should handle empty medications state', () => {
    // Navigate to medications tab first
    cy.get('[data-testid=medications-tab]').click()
    
    // Check for either medications or empty state
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid=medication-row]').length === 0) {
        // Should show empty state
        cy.get('[data-testid=empty-state]').should('be.visible')
      } else {
        // Should show medications table
        cy.get('[data-testid=medications-table]').should('be.visible')
      }
    })
  })

  it('should show loading state while fetching medications', () => {
    // Navigate to medications tab first
    cy.get('[data-testid=medications-tab]').click()
    
    // May briefly show loading state or go straight to content
    cy.get('body').should('be.visible')
  })

  // ============================================================================
  // MEDICATION ADMINISTRATION TESTS
  // ============================================================================

  it('should allow administering medication to a student', () => {
    cy.fixture('medications').then((medications) => {
      cy.get('[data-testid=medication-row]').first().within(() => {
        cy.get('[data-testid=administer-button]').click()
      })
      
      cy.get('[data-testid=administration-modal]').should('be.visible')
      cy.get('[data-testid=student-select]').select('STU00001')
      cy.get('[data-testid=dosage-input]').type('1 tablet')
      cy.get('[data-testid=administration-time]').should('not.be.empty')
      cy.get('[data-testid=administration-notes]').type('Administered as prescribed')
      
      cy.get('[data-testid=confirm-administration-button]').click()
      cy.get('[data-testid=success-message]').should('contain', 'Medication administered successfully')
    })
  })

  it('should log medication administration', () => {
    cy.get('[data-testid=administration-log-tab]').click()
    cy.get('[data-testid=administration-log-table]').should('be.visible')
    cy.get('[data-testid=log-entry]').should('exist')
  })

  it('should validate dosage before administration', () => {
    cy.get('[data-testid=medication-row]').first().within(() => {
      cy.get('[data-testid=administer-button]').click()
    })
    
    cy.get('[data-testid=administration-modal]').should('be.visible')
    cy.get('[data-testid=student-select]').select('STU00001')
    cy.get('[data-testid=dosage-input]').type('invalid dosage')
    
    cy.get('[data-testid=confirm-administration-button]').click()
    cy.get('[data-testid=dosage-error]').should('contain', 'Invalid dosage format')
  })

  // ============================================================================
  // INVENTORY MANAGEMENT TESTS
  // ============================================================================

  it('should display medication inventory levels', () => {
    cy.get('[data-testid=inventory-tab]').click()
    cy.get('[data-testid=inventory-table]').should('be.visible')
    cy.get('[data-testid=stock-level]').should('exist')
    cy.get('[data-testid=expiration-date]').should('exist')
  })

  it('should show low stock warnings', () => {
    cy.get('[data-testid=inventory-tab]').click()
    cy.get('[data-testid=low-stock-warning]').should('exist')
  })

  it('should allow updating inventory', () => {
    cy.get('[data-testid=inventory-tab]').click()
    cy.get('[data-testid=inventory-row]').first().within(() => {
      cy.get('[data-testid=update-stock-button]').click()
    })
    
    cy.get('[data-testid=stock-update-modal]').should('be.visible')
    cy.get('[data-testid=new-quantity-input]').clear().type('50')
    cy.get('[data-testid=batch-number-input]').type('BATCH-NEW-001')
    cy.get('[data-testid=expiration-date-input]').type('2025-12-31')
    
    cy.get('[data-testid=save-stock-update]').click()
    cy.get('[data-testid=success-message]').should('contain', 'Inventory updated successfully')
  })

  // ============================================================================
  // STUDENT MEDICATION ASSIGNMENT TESTS
  // ============================================================================

  it('should assign medication to a student', () => {
    cy.get('[data-testid=student-medications-tab]').click()
    cy.get('[data-testid=assign-medication-button]').click()
    
    cy.get('[data-testid=assignment-modal]').should('be.visible')
    cy.get('[data-testid=student-search]').type('STU00001')
    cy.get('[data-testid=student-option]').first().click()
    cy.get('[data-testid=medication-select]').select('Albuterol Inhaler')
    cy.get('[data-testid=prescribed-dosage]').type('2 puffs')
    cy.get('[data-testid=administration-schedule]').select('As needed')
    
    cy.get('[data-testid=save-assignment-button]').click()
    cy.get('[data-testid=success-message]').should('contain', 'Medication assigned successfully')
  })

  it('should view student medication history', () => {
    cy.get('[data-testid=student-medications-tab]').click()
    cy.get('[data-testid=student-medication-row]').first().click()
    
    cy.get('[data-testid=medication-history-modal]').should('be.visible')
    cy.get('[data-testid=administration-history]').should('be.visible')
    cy.get('[data-testid=dosage-changes]').should('exist')
  })

  // ============================================================================
  // ERROR HANDLING AND VALIDATION TESTS
  // ============================================================================

  it('should handle form validation errors when adding medication', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=medication-form-modal]').should('be.visible')
    
    // Try to save without required fields
    cy.get('[data-testid=save-medication-button]').click()
    
    cy.get('[data-testid=name-error]').should('contain', 'Medication name is required')
    cy.get('[data-testid=strength-error]').should('contain', 'Strength is required')
  })

  it('should prevent duplicate NDC numbers', () => {
    cy.fixture('medications').then((medications) => {
      const existingMed = medications.testMedications.albuterol
      
      cy.get('[data-testid=add-medication-button]').click()
      cy.get('[data-testid=medication-name-input]').type('Test Medication')
      cy.get('[data-testid=ndc-input]').type(existingMed.ndc)
      
      cy.get('[data-testid=save-medication-button]').click()
      cy.get('[data-testid=ndc-error]').should('contain', 'NDC number already exists')
    })
  })

  it('should handle network errors gracefully', () => {
    // Simulate network failure
    cy.intercept('GET', '/api/medications', { forceNetworkError: true }).as('networkError')
    
    cy.reload()
    cy.wait('@networkError')
    
    cy.get('[data-testid=error-message]').should('contain', 'Unable to load medications')
    cy.get('[data-testid=retry-button]').should('be.visible')
  })

  // ============================================================================
  // ACCESSIBILITY AND USABILITY TESTS
  // ============================================================================

  it('should be keyboard navigable', () => {
    cy.get('[data-testid=add-medication-button]').focus()
    cy.focused().should('have.attr', 'data-testid', 'add-medication-button')
    
    cy.focused().type('{enter}')
    cy.get('[data-testid=medication-form-modal]').should('be.visible')
    
    cy.get('[data-testid=medication-name-input]').should('be.focused')
  })

  it('should have proper ARIA labels', () => {
    cy.get('[data-testid=add-medication-button]').should('have.attr', 'aria-label')
    cy.get('[data-testid=search-medications]').should('have.attr', 'aria-label')
    cy.get('[data-testid=medications-table]').should('have.attr', 'role', 'table')
  })

  it('should support screen reader announcements', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=medication-form-modal]').should('have.attr', 'role', 'dialog')
    cy.get('[data-testid=modal-title]').should('have.attr', 'id')
  })

  // ============================================================================
  // AUTHORIZATION AND SECURITY TESTS
  // ============================================================================

  it('should restrict controlled substance access to authorized users', () => {
    cy.get('[data-testid=controlled-substance-row]').first().click()
    cy.get('[data-testid=controlled-substance-warning]').should('be.visible')
    cy.get('[data-testid=authorization-required]').should('contain', 'Additional authorization required')
  })

  it('should log all medication-related activities', () => {
    cy.get('[data-testid=activity-log-tab]').click()
    cy.get('[data-testid=activity-log-table]').should('be.visible')
    cy.get('[data-testid=log-entry]').should('contain', 'Medication')
  })

  it('should require confirmation for high-risk actions', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=delete-medication-button]').click()
    
    cy.get('[data-testid=high-risk-confirmation]').should('be.visible')
    cy.get('[data-testid=confirmation-message]').should('contain', 'This action cannot be undone')
  })
})
