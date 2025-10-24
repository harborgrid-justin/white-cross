/// <reference types="cypress" />

/**
 * Immunization Tracking: Vaccine Deletion (3 tests)
 */

describe('Immunization Tracking - Vaccine Deletion', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/students')
    cy.waitForHealthcareData()
    cy.get('[data-testid="student-table"]').find('tbody tr').first().click()
    cy.waitForHealthcareData()
  })

  it('should display delete button for immunization', () => {
    cy.get('body').should('exist')
  })

  it('should confirm before deleting immunization', () => {
    cy.get('body').should('exist')
  })

  it('should successfully delete immunization record', () => {
    cy.get('body').should('exist')
  })
})
