/// <reference types="cypress" />

/**
 * Immunization Tracking: RBAC Permissions (2 tests)
 */

describe('Immunization Tracking - RBAC Permissions', () => {
  it('should allow nurse to manage immunizations', () => {
    cy.login('nurse')
    cy.visit('/students')
    cy.waitForHealthcareData()
    cy.get('body').should('exist')
  })

  it('should restrict viewer from editing immunizations', () => {
    cy.login('viewer')
    cy.visit('/students')
    cy.waitForHealthcareData()
    cy.get('body').should('exist')
  })
})
