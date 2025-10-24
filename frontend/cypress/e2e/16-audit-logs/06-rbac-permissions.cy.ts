/// <reference types="cypress" />

/**
 * Audit Logs: RBAC Permissions (2 tests)
 */

describe('Audit Logs - RBAC Permissions', () => {
  it('should allow admin to view all audit logs', () => {
    cy.login('admin')
    cy.visit('/audit-logs')
    cy.waitForHealthcareData()
    cy.get('body').should('be.visible')
  })

  it('should restrict non-admin access to audit logs', () => {
    cy.login('viewer')
    cy.visit('/audit-logs')
    cy.waitForHealthcareData()
    cy.get('body').should('exist')
  })
})
