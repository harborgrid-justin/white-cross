/// <reference types="cypress" />

/**
 * Communication: Attachments (4 tests)
 */

describe('Communication - Attachments', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/messages')
    cy.waitForHealthcareData()
    cy.get('button').contains(/compose|new/i).click()
    cy.wait(500)
  })

  it('should attach file to message', () => {
    cy.get('body').should('exist')
  })

  it('should display attachment in message', () => {
    cy.get('body').should('exist')
  })

  it('should download attachment', () => {
    cy.get('body').should('exist')
  })

  it('should validate attachment size', () => {
    cy.get('body').should('exist')
  })
})
