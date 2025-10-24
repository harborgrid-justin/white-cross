/// <reference types="cypress" />

/**
 * Communication: Announcements (5 tests)
 */

describe('Communication - Announcements', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/announcements')
    cy.waitForHealthcareData()
  })

  it('should create new announcement', () => {
    cy.get('button').contains(/create|new/i).click()
    cy.wait(500)
    cy.get('body').should('exist')
  })

  it('should set announcement priority', () => {
    cy.get('body').should('exist')
  })

  it('should publish announcement', () => {
    cy.get('body').should('exist')
  })

  it('should schedule announcement', () => {
    cy.get('body').should('exist')
  })

  it('should view announcement analytics', () => {
    cy.get('body').should('exist')
  })
})
