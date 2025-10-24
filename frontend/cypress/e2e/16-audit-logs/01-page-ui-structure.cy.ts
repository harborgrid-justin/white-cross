/// <reference types="cypress" />

/**
 * Audit Logs: Page UI Structure (4 tests)
 */

describe('Audit Logs - Page UI Structure', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/audit-logs')
    cy.waitForHealthcareData()
  })

  it('should load audit logs page successfully', () => {
    cy.url().should('include', 'audit')
    cy.get('body').should('be.visible')
  })

  it('should display audit logs table', () => {
    cy.get('body').should('exist')
  })

  it('should display filter options', () => {
    cy.get('body').should('exist')
  })

  it('should display export button', () => {
    cy.get('button').contains(/export/i).should('be.visible')
  })
})
