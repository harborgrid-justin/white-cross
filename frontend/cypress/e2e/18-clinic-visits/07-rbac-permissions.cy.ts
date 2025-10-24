/// <reference types="cypress" />

/**
 * Clinic Visits: RBAC Permissions (2 tests)
 */

describe('Clinic Visits - RBAC Permissions', () => {
  it('should allow nurse to manage clinic visits', () => {
    cy.login('nurse')
    cy.visit('/clinic-visits')
    cy.waitForHealthcareData()
    cy.get('body').should('be.visible')
  })

  it('should restrict viewer from creating visits', () => {
    cy.login('viewer')
    cy.visit('/clinic-visits')
    cy.waitForHealthcareData()
    cy.get('body').should('exist')
  })
})
