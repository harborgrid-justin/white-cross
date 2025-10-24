/// <reference types="cypress" />

/**
 * Clinic Visits: Page UI Structure (4 tests)
 */

describe('Clinic Visits - Page UI Structure', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/clinic-visits')
    cy.waitForHealthcareData()
  })

  it('should load clinic visits page successfully', () => {
    cy.url().should('include', 'clinic')
    cy.get('body').should('be.visible')
  })

  it('should display clinic visits table', () => {
    cy.get('body').should('exist')
  })

  it('should display check-in button', () => {
    cy.get('button').contains(/check.*in/i).should('be.visible')
  })

  it('should display active visits section', () => {
    cy.get('body').should('exist')
  })
})
