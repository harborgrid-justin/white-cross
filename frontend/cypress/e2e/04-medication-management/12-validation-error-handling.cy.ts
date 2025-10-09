/// <reference types="cypress" />

/**
 * Medication Management: Data Validation & Error Handling (10 tests)
 *
 * Tests data validation and error handling scenarios
 */

describe('Medication Management - Data Validation & Error Handling', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/medications')
    cy.get('[data-testid=medications-tab]').click()
  })

  it('should require medication name', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=save-medication-button]').click()
    cy.get('[data-testid=name-error]').should('contain', 'Medication name is required')
  })

  it('should require strength', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=save-medication-button]').click()
    cy.get('[data-testid=strength-error]').should('contain', 'Strength is required')
  })

  it('should validate NDC format', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=ndc-input]').type('invalid-ndc')
    cy.get('[data-testid=save-medication-button]').click()
    cy.get('[data-testid=ndc-error]').should('contain', 'Invalid NDC format')
  })

  it('should validate strength format', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=medication-name-input]').type('Test Med')
    cy.get('[data-testid=strength-input]').type('invalid')
    cy.get('[data-testid=save-medication-button]').click()
    cy.get('[data-testid=strength-error]').should('contain', 'Invalid strength format')
  })

  it('should handle network errors gracefully', () => {
    cy.intercept('POST', '/api/medications', { statusCode: 500 }).as('createMedication')

    cy.fixture('medications').then((medications) => {
      const newMedication = medications.testMedications.tylenol

      cy.get('[data-testid=add-medication-button]').click()
      cy.get('[data-testid=medication-name-input]').type(newMedication.name)
      cy.get('[data-testid=strength-input]').type(newMedication.strength)
      cy.get('[data-testid=save-medication-button]').click()

      cy.wait('@createMedication')
      cy.get('[data-testid=error-message]').should('contain', 'Failed to create medication')
    })
  })

  it('should display all validation errors simultaneously', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=save-medication-button]').click()

    cy.get('[data-testid=name-error]').should('be.visible')
    cy.get('[data-testid=strength-error]').should('be.visible')
  })

  it('should prevent XSS in medication name', () => {
    cy.get('[data-testid=add-medication-button]').click()
    cy.get('[data-testid=medication-name-input]').type('<script>alert("xss")</script>')
    cy.get('[data-testid=strength-input]').type('500mg')
    cy.get('[data-testid=save-medication-button]').click()

    cy.get('[data-testid=medications-table]').should('not.contain', '<script>')
  })

  it('should validate maximum name length', () => {
    cy.get('[data-testid=add-medication-button]').click()
    const longName = 'a'.repeat(300)
    cy.get('[data-testid=medication-name-input]').type(longName)
    cy.get('[data-testid=save-medication-button]').click()
    cy.get('[data-testid=name-error]').should('contain', 'maximum')
  })

  it('should handle server unavailability', () => {
    cy.intercept('GET', '/api/medications*', { forceNetworkError: true }).as('getMedications')

    cy.visit('/medications')
    cy.get('[data-testid=medications-tab]').click()
    cy.get('[data-testid=error-message]').should('contain', 'Unable to load medications')
  })

  it('should validate positive stock quantities', () => {
    cy.get('[data-testid=inventory-tab]').click()
    cy.get('[data-testid=inventory-row]').first().within(() => {
      cy.get('[data-testid=update-stock-button]').click()
    })

    cy.get('[data-testid=new-quantity-input]').type('-50')
    cy.get('[data-testid=save-stock-update]').click()
    cy.get('[data-testid=quantity-error]').should('contain', 'Quantity must be positive')
  })
})
