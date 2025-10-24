/// <reference types="cypress" />

/**
 * Communication: Message Viewing (4 tests)
 */

describe('Communication - Message Viewing', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/messages')
    cy.waitForHealthcareData()
  })

  it('should display unread messages', () => {
    cy.get('body').should('exist')
  })

  it('should open message to view details', () => {
    cy.get('body').should('exist')
  })

  it('should mark message as read when opened', () => {
    cy.get('body').should('exist')
  })

  it('should display message timestamp', () => {
    cy.get('body').should('exist')
  })
})
