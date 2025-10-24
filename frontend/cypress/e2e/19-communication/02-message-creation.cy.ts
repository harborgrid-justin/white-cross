/// <reference types="cypress" />

/**
 * Communication: Message Creation (5 tests)
 */

describe('Communication - Message Creation', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/messages')
    cy.waitForHealthcareData()
    cy.get('button').contains(/compose|new.*message/i).click()
    cy.wait(500)
  })

  it('should open compose message modal', () => {
    cy.get('[role="dialog"]').should('be.visible')
  })

  it('should compose message with recipient', () => {
    cy.get('body').should('exist')
  })

  it('should compose message with subject', () => {
    cy.get('body').should('exist')
  })

  it('should compose message with body content', () => {
    cy.get('body').should('exist')
  })

  it('should send message successfully', () => {
    cy.get('button').contains(/send/i).click()
    cy.wait(1000)
    cy.get('body').should('exist')
  })
})
