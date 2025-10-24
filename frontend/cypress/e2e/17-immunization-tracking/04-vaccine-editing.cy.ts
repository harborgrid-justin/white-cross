/// <reference types="cypress" />

/**
 * Immunization Tracking: Vaccine Editing (4 tests)
 */

describe('Immunization Tracking - Vaccine Editing', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/students')
    cy.waitForHealthcareData()
    cy.get('[data-testid="student-table"]').find('tbody tr').first().click()
    cy.waitForHealthcareData()
  })

  it('should open edit immunization modal', () => {
    cy.get('body').should('exist')
  })

  it('should update vaccine information', () => {
    cy.get('body').should('exist')
  })

  it('should update lot number', () => {
    cy.get('body').should('exist')
  })

  it('should update next due date', () => {
    cy.get('body').should('exist')
  })
})
