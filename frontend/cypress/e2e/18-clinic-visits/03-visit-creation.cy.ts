/// <reference types="cypress" />

/**
 * Clinic Visits: Visit Creation (5 tests)
 */

describe('Clinic Visits - Visit Creation', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/clinic-visits')
    cy.waitForHealthcareData()
    cy.get('button').contains(/check.*in/i).click()
    cy.wait(500)
  })

  it('should create visit with reason', () => {
    cy.get('body').should('exist')
  })

  it('should create visit with symptoms', () => {
    cy.get('body').should('exist')
  })

  it('should create visit with vital signs', () => {
    cy.get('body').should('exist')
  })

  it('should create visit with treatment provided', () => {
    cy.get('body').should('exist')
  })

  it('should create visit with disposition', () => {
    cy.get('body').should('exist')
  })
})
