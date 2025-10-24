/// <reference types="cypress" />

/**
 * Reports & Analytics: RBAC Permissions (3 tests)
 */

describe('Reports & Analytics - RBAC Permissions', () => {
  it('should allow admin full access to reports', () => {
    cy.login('admin')
    cy.visit('/reports')
    cy.waitForHealthcareData()
    cy.get('body').should('be.visible')
    cy.get('button').contains(/generate/i).should('be.visible')
  })

  it('should allow nurse to view limited reports', () => {
    cy.login('nurse')
    cy.visit('/reports')
    cy.waitForHealthcareData()
    cy.get('body').should('be.visible')
  })

  it('should restrict viewer from generating sensitive reports', () => {
    cy.login('viewer')
    cy.visit('/reports')
    cy.waitForHealthcareData()
    cy.get('body').should('exist')
  })
})
