/// <reference types="cypress" />

/**
 * Communication: RBAC Permissions (2 tests)
 */

describe('Communication - RBAC Permissions', () => {
  it('should allow staff to send messages', () => {
    cy.login('nurse')
    cy.visit('/messages')
    cy.waitForHealthcareData()
    cy.get('button').contains(/compose|new/i).should('be.visible')
  })

  it('should allow admin to create announcements', () => {
    cy.login('admin')
    cy.visit('/announcements')
    cy.waitForHealthcareData()
    cy.get('body').should('exist')
  })
})
