/// <reference types="cypress" />

/**
 * Medication Management: Medication Viewing & Details (CRUD - Read) (12 tests)
 *
 * Tests medication viewing and detail display functionality
 */

describe('Medication Management - Medication Viewing & Details (CRUD - Read)', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/medications')
    cy.get('[data-testid=medications-tab]').click()
  })

  it('should display list of medications', () => {
    cy.get('[data-testid=medications-table]').should('be.visible')
    cy.get('[data-testid=medication-row]').should('have.length.greaterThan', 0)
  })

  it('should display medication name in each row', () => {
    cy.get('[data-testid=medication-row]').first().within(() => {
      cy.get('[data-testid=medication-name]').should('be.visible')
    })
  })

  it('should display medication strength in each row', () => {
    cy.get('[data-testid=medication-row]').first().within(() => {
      cy.get('[data-testid=medication-strength]').should('be.visible')
    })
  })

  it('should display stock level in each row', () => {
    cy.get('[data-testid=medication-row]').first().within(() => {
      cy.get('[data-testid=stock-level]').should('be.visible')
    })
  })

  it('should open details modal when row is clicked', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=medication-details-modal]').should('be.visible')
  })

  it('should display complete medication information in details', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=medication-details-title]').should('be.visible')
    cy.get('[data-testid=generic-name-display]').should('be.visible')
    cy.get('[data-testid=dosage-form-display]').should('be.visible')
    cy.get('[data-testid=strength-display]').should('be.visible')
  })

  it('should display NDC number in details', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=ndc-display]').should('be.visible')
  })

  it('should display manufacturer information', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=manufacturer-display]').should('be.visible')
  })

  it('should display controlled substance indicator if applicable', () => {
    cy.get('[data-testid=controlled-substance-indicator]').should('exist')
  })

  it('should close details modal when close button is clicked', () => {
    cy.get('[data-testid=medication-row]').first().click()
    cy.get('[data-testid=medication-details-modal]').should('be.visible')
    cy.get('[data-testid=close-details-button]').click()
    cy.get('[data-testid=medication-details-modal]').should('not.exist')
  })

  it('should display active prescriptions count', () => {
    cy.get('[data-testid=medication-row]').first().within(() => {
      cy.get('[data-testid=active-prescriptions]').should('be.visible')
    })
  })

  it('should create audit log when viewing medication details', () => {
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.get('[data-testid=medication-row]').first().click()

    cy.wait('@auditLog').its('request.body').should('deep.include', {
      action: 'VIEW_MEDICATION',
      resourceType: 'MEDICATION'
    })
  })
})
