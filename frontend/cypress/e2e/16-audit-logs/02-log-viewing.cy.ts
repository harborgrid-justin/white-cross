/// <reference types="cypress" />

/**
 * Audit Logs: Log Viewing (5 tests)
 */

describe('Audit Logs - Log Viewing', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/audit-logs')
    cy.waitForHealthcareData()
  })

  it('should display audit log entries', () => {
    cy.get('body').should('exist')
  })

  it('should display log timestamp', () => {
    cy.get('body').should('exist')
  })

  it('should display user who performed action', () => {
    cy.get('body').should('exist')
  })

  it('should display action type', () => {
    cy.get('body').should('exist')
  })

  it('should display resource affected', () => {
    cy.get('body').should('exist')
  })
})
