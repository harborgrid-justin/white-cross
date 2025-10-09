/// <reference types="cypress" />

/**
 * Medication Management: Medication Deletion (CRUD - Delete) (10 tests)
 *
 * Tests medication deletion functionality
 */

describe('Medication Management - Medication Deletion (CRUD - Delete)', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/medications')
    cy.get('[data-testid=medications-tab]').click()
  })

  it('should display delete button for admin users', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=delete-medication-button]').should('be.visible')
  })

  it('should show confirmation modal when delete is clicked', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=delete-medication-button]').click()
    cy.get('[data-testid=confirm-delete-modal]').should('be.visible')
  })

  it('should display warning message in confirmation', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=delete-medication-button]').click()
    cy.get('[data-testid=confirm-delete-message]').should('contain', 'This action cannot be undone')
  })

  it('should successfully delete medication when confirmed', () => {
    cy.get('[data-testid=medication-row]').first().within(() => {
      cy.get('[data-testid=medication-name]').invoke('text').as('medName')
    })

    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=delete-medication-button]').click()
    cy.get('[data-testid=confirm-delete-button]').click()

    cy.get('@medName').then((medName) => {
      cy.get('[data-testid=medications-table]').should('not.contain', medName)
    })
  })

  it('should cancel deletion when cancel is clicked', () => {
    const initialCount = Cypress.$('[data-testid=medication-row]').length

    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=delete-medication-button]').click()
    cy.get('[data-testid=cancel-delete-button]').click()

    cy.get('[data-testid=medication-row]').should('have.length', initialCount)
  })

  it('should prevent deletion if medication has active prescriptions', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=delete-medication-button]').click()
    cy.get('[data-testid=confirm-delete-button]').click()

    cy.get('[data-testid=error-message]').should('contain', 'Cannot delete medication with active prescriptions')
  })

  it('should display success message after deletion', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=delete-medication-button]').click()
    cy.get('[data-testid=confirm-delete-button]').click()

    cy.get('[data-testid=success-toast]').should('contain', 'Medication deleted successfully')
  })

  it('should close confirmation modal when canceled', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=delete-medication-button]').click()
    cy.get('[data-testid=confirm-delete-modal]').should('be.visible')
    cy.get('[data-testid=cancel-delete-button]').click()
    cy.get('[data-testid=confirm-delete-modal]').should('not.exist')
  })

  it('should require additional confirmation for controlled substances', () => {
    cy.get('[data-testid=controlled-substance-row]').first().click()
    cy.get('[data-testid=delete-medication-button]').click()
    cy.get('[data-testid=controlled-substance-warning]').should('be.visible')
  })

  it('should create audit log when medication is deleted', () => {
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=delete-medication-button]').click()
    cy.get('[data-testid=confirm-delete-button]').click()

    cy.wait('@auditLog').its('request.body').should('deep.include', {
      action: 'DELETE_MEDICATION',
      resourceType: 'MEDICATION'
    })
  })
})
