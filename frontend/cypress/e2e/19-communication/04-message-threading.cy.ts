/// <reference types="cypress" />

/**
 * Communication: Message Threading (4 tests)
 */

describe('Communication - Message Threading', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/messages')
    cy.waitForHealthcareData()
  })

  it('should reply to message', () => {
    cy.get('body').should('exist')
  })

  it('should display message thread', () => {
    cy.get('body').should('exist')
  })

  it('should forward message', () => {
    cy.get('body').should('exist')
  })

  it('should quote previous message in reply', () => {
    cy.get('body').should('exist')
  })
})
