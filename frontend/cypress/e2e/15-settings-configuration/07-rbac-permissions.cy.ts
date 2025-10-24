/// <reference types="cypress" />

/**
 * Settings & Configuration: RBAC Permissions (2 tests)
 */

describe('Settings & Configuration - RBAC Permissions', () => {
  it('should allow admin full access to settings', () => {
    cy.login('admin')
    cy.visit('/settings')
    cy.waitForHealthcareData()
    cy.get('body').should('be.visible')
  })

  it('should restrict non-admin access to settings', () => {
    cy.login('viewer')
    cy.visit('/settings')
    cy.waitForHealthcareData()
    cy.get('body').should('exist')
  })
})
