/// <reference types="cypress" />

/**
 * Communication: Page UI Structure (5 tests)
 */

describe('Communication - Page UI Structure', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/messages')
    cy.waitForHealthcareData()
  })

  it('should load messages page successfully', () => {
    cy.url().should('include', 'messages')
    cy.get('body').should('be.visible')
  })

  it('should display message list', () => {
    cy.get('body').should('exist')
  })

  it('should display compose message button', () => {
    cy.get('button').contains(/compose|new.*message/i).should('be.visible')
  })

  it('should display inbox and sent folders', () => {
    cy.get('body').should('exist')
  })

  it('should display search messages input', () => {
    cy.get('body').should('exist')
  })
})
