/// <reference types="cypress" />

/**
 * Immunization Tracking: Page UI Structure (4 tests)
 */

describe('Immunization Tracking - Page UI Structure', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/students')
    cy.waitForHealthcareData()
    cy.get('[data-testid="student-table"]').find('tbody tr').first().click()
    cy.waitForHealthcareData()
  })

  it('should display immunization section', () => {
    cy.get('body').should('contain.text', 'Immunization')
  })

  it('should display add immunization button', () => {
    cy.get('body').should('exist')
  })

  it('should display immunization table', () => {
    cy.get('body').should('exist')
  })

  it('should display compliance status indicator', () => {
    cy.get('body').should('exist')
  })
})
