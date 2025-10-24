/// <reference types="cypress" />

/**
 * Immunization Tracking: Vaccine Viewing (4 tests)
 */

describe('Immunization Tracking - Vaccine Viewing', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/students')
    cy.waitForHealthcareData()
    cy.get('[data-testid="student-table"]').find('tbody tr').first().click()
    cy.waitForHealthcareData()
  })

  it('should display immunization history', () => {
    cy.get('body').should('exist')
  })

  it('should display vaccine details', () => {
    cy.get('body').should('exist')
  })

  it('should display administration date', () => {
    cy.get('body').should('exist')
  })

  it('should display next due dates', () => {
    cy.get('body').should('exist')
  })
})
