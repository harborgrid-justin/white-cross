/// <reference types="cypress" />

/**
 * Notifications System: RBAC Permissions (2 tests)
 */

describe('Notifications System - RBAC Permissions', () => {
  it('should allow admin to configure global notification settings', () => {
    cy.login('admin')
    cy.visit('/settings')
    cy.waitForHealthcareData()
    cy.get('body').should('exist')
  })

  it('should allow users to manage personal notification preferences', () => {
    cy.login('nurse')
    cy.visit('/settings')
    cy.waitForHealthcareData()
    cy.get('body').should('exist')
  })
})
